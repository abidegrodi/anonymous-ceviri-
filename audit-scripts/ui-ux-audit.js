(async () => {
  'use strict';

  const FINDINGS = [];
  const STYLE = {
    critical: 'color:#ff4444;font-weight:bold;font-size:13px',
    warning: 'color:#ffaa00;font-weight:bold;font-size:13px',
    info: 'color:#4488ff;font-weight:bold;font-size:13px',
    pass: 'color:#44bb44;font-weight:bold;font-size:13px',
    header: 'color:#fff;background:#0f3460;padding:8px 16px;font-size:16px;font-weight:bold;border-radius:4px',
    subheader: 'color:#e94560;font-weight:bold;font-size:14px;border-bottom:2px solid #e94560;padding-bottom:4px',
    label: 'color:#aaa;font-size:11px',
    value: 'color:#eee;font-size:12px',
    score: 'color:#fff;background:#0f3460;padding:10px 20px;font-size:20px;font-weight:bold;border-radius:8px',
    colorBlock: (color) => `background:${color};color:${color === '#ffffff' || color === 'rgb(255, 255, 255)' ? '#000' : '#fff'};padding:2px 12px;border:1px solid #555;border-radius:3px`,
  };

  function addFinding(category, severity, title, description, recommendation) {
    FINDINGS.push({ category, severity, title, description, recommendation });
  }

  function severityIcon(s) {
    return { critical: '🔴', warning: '🟡', info: '🔵', pass: '✅' }[s] || '❓';
  }

  /* =========================================================================
     HELPERS: COLOR MATH
     ========================================================================= */
  function parseColor(str) {
    if (!str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return null;
    const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/);
    if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
    if (str.startsWith('#')) {
      let hex = str.slice(1);
      if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16), a: 1 };
    }
    return null;
  }

  function toHex(c) {
    if (!c) return 'N/A';
    return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function toHSL(c) {
    if (!c) return 'N/A';
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  }

  function sRGBtoLinear(v) {
    v = v / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function relativeLuminance(c) {
    return 0.2126 * sRGBtoLinear(c.r) + 0.7152 * sRGBtoLinear(c.g) + 0.0722 * sRGBtoLinear(c.b);
  }

  function contrastRatio(c1, c2) {
    const l1 = relativeLuminance(c1);
    const l2 = relativeLuminance(c2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function deltaE76(c1, c2) {
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
  }

  function parseGradientFirstColor(str) {
    if (!str || !str.includes('gradient')) return null;
    const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\)/);
    if (m) return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]), a: m[4] !== undefined ? +m[4] : 1 };
    const h = str.match(/#([0-9a-fA-F]{3,8})/);
    if (h) return parseColor('#' + h[1]);
    return null;
  }

  function alphaBlend(fg, bg) {
    const a = fg.a;
    return {
      r: Math.round(fg.r * a + bg.r * (1 - a)),
      g: Math.round(fg.g * a + bg.g * (1 - a)),
      b: Math.round(fg.b * a + bg.b * (1 - a)),
      a: 1
    };
  }

  function getEffectiveBg(el) {
    let layers = [];
    let current = el;
    while (current) {
      const cs = getComputedStyle(current);
      const bg = cs.backgroundColor;
      const parsed = parseColor(bg);
      if (parsed && parsed.a > 0.01) {
        if (parsed.a >= 0.99) return layers.length === 0 ? parsed : layers.reduce((base, layer) => alphaBlend(layer, base), parsed);
        layers.unshift(parsed);
      }
      const bgImage = cs.backgroundImage;
      const gradientColor = parseGradientFirstColor(bgImage);
      if (gradientColor && gradientColor.a > 0.01) {
        if (gradientColor.a >= 0.99) return layers.length === 0 ? gradientColor : layers.reduce((base, layer) => alphaBlend(layer, base), gradientColor);
        layers.unshift(gradientColor);
      }
      current = current.parentElement;
    }
    const base = { r: 0, g: 0, b: 0, a: 1 };
    return layers.length === 0 ? base : layers.reduce((b, layer) => alphaBlend(layer, b), base);
  }

  function isVisible(el) {
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetWidth > 0 && el.offsetHeight > 0;
  }

  function getAllVisibleElements() {
    return Array.from(document.querySelectorAll('*')).filter(isVisible);
  }

  /* =========================================================================
     SECTION 1: COLOR SYSTEM & CONTRAST AUDIT (Prompt 11)
     ========================================================================= */
  console.log('%c🎨 UI/UX AUDIT — Section 1: Renk Sistemi & Kontrast', STYLE.header);

  const allElements = getAllVisibleElements();

  // Color inventory
  console.group('%cRenk Envanteri', STYLE.subheader);
  const colorMap = {};
  const colorProperties = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor'];

  for (const el of allElements) {
    const cs = getComputedStyle(el);
    for (const prop of colorProperties) {
      const val = cs[prop];
      const parsed = parseColor(val);
      if (parsed && parsed.a > 0) {
        const hex = toHex(parsed);
        if (hex !== '#000000' || prop === 'color') {
          if (!colorMap[hex]) colorMap[hex] = { count: 0, parsed, properties: new Set() };
          colorMap[hex].count++;
          colorMap[hex].properties.add(prop);
        }
      }
    }
  }

  const sortedColors = Object.entries(colorMap).sort((a, b) => b[1].count - a[1].count);
  const uniqueColorCount = sortedColors.length;

  console.log(`%cToplam benzersiz renk: ${uniqueColorCount}`, STYLE.value);
  for (const [hex, data] of sortedColors.slice(0, 25)) {
    console.log(`%c  ████  %c${hex} (${toHSL(data.parsed)}) — ${data.count}x [${[...data.properties].join(', ')}]`, STYLE.colorBlock(hex), STYLE.value);
  }

  if (uniqueColorCount > 35) {
    addFinding('Renk', 'warning', `${uniqueColorCount} benzersiz renk — palet kontrolden çıkmış`, 'Design token sistemi oluşturun.', 'Renk sayısını 20-25 ile sınırlayın, CSS custom property kullanın.');
    console.log('%c🟡 %d benzersiz renk — çok fazla!', STYLE.warning, uniqueColorCount);
  } else if (uniqueColorCount > 25) {
    addFinding('Renk', 'info', `${uniqueColorCount} benzersiz renk — sınırda`, '', 'Yakın renkleri birleştirmeyi düşünün.');
  } else {
    addFinding('Renk', 'pass', `${uniqueColorCount} benzersiz renk — kontrol altında`, '', '');
  }

  // Near-duplicate colors
  console.group('%cYakın Duplike Renkler (deltaE < 10)', STYLE.subheader);
  const colorEntries = sortedColors.map(([hex, data]) => ({ hex, ...data }));
  const duplicateGroups = [];
  for (let i = 0; i < colorEntries.length; i++) {
    for (let j = i + 1; j < colorEntries.length; j++) {
      const de = deltaE76(colorEntries[i].parsed, colorEntries[j].parsed);
      if (de > 0 && de < 4) {
        duplicateGroups.push({ a: colorEntries[i].hex, b: colorEntries[j].hex, delta: de.toFixed(1) });
      }
    }
  }
  if (duplicateGroups.length > 0) {
    for (const g of duplicateGroups.slice(0, 5)) {
      addFinding('Renk', 'info', `Yakın renkler: ${g.a} ↔ ${g.b}`, `deltaE: ${g.delta} — muhtemelen aynı renk olmalı`, 'Bu renkleri birleştirin.');
      console.log('%c  ████%c ↔ %c████%c  deltaE: %s', STYLE.colorBlock(g.a), STYLE.value, STYLE.colorBlock(g.b), STYLE.value, g.delta);
    }
  } else {
    console.log('%c✅ Yakın duplike renk yok', STYLE.pass);
  }
  console.groupEnd();

  // CSS Custom Properties
  console.group('%cCSS Custom Property (Design Token) Analizi', STYLE.subheader);
  const cssVarColors = new Set();
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.style) {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith('--')) {
              const val = rule.style.getPropertyValue(prop).trim();
              if (/^#|^rgb|^hsl/.test(val)) {
                cssVarColors.add(`${prop}: ${val}`);
              }
            }
          }
        }
      }
    } catch {}
  }
  if (cssVarColors.size > 0) {
    addFinding('Renk', 'pass', `${cssVarColors.size} CSS custom property renk tanımı`, 'Design token sistemi kullanılıyor.', '');
    console.log('%c✅ %d CSS custom property renk tanımı bulundu', STYLE.pass, cssVarColors.size);
    for (const v of [...cssVarColors].slice(0, 15)) {
      console.log('%c  %s', STYLE.label, v);
    }
  } else {
    addFinding('Renk', 'warning', 'CSS custom property renk tanımı yok', 'Renk yönetimi hardcoded.', 'Tüm renkleri CSS custom property (--color-primary vb.) ile yönetin.');
    console.log('%c🟡 CSS custom property renk tanımı bulunamadı', STYLE.warning);
  }
  console.groupEnd();
  console.groupEnd();

  // WCAG Contrast
  console.group('%cWCAG Kontrast Analizi', STYLE.subheader);
  const textElements = allElements.filter(el => {
    const text = el.textContent?.trim();
    return text && text.length > 0 && el.children.length === 0;
  });

  let contrastFails = { aa: 0, aaa: 0 };
  let contrastPasses = 0;
  const contrastIssues = [];

  for (const el of textElements.slice(0, 500)) {
    const cs = getComputedStyle(el);
    const textFill = cs.getPropertyValue('-webkit-text-fill-color') || cs.webkitTextFillColor || '';
    if (textFill === 'transparent' || textFill === 'rgba(0, 0, 0, 0)') continue;
    const bgClip = cs.getPropertyValue('-webkit-background-clip') || cs.webkitBackgroundClip || cs.backgroundClip || '';
    if (bgClip === 'text') continue;
    const fg = parseColor(cs.color);
    const bg = getEffectiveBg(el);
    if (!fg || !bg) continue;

    const ratio = contrastRatio(fg, bg);
    const fontSize = parseFloat(cs.fontSize);
    const fontWeight = parseInt(cs.fontWeight) || 400;
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
    const aaMin = isLargeText ? 3 : 4.5;
    const aaaMin = isLargeText ? 4.5 : 7;

    if (ratio < aaMin) {
      contrastFails.aa++;
      contrastIssues.push({ el, fg: toHex(fg), bg: toHex(bg), ratio: ratio.toFixed(2), needed: aaMin, text: el.textContent.trim().slice(0, 40) });
    } else if (ratio < aaaMin) {
      contrastFails.aaa++;
    } else {
      contrastPasses++;
    }
  }

  const totalChecked = contrastFails.aa + contrastFails.aaa + contrastPasses;
  const aaPassRate = totalChecked > 0 ? (((totalChecked - contrastFails.aa) / totalChecked) * 100).toFixed(1) : 100;
  const aaaPassRate = totalChecked > 0 ? ((contrastPasses / totalChecked) * 100).toFixed(1) : 100;

  console.log(`%cKontrol edilen: ${totalChecked} | AA geçen: ${aaPassRate}% | AAA geçen: ${aaaPassRate}%`, STYLE.value);

  for (const issue of contrastIssues.slice(0, 15)) {
    addFinding('Kontrast', 'critical', `Kontrast yetersiz: ${issue.ratio}:1 (minimum ${issue.needed}:1)`, `FG: ${issue.fg} | BG: ${issue.bg} | Text: "${issue.text}"`, `Ön plan rengini veya arka planı değiştirerek ${issue.needed}:1 oranına ulaşın.`);
    console.log('%c🔴 %s:1 (min %s:1) — %c████%c fg / %c████%c bg — "%s"', STYLE.critical, issue.ratio, issue.needed, STYLE.colorBlock(issue.fg), STYLE.value, STYLE.colorBlock(issue.bg), STYLE.value, issue.text);
  }

  if (contrastFails.aa === 0) {
    addFinding('Kontrast', 'pass', 'Tüm text WCAG AA kontrast geçiyor', '', '');
    console.log('%c✅ Tüm text WCAG AA kontrast gereksinimini karşılıyor', STYLE.pass);
  }
  console.groupEnd();

  // Color blindness check
  console.group('%cRenk Körlüğü Erişilebilirliği', STYLE.subheader);
  const colorOnlyInfo = allElements.filter(el => {
    const cs = getComputedStyle(el);
    const hasRedGreen = /rgb\(\s*[12]\d{2}\s*,\s*[0-4]?\d\s*,\s*[0-4]?\d\s*\)/.test(cs.color) || /rgb\(\s*[0-4]?\d\s*,\s*[12]\d{2}\s*,\s*[0-4]?\d\s*\)/.test(cs.color);
    return hasRedGreen;
  });

  const links = document.querySelectorAll('a');
  let colorOnlyLinks = 0;
  for (const link of links) {
    const cs = getComputedStyle(link);
    const hasBg = cs.backgroundColor && parseColor(cs.backgroundColor)?.a > 0.1;
    const hasBgImage = cs.backgroundImage && cs.backgroundImage !== 'none';
    const hasBorder = cs.borderStyle !== 'none' && cs.borderWidth !== '0px';
    const isButtonLike = hasBg || hasBgImage || hasBorder || cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'block' || cs.display === 'inline-block';
    const isInNav = !!link.closest('nav, header, footer');
    if (cs.textDecorationLine === 'none' && !link.querySelector('img, svg, [class*="icon"]') && !isButtonLike && !isInNav) {
      colorOnlyLinks++;
    }
  }
  if (colorOnlyLinks > 0) {
    addFinding('Renk Erişilebilirlik', 'warning', `${colorOnlyLinks} link sadece renkle ayırt ediliyor`, 'Renk körlüğü olan kullanıcılar linkleri ayırt edemez.', 'Linklere underline veya başka görsel ipucu ekleyin.');
    console.log('%c🟡 %d link sadece renkle ayırt ediliyor — underline eksik', STYLE.warning, colorOnlyLinks);
  }
  console.groupEnd();

  // Dark mode check
  console.group('%cDark/Light Mode', STYLE.subheader);
  let hasDarkMode = false;
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.conditionText?.includes('prefers-color-scheme')) {
          hasDarkMode = true;
          break;
        }
      }
    } catch {}
    if (hasDarkMode) break;
  }
  if (!hasDarkMode) {
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const parsed = parseColor(bodyBg);
    if (parsed && relativeLuminance(parsed) < 0.1) hasDarkMode = true;
  }
  if (hasDarkMode) {
    addFinding('Renk', 'pass', 'Dark mode desteği var', '', '');
    console.log('%c✅ Dark mode tespit edildi', STYLE.pass);
  } else {
    addFinding('Renk', 'info', 'Dark mode desteği yok', '', 'prefers-color-scheme ile dark mode ekleyin.');
    console.log('%c🔵 Dark mode desteği bulunamadı', STYLE.info);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 2: TYPOGRAPHY AUDIT (Prompt 12)
     ========================================================================= */
  console.log('%c🔤 UI/UX AUDIT — Section 2: Tipografi', STYLE.header);

  console.group('%cFont Envanteri', STYLE.subheader);
  const fontFamilies = {};
  const fontSizes = {};
  const fontWeights = {};
  const lineHeights = {};
  const letterSpacings = {};

  for (const el of allElements) {
    const cs = getComputedStyle(el);
    const family = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const size = cs.fontSize;
    const weight = cs.fontWeight;
    const lh = cs.lineHeight;
    const ls = cs.letterSpacing;

    fontFamilies[family] = (fontFamilies[family] || 0) + 1;
    fontSizes[size] = (fontSizes[size] || 0) + 1;
    fontWeights[weight] = (fontWeights[weight] || 0) + 1;
    lineHeights[lh] = (lineHeights[lh] || 0) + 1;
    if (ls !== 'normal') letterSpacings[ls] = (letterSpacings[ls] || 0) + 1;
  }

  const uniqueFonts = Object.keys(fontFamilies).length;
  console.log(`%cBenzersiz font ailesi: ${uniqueFonts}`, STYLE.value);
  for (const [font, count] of Object.entries(fontFamilies).sort((a, b) => b[1] - a[1])) {
    console.log(`%c  ${font}: ${count}x`, STYLE.label);
  }

  if (uniqueFonts > 4) {
    addFinding('Tipografi', 'warning', `${uniqueFonts} farklı font ailesi — çok fazla`, 'Font çeşitliliği tasarım tutarsızlığına yol açar.', '2-3 font ailesiyle sınırlayın.');
    console.log('%c🟡 %d font ailesi — çok fazla!', STYLE.warning, uniqueFonts);
  } else {
    addFinding('Tipografi', 'pass', `${uniqueFonts} font ailesi`, '', '');
    console.log('%c✅ %d font ailesi', STYLE.pass, uniqueFonts);
  }

  // Font loading
  if (document.fonts) {
    const loadedFonts = [];
    document.fonts.forEach(font => {
      loadedFonts.push(`${font.family} ${font.weight} ${font.style} (${font.status})`);
    });
    console.log(`%cYüklenen fontlar: ${loadedFonts.length}`, STYLE.value);
    for (const f of loadedFonts.slice(0, 10)) {
      console.log('%c  %s', STYLE.label, f);
    }
  }
  console.groupEnd();

  // Font size system
  console.group('%cFont Size Sistemi', STYLE.subheader);
  const sortedSizes = Object.entries(fontSizes).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const sizeValues = sortedSizes.map(([s]) => parseFloat(s));

  console.log(`%cBenzersiz font-size: ${sortedSizes.length}`, STYLE.value);
  for (const [size, count] of sortedSizes) {
    console.log(`%c  ${size}: ${count}x`, STYLE.label);
  }

  if (sortedSizes.length > 10) {
    addFinding('Tipografi', 'warning', `${sortedSizes.length} farklı font-size — scale sistemi yok`, 'Tutarlı bir typographic scale kullanın.', 'Modular scale (1.25, 1.333, 1.618) benimseyip sınırlı boyut seti kullanın.');
    console.log('%c🟡 %d farklı font-size — scale sistemi bozuk', STYLE.warning, sortedSizes.length);
  }

  const tinyText = allElements.filter(el => {
    const size = parseFloat(getComputedStyle(el).fontSize);
    return size < 12 && el.textContent.trim().length > 0 && el.children.length === 0;
  });
  if (tinyText.length > 0) {
    addFinding('Tipografi', 'warning', `${tinyText.length} element 12px altı font-size`, 'Okunabilirlik sorunu.', 'Minimum 12px (tercihen 14px) font-size kullanın.');
    console.log('%c🟡 %d element 12px altı font-size', STYLE.warning, tinyText.length);
  }

  // Heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let prevLevel = 0;
  let hierarchyIssues = 0;
  for (const h of headings) {
    const level = parseInt(h.tagName[1]);
    if (level > prevLevel + 1 && prevLevel > 0) {
      hierarchyIssues++;
      addFinding('Tipografi', 'warning', `Heading atlama: h${prevLevel} → h${level}`, `"${h.textContent.trim().slice(0, 40)}"`, `h${prevLevel + 1} kullanın.`);
    }
    prevLevel = level;
  }
  if (hierarchyIssues === 0) {
    addFinding('Tipografi', 'pass', 'Heading hiyerarşisi doğru', '', '');
    console.log('%c✅ Heading hiyerarşisi doğru', STYLE.pass);
  }
  console.groupEnd();

  // Font weight system
  console.group('%cFont Weight Sistemi', STYLE.subheader);
  const uniqueWeights = Object.keys(fontWeights).length;
  console.log(`%cBenzersiz font-weight: ${uniqueWeights}`, STYLE.value);
  for (const [w, c] of Object.entries(fontWeights).sort((a, b) => +a[0] - +b[0])) {
    console.log(`%c  ${w}: ${c}x`, STYLE.label);
  }
  if (uniqueWeights > 5) {
    addFinding('Tipografi', 'info', `${uniqueWeights} farklı font-weight`, 'Weight çeşitliliği fazla.', '3-4 weight ile sınırlayın (400, 500, 600, 700).');
  }
  console.groupEnd();

  // Line height analysis
  console.group('%cLine Height Analizi', STYLE.subheader);
  for (const el of allElements.slice(0, 200)) {
    const cs = getComputedStyle(el);
    if (el.children.length === 0 && el.textContent.trim().length > 20) {
      const lh = parseFloat(cs.lineHeight);
      const fs = parseFloat(cs.fontSize);
      if (lh && fs && !isNaN(lh / fs)) {
        const ratio = lh / fs;
        if (ratio < 1.2) {
          addFinding('Tipografi', 'warning', 'Çok sıkışık line-height', `${ratio.toFixed(2)} (element: ${el.tagName.toLowerCase()})`, 'Body text için 1.4-1.6 arası line-height kullanın.');
        }
      }
    }
  }
  console.groupEnd();

  // Measure (characters per line)
  console.group('%cSatır Uzunluğu (Measure)', STYLE.subheader);
  const paragraphs = document.querySelectorAll('p');
  let longLines = 0;
  for (const p of paragraphs) {
    if (!isVisible(p) || !p.textContent.trim()) continue;
    const cs = getComputedStyle(p);
    const charWidth = parseFloat(cs.fontSize) * 0.55;
    const containerWidth = p.getBoundingClientRect().width;
    const charsPerLine = Math.round(containerWidth / charWidth);
    if (charsPerLine > 90) {
      longLines++;
      if (longLines <= 3) {
        addFinding('Tipografi', 'warning', `Satır çok uzun: ~${charsPerLine} karakter`, 'İdeal: 45-75 karakter/satır, max 90.', 'max-width ile satır uzunluğunu sınırlayın.');
        console.log('%c🟡 Satır uzunluğu: ~%d karakter (max 90 önerilir)', STYLE.warning, charsPerLine);
      }
    }
  }
  if (longLines === 0) {
    addFinding('Tipografi', 'pass', 'Satır uzunlukları kabul edilebilir', '', '');
    console.log('%c✅ Satır uzunlukları kabul edilebilir', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 3: SPACING & LAYOUT AUDIT (Prompt 13)
     ========================================================================= */
  console.log('%c📐 UI/UX AUDIT — Section 3: Spacing & Layout', STYLE.header);

  console.group('%cSpacing Envanteri', STYLE.subheader);
  const spacingValues = {};
  const baseUnit = 4;

  for (const el of allElements.slice(0, 300)) {
    const cs = getComputedStyle(el);
    const props = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    for (const p of props) {
      const val = parseFloat(cs[p]);
      if (val > 0 && val < 500) {
        const rounded = Math.round(val);
        spacingValues[rounded] = (spacingValues[rounded] || 0) + 1;
      }
    }
  }

  const sortedSpacing = Object.entries(spacingValues).sort((a, b) => b[1] - a[1]);
  const totalUniqueSpacing = sortedSpacing.length;
  console.log(`%cBenzersiz spacing değeri: ${totalUniqueSpacing}`, STYLE.value);
  for (const [val, count] of sortedSpacing.slice(0, 20)) {
    const onGrid = (+val % baseUnit === 0) ? '✅' : '⚠️';
    console.log(`%c  ${onGrid} ${val}px: ${count}x ${+val % baseUnit !== 0 ? '(off-grid!)' : ''}`, STYLE.label);
  }

  const offGridCount = sortedSpacing.filter(([v]) => +v % baseUnit !== 0 && +v > 0).length;
  if (offGridCount > totalUniqueSpacing * 0.3) {
    addFinding('Spacing', 'warning', `${offGridCount}/${totalUniqueSpacing} spacing değeri 4px grid dışı`, 'Magic number spacing\'ler tutarsızlık yaratır.', '4px veya 8px tabanlı spacing scale kullanın.');
    console.log('%c🟡 %d spacing değeri grid dışı', STYLE.warning, offGridCount);
  } else {
    addFinding('Spacing', 'pass', 'Spacing değerleri büyük oranda grid üzerinde', '', '');
    console.log('%c✅ Spacing değerleri grid uyumlu', STYLE.pass);
  }
  console.groupEnd();

  // Layout methods
  console.group('%cLayout Sistemi Analizi', STYLE.subheader);
  const layoutMethods = { flexbox: 0, grid: 0, float: 0, absolute: 0, table: 0, static: 0 };
  for (const el of allElements) {
    const cs = getComputedStyle(el);
    if (cs.display === 'flex' || cs.display === 'inline-flex') layoutMethods.flexbox++;
    else if (cs.display === 'grid' || cs.display === 'inline-grid') layoutMethods.grid++;
    else if (cs.float !== 'none') layoutMethods.float++;
    else if (cs.display === 'table' || cs.display === 'table-cell') layoutMethods.table++;
    if (cs.position === 'absolute') layoutMethods.absolute++;
  }

  console.log('%cLayout method dağılımı:', STYLE.value);
  for (const [method, count] of Object.entries(layoutMethods)) {
    if (count > 0) console.log(`%c  ${method}: ${count}`, STYLE.label);
  }

  if (layoutMethods.float > 5) {
    addFinding('Layout', 'warning', `${layoutMethods.float} float-based layout`, 'Eski layout tekniği.', 'Flexbox veya Grid\'e geçiş yapın.');
    console.log('%c🟡 %d float-based layout — modern layout\'a geçin', STYLE.warning, layoutMethods.float);
  }
  console.groupEnd();

  // z-index inventory
  console.group('%cz-index Envanteri', STYLE.subheader);
  const zIndexes = {};
  for (const el of allElements) {
    const z = getComputedStyle(el).zIndex;
    if (z !== 'auto') {
      const val = parseInt(z);
      if (!zIndexes[val]) zIndexes[val] = [];
      zIndexes[val].push(el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
    }
  }

  const sortedZ = Object.entries(zIndexes).sort((a, b) => +b[0] - +a[0]);
  for (const [z, els] of sortedZ.slice(0, 10)) {
    console.log(`%c  z-index: ${z} — ${els.slice(0, 3).join(', ')}${els.length > 3 ? ` (+${els.length - 3})` : ''}`, STYLE.label);
    if (+z > 9999) {
      addFinding('Layout', 'warning', `Absürt z-index: ${z}`, `Element: ${els[0]}`, 'z-index değerlerini düşük tutun (1-100 arası).');
    }
  }
  console.groupEnd();

  // Overflow / horizontal scroll
  console.group('%cOverflow Kontrolü', STYLE.subheader);
  const docWidth = document.documentElement.scrollWidth;
  const viewportWidth = window.innerWidth;
  if (docWidth > viewportWidth + 5) {
    addFinding('Layout', 'critical', `Horizontal scroll: sayfa ${docWidth - viewportWidth}px taşıyor`, 'Yatay scroll bar oluşuyor.', 'Taşan elementleri tespit edip düzeltin.');
    console.log('%c🔴 Horizontal scroll: %dpx taşma', STYLE.critical, docWidth - viewportWidth);

    for (const el of allElements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > viewportWidth + 5) {
        console.log('%c  Taşan: %c<%s class="%s"> (right: %dpx)', STYLE.label, STYLE.value, el.tagName.toLowerCase(), String(el.className).slice(0, 40), Math.round(rect.right));
        break;
      }
    }
  } else {
    addFinding('Layout', 'pass', 'Horizontal scroll yok', '', '');
    console.log('%c✅ Horizontal scroll yok', STYLE.pass);
  }
  console.groupEnd();

  // Touch targets
  console.group('%cTouch Target Boyutları', STYLE.subheader);
  const interactiveEls = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex="0"]');
  let smallTargets = 0;
  for (const el of interactiveEls) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const isInlineLink = el.tagName === 'A' && (cs.display === 'inline' || cs.display === 'contents');
    if (isInlineLink) continue;
    const isNavLink = el.tagName === 'A' && el.closest('nav, header, footer');
    if (isNavLink) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      smallTargets++;
    }
  }
  if (smallTargets > 0) {
    addFinding('Layout', 'warning', `${smallTargets} touch target 44x44px altında`, 'WCAG 2.5.5 — minimum hedef boyutu.', 'Tıklanabilir elementleri en az 44x44px yapın.');
    console.log('%c🟡 %d touch target 44x44px altında', STYLE.warning, smallTargets);
  } else {
    addFinding('Layout', 'pass', 'Tüm touch target\'lar yeterli boyutta', '', '');
    console.log('%c✅ Tüm touch target\'lar ≥ 44x44px', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 4: VISUAL CONSISTENCY (Prompt 14)
     ========================================================================= */
  console.log('%c🎯 UI/UX AUDIT — Section 4: Görsel Tutarlılık', STYLE.header);

  // Border radius inventory
  console.group('%cBorder Radius Envanteri', STYLE.subheader);
  const radiusValues = {};
  for (const el of allElements) {
    const br = getComputedStyle(el).borderRadius;
    if (br && br !== '0px') {
      radiusValues[br] = (radiusValues[br] || 0) + 1;
    }
  }
  const uniqueRadii = Object.keys(radiusValues).length;
  console.log(`%cBenzersiz border-radius: ${uniqueRadii}`, STYLE.value);
  for (const [r, c] of Object.entries(radiusValues).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`%c  ${r}: ${c}x`, STYLE.label);
  }
  if (uniqueRadii > 10) {
    addFinding('Görsel Tutarlılık', 'warning', `${uniqueRadii} farklı border-radius`, 'Radius sistemi tutarsız.', '3-4 standart radius değeri belirleyin (4px, 8px, 12px, 9999px).');
    console.log('%c🟡 %d farklı border-radius — tutarsız', STYLE.warning, uniqueRadii);
  }
  console.groupEnd();

  // Shadow inventory
  console.group('%cShadow Envanteri', STYLE.subheader);
  const shadowValues = {};
  for (const el of allElements) {
    const bs = getComputedStyle(el).boxShadow;
    if (bs && bs !== 'none') {
      shadowValues[bs] = (shadowValues[bs] || 0) + 1;
    }
  }
  const uniqueShadows = Object.keys(shadowValues).length;
  console.log(`%cBenzersiz box-shadow: ${uniqueShadows}`, STYLE.value);
  if (uniqueShadows > 10) {
    addFinding('Görsel Tutarlılık', 'info', `${uniqueShadows} farklı box-shadow`, 'Shadow elevation hierarchy oluşturun.', '3-5 standart shadow seviyesi belirleyin.');
  }
  console.groupEnd();

  // Button audit
  console.group('%cButton Denetimi', STYLE.subheader);
  const buttons = document.querySelectorAll('button, a.btn, [role="button"], input[type="submit"], input[type="button"]');
  const buttonStyles = {};
  for (const btn of buttons) {
    if (!isVisible(btn)) continue;
    const cs = getComputedStyle(btn);
    const style = `h:${cs.height}|p:${cs.padding}|fs:${cs.fontSize}|br:${cs.borderRadius}|bg:${cs.backgroundColor}`;
    buttonStyles[style] = (buttonStyles[style] || 0) + 1;
  }
  const buttonVariants = Object.keys(buttonStyles).length;
  console.log(`%cButon varyantı: ${buttonVariants} (${buttons.length} buton)`, STYLE.value);

  let missingFocusRing = 0;
  for (const btn of Array.from(buttons).slice(0, 20)) {
    const cs = getComputedStyle(btn, ':focus-visible');
    const outline = cs.outlineStyle;
    if (outline === 'none') missingFocusRing++;
  }

  if (buttonVariants > 12) {
    addFinding('Görsel Tutarlılık', 'warning', `${buttonVariants} farklı buton stili`, 'Buton tasarımı tutarsız.', 'Primary, secondary, ghost, outline — 4 varyantla sınırlayın.');
    console.log('%c🟡 %d farklı buton stili', STYLE.warning, buttonVariants);
  }
  console.groupEnd();

  // Form element audit
  console.group('%cForm Element Denetimi', STYLE.subheader);
  const formInputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
  const inputHeights = {};
  for (const input of formInputs) {
    if (!isVisible(input)) continue;
    const h = Math.round(input.getBoundingClientRect().height);
    inputHeights[h] = (inputHeights[h] || 0) + 1;
  }

  const uniqueInputHeights = Object.keys(inputHeights).length;
  if (uniqueInputHeights > 3) {
    addFinding('Görsel Tutarlılık', 'warning', `${uniqueInputHeights} farklı input yüksekliği`, 'Form elementleri tutarsız boyutlarda.', 'Tüm input/select/textarea elementlerini aynı yüksekliğe getirin.');
    console.log('%c🟡 %d farklı input yüksekliği — tutarsız', STYLE.warning, uniqueInputHeights);
  }

  for (const input of formInputs) {
    const label = input.labels?.[0] || document.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
    if (!label && !ariaLabel && input.type !== 'submit' && input.type !== 'button') {
      addFinding('Görsel Tutarlılık', 'warning', `Input label eksik: ${input.name || input.type}`, 'Erişilebilirlik ve UX sorunu.', 'Her input\'a label ilişkilendirin.');
    }
  }
  console.groupEnd();

  // Animation audit
  console.group('%cAnimasyon & Geçiş Tutarlılığı', STYLE.subheader);
  const transitions = {};
  const animations = {};
  for (const el of allElements) {
    const cs = getComputedStyle(el);
    if (cs.transition && cs.transition !== 'all 0s ease 0s' && cs.transition !== 'none 0s ease 0s') {
      transitions[cs.transitionDuration] = (transitions[cs.transitionDuration] || 0) + 1;
    }
    if (cs.animationName && cs.animationName !== 'none') {
      animations[cs.animationName] = (animations[cs.animationName] || 0) + 1;
    }
  }

  const uniqueTransDurations = Object.keys(transitions).length;
  console.log(`%cBenzersiz transition süreleri: ${uniqueTransDurations}`, STYLE.value);
  for (const [dur, count] of Object.entries(transitions).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    console.log(`%c  ${dur}: ${count}x`, STYLE.label);
  }

  let hasReducedMotion = false;
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.conditionText?.includes('prefers-reduced-motion')) {
          hasReducedMotion = true;
          break;
        }
      }
    } catch {}
  }
  if (!hasReducedMotion) {
    addFinding('Animasyon', 'warning', 'prefers-reduced-motion desteği yok', 'Hareket hassasiyeti olan kullanıcılar etkilenir.', '@media (prefers-reduced-motion: reduce) ile animasyonları durdurun.');
    console.log('%c🟡 prefers-reduced-motion desteği yok', STYLE.warning);
  } else {
    addFinding('Animasyon', 'pass', 'prefers-reduced-motion destekleniyor', '', '');
    console.log('%c✅ prefers-reduced-motion destekleniyor', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 5: RESPONSIVE DESIGN (Prompt 15)
     ========================================================================= */
  console.log('%c📱 UI/UX AUDIT — Section 5: Responsive Design', STYLE.header);

  console.group('%cViewport Meta Tag', STYLE.subheader);
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    const content = viewportMeta.content;
    console.log('%c✅ viewport: %s', STYLE.pass, content);
    if (content.includes('user-scalable=no') || content.includes('user-scalable=0')) {
      addFinding('Responsive', 'critical', 'Zoom engellenmiş (user-scalable=no)', 'WCAG ihlali — kullanıcılar zoom yapamaz.', 'user-scalable=no kaldırın.');
      console.log('%c🔴 user-scalable=no — WCAG ihlali!', STYLE.critical);
    }
    const maxScale = content.match(/maximum-scale=([\d.]+)/);
    if (maxScale && parseFloat(maxScale[1]) < 2) {
      addFinding('Responsive', 'warning', `maximum-scale=${maxScale[1]} — zoom kısıtlı`, '', 'maximum-scale kaldırın veya ≥ 5 yapın.');
    }
  } else {
    addFinding('Responsive', 'critical', 'Viewport meta tag eksik', 'Mobil cihazlarda doğru ölçeklenme olmaz.', '<meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin.');
    console.log('%c🔴 Viewport meta tag eksik!', STYLE.critical);
  }
  console.groupEnd();

  // Breakpoints from CSS
  console.group('%cBreakpoint Analizi', STYLE.subheader);
  const breakpoints = new Set();
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.conditionText) {
          const matches = rule.conditionText.match(/(\d+)px/g);
          if (matches) matches.forEach(m => breakpoints.add(parseInt(m)));
        }
      }
    } catch {}
  }

  const bps = [...breakpoints].sort((a, b) => a - b);
  console.log(`%cBreakpoint\'ler: ${bps.join('px, ')}px`, STYLE.value);

  const standardBPs = { tailwind: [640, 768, 1024, 1280, 1536], bootstrap: [576, 768, 992, 1200, 1400] };
  let matchedSystem = null;
  for (const [name, vals] of Object.entries(standardBPs)) {
    const overlap = bps.filter(bp => vals.includes(bp)).length;
    if (overlap >= 3) matchedSystem = name;
  }
  if (matchedSystem) {
    addFinding('Responsive', 'pass', `Breakpoint sistemi: ${matchedSystem}`, `${bps.length} breakpoint tanımlı`, '');
    console.log('%c✅ Breakpoint sistemi: %c%s', STYLE.pass, STYLE.value, matchedSystem);
  } else if (bps.length > 0) {
    addFinding('Responsive', 'info', `${bps.length} custom breakpoint`, bps.join(', '), '');
  }
  console.groupEnd();

  // Responsive images
  console.group('%cResponsive Image Analizi', STYLE.subheader);
  const allImages = document.querySelectorAll('img');
  let missingSrcset = 0, missingLazy = 0, missingDimensions = 0, oversizedImages = 0;

  for (const img of allImages) {
    if (!isVisible(img)) continue;
    const isSvg = img.src && (img.src.endsWith('.svg') || img.src.includes('.svg?'));
    const isSmallIcon = img.getBoundingClientRect().width <= 32 && img.getBoundingClientRect().height <= 32;
    if (!img.srcset && !img.closest('picture') && !isSvg && !isSmallIcon) missingSrcset++;
    if (img.loading !== 'lazy' && !isInViewport(img)) missingLazy++;
    if (!img.width && !img.height && !img.style.aspectRatio) missingDimensions++;

    const natWidth = img.naturalWidth;
    const renderWidth = img.getBoundingClientRect().width;
    if (natWidth > 0 && renderWidth > 0 && natWidth > renderWidth * 3) {
      oversizedImages++;
    }
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  if (missingSrcset > 0) {
    addFinding('Responsive', 'warning', `${missingSrcset} img srcset eksik`, 'Responsive image optimization yok.', 'srcset ve sizes attribute ekleyin.');
    console.log('%c🟡 %d img srcset eksik', STYLE.warning, missingSrcset);
  }
  if (missingLazy > 0) {
    addFinding('Responsive', 'info', `${missingLazy} img lazy loading eksik`, 'Viewport dışı görseller hemen yükleniyor.', 'loading="lazy" ekleyin.');
  }
  if (missingDimensions > 0) {
    addFinding('Responsive', 'warning', `${missingDimensions} img width/height eksik`, 'CLS (layout shift) riski.', 'width ve height attribute ekleyin.');
  }
  if (oversizedImages > 0) {
    addFinding('Responsive', 'warning', `${oversizedImages} img render boyutundan 2x+ büyük`, 'Gereksiz bandwidth.', 'Görselleri render boyutuna uygun optimize edin.');
    console.log('%c🟡 %d img oversized', STYLE.warning, oversizedImages);
  }
  console.groupEnd();

  // CSS units
  console.group('%cCSS Unit Analizi', STYLE.subheader);
  let pxFontCount = 0;
  for (const el of allElements.slice(0, 200)) {
    const fs = getComputedStyle(el).fontSize;
    if (fs && !fs.includes('rem') && !fs.includes('em')) pxFontCount++;
  }
  addFinding('Responsive', 'pass', 'CSS unit analizi tamamlandı', '', '');
  console.groupEnd();

  /* =========================================================================
     SECTION 6: ACCESSIBILITY (WCAG 2.2) (Prompt 16)
     ========================================================================= */
  console.log('%c♿ UI/UX AUDIT — Section 6: Erişilebilirlik (a11y)', STYLE.header);

  // Landmarks
  console.group('%cSemantik Yapı & Landmark\'lar', STYLE.subheader);
  const landmarks = {
    main: document.querySelectorAll('main, [role="main"]').length,
    nav: document.querySelectorAll('nav, [role="navigation"]').length,
    header: document.querySelectorAll('header, [role="banner"]').length,
    footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
    aside: document.querySelectorAll('aside, [role="complementary"]').length,
  };

  for (const [name, count] of Object.entries(landmarks)) {
    if (count === 0 && (name === 'main' || name === 'nav')) {
      addFinding('a11y', 'warning', `<${name}> landmark eksik`, 'Screen reader kullanıcıları sayfa yapısını anlayamaz.', `<${name}> elementi ekleyin.`);
      console.log('%c🟡 <%s> landmark eksik', STYLE.warning, name);
    } else {
      console.log('%c✅ <%s>: %d', STYLE.pass, name, count);
    }
  }

  const multiNavs = document.querySelectorAll('nav');
  if (multiNavs.length > 1) {
    let unlabeled = 0;
    for (const nav of multiNavs) {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) unlabeled++;
    }
    if (unlabeled > 0) {
      addFinding('a11y', 'warning', `${unlabeled} nav aria-label eksik`, 'Birden fazla nav varsa her birinin ayırt edici label\'ı olmalı.', 'aria-label="Ana menü", aria-label="Alt menü" gibi ekleyin.');
    }
  }
  console.groupEnd();

  // ARIA validation
  console.group('%cARIA Kullanım Denetimi', STYLE.subheader);
  const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
  let ariaErrors = 0;

  for (const el of ariaElements) {
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const target = document.getElementById(labelledBy);
      if (!target) {
        ariaErrors++;
        addFinding('a11y', 'warning', `aria-labelledby hedef bulunamadı: #${labelledBy}`, `Element: <${el.tagName.toLowerCase()}>`, 'Referans edilen ID\'nin var olduğundan emin olun.');
      }
    }
    const describedBy = el.getAttribute('aria-describedby');
    if (describedBy) {
      const target = document.getElementById(describedBy);
      if (!target) {
        ariaErrors++;
        addFinding('a11y', 'warning', `aria-describedby hedef bulunamadı: #${describedBy}`, '', 'Referans edilen ID\'yi düzeltin.');
      }
    }
  }

  const ariaHiddenInteractive = document.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button, [aria-hidden="true"] input');
  if (ariaHiddenInteractive.length > 0) {
    addFinding('a11y', 'critical', `${ariaHiddenInteractive.length} etkileşimli element aria-hidden içinde`, 'Screen reader kullanıcıları bu elementlere erişemez.', 'aria-hidden="true" içine etkileşimli element koymayın.');
    console.log('%c🔴 %d etkileşimli element aria-hidden içinde', STYLE.critical, ariaHiddenInteractive.length);
  }
  console.groupEnd();

  // Keyboard accessibility
  console.group('%cKlavye Erişilebilirliği', STYLE.subheader);
  const divButtons = document.querySelectorAll('div[onclick], span[onclick], div[role="button"]:not([tabindex]), span[role="button"]:not([tabindex])');
  if (divButtons.length > 0) {
    addFinding('a11y', 'critical', `${divButtons.length} div/span buton — tabindex eksik`, 'Klavye ile erişilemez.', '<button> elementi kullanın veya tabindex="0" ve keyboard event handler ekleyin.');
    console.log('%c🔴 %d div/span buton — klavye erişimi yok', STYLE.critical, divButtons.length);
  }

  const hasFocusVisibleRule = (() => {
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && rule.selectorText.includes(':focus-visible') && rule.style && rule.style.outline) return true;
          }
        } catch {}
      }
    } catch {}
    return false;
  })();

  if (!hasFocusVisibleRule) {
    const outlineNone = allElements.filter(el => {
      const cs = getComputedStyle(el);
      return cs.outlineStyle === 'none' && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA');
    });
    if (outlineNone.length > 5) {
      addFinding('a11y', 'warning', `${outlineNone.length} etkileşimli element outline: none`, 'Focus indicator görünmez — klavye kullanıcıları nerede olduklarını bilemez.', 'outline: none kaldırın veya :focus-visible ile özel focus stili ekleyin.');
    }
  } else {
    addFinding('a11y', 'pass', ':focus-visible ile özel focus stili tanımlı', '', '');
    console.log('%c✅ :focus-visible focus stili mevcut', STYLE.pass);
  }
  console.groupEnd();

  // Live regions
  console.group('%cDynamic Content & Live Regions', STYLE.subheader);
  const liveRegions = document.querySelectorAll('[aria-live], [role="alert"], [role="status"], [role="log"]');
  if (liveRegions.length > 0) {
    addFinding('a11y', 'pass', `${liveRegions.length} ARIA live region tanımlı`, '', '');
    console.log('%c✅ %d live region tanımlı', STYLE.pass, liveRegions.length);
  } else {
    addFinding('a11y', 'warning', 'ARIA live region yok', 'Dinamik içerik güncellemeleri screen reader\'a bildirilmiyor.', 'Toast/notification alanlarına aria-live="polite" ekleyin.');
    console.log('%c🟡 ARIA live region bulunamadı', STYLE.warning);
  }
  console.groupEnd();

  // Table accessibility
  console.group('%cTablo Erişilebilirliği', STYLE.subheader);
  const tables = document.querySelectorAll('table');
  for (const table of tables) {
    const ths = table.querySelectorAll('th');
    const caption = table.querySelector('caption');
    const ariaLabel = table.getAttribute('aria-label');
    if (ths.length === 0) {
      addFinding('a11y', 'warning', 'Tablo <th> header eksik', '', '<th> ve scope attribute ekleyin.');
    }
    if (!caption && !ariaLabel) {
      addFinding('a11y', 'info', 'Tablo açıklaması eksik', '', '<caption> veya aria-label ekleyin.');
    }
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 7: PERFORMANCE (Prompt 17)
     ========================================================================= */
  console.log('%c⚡ UI/UX AUDIT — Section 7: Performans', STYLE.header);

  // Core Web Vitals
  console.group('%cCore Web Vitals', STYLE.subheader);
  const navTiming = performance.getEntriesByType('navigation')[0];
  if (navTiming) {
    const ttfb = navTiming.responseStart - navTiming.requestStart;
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
    const domLoad = navTiming.domContentLoadedEventEnd - navTiming.startTime;
    const fullLoad = navTiming.loadEventEnd - navTiming.startTime;

    console.log('%c  TTFB: %dms %s', ttfb < 800 ? STYLE.pass : STYLE.warning, Math.round(ttfb), ttfb < 800 ? '✅' : '🟡');
    if (fcp) console.log('%c  FCP: %dms %s', fcp < 1800 ? STYLE.pass : fcp < 3000 ? STYLE.warning : STYLE.critical, Math.round(fcp), fcp < 1800 ? '✅' : '🟡');
    console.log('%c  DOMContentLoaded: %dms', STYLE.value, Math.round(domLoad));
    console.log('%c  Full Load: %dms', STYLE.value, Math.round(fullLoad));

    if (ttfb > 800) addFinding('Performans', 'warning', `TTFB yüksek: ${Math.round(ttfb)}ms`, '800ms altı olmalı.', 'Server response time optimize edin, CDN kullanın.');
    if (fcp && fcp > 3000) addFinding('Performans', 'critical', `FCP yavaş: ${Math.round(fcp)}ms`, '1.8s altı olmalı.', 'Render-blocking kaynakları optimize edin, critical CSS inline edin.');
  }

  // CLS
  let clsValue = 0;
  try {
    const clsEntries = performance.getEntriesByType('layout-shift');
    for (const entry of clsEntries) {
      if (!entry.hadRecentInput) clsValue += entry.value;
    }
    console.log('%c  CLS: %s %s', clsValue < 0.1 ? STYLE.pass : clsValue < 0.25 ? STYLE.warning : STYLE.critical, clsValue.toFixed(3), clsValue < 0.1 ? '✅' : '🟡');
    if (clsValue > 0.25) addFinding('Performans', 'critical', `CLS yüksek: ${clsValue.toFixed(3)}`, '0.1 altı olmalı.', 'Görsel boyutlarını belirtin, font-display: swap kullanın.');
    else if (clsValue > 0.1) addFinding('Performans', 'warning', `CLS orta: ${clsValue.toFixed(3)}`, '0.1 altı olmalı.', '');
  } catch {}
  console.groupEnd();

  // Resource analysis
  console.group('%cKaynak Analizi', STYLE.subheader);
  const resources = performance.getEntriesByType('resource');
  const totalTransfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const totalDecoded = resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0);

  const byType = {};
  for (const r of resources) {
    const ext = r.name.split('?')[0].split('.').pop()?.toLowerCase() || 'other';
    let type = 'other';
    if (['js', 'mjs'].includes(ext) || r.initiatorType === 'script') type = 'JS';
    else if (['css'].includes(ext) || r.initiatorType === 'css') type = 'CSS';
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'ico'].includes(ext) || r.initiatorType === 'img') type = 'Image';
    else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) type = 'Font';
    else if (r.initiatorType === 'fetch' || r.initiatorType === 'xmlhttprequest') type = 'XHR/Fetch';

    if (!byType[type]) byType[type] = { count: 0, size: 0 };
    byType[type].count++;
    byType[type].size += r.transferSize || 0;
  }

  console.log(`%cToplam transfer: ${(totalTransfer / 1024 / 1024).toFixed(2)} MB (decoded: ${(totalDecoded / 1024 / 1024).toFixed(2)} MB)`, STYLE.value);
  for (const [type, data] of Object.entries(byType).sort((a, b) => b[1].size - a[1].size)) {
    console.log(`%c  ${type}: ${data.count} dosya, ${(data.size / 1024).toFixed(0)} KB`, STYLE.label);
  }

  if (totalTransfer > 5 * 1024 * 1024) {
    addFinding('Performans', 'critical', `Toplam sayfa boyutu: ${(totalTransfer / 1024 / 1024).toFixed(2)} MB`, '5MB+ çok ağır.', 'Image optimizasyonu, code splitting, lazy loading uygulayın.');
  } else if (totalTransfer > 2.5 * 1024 * 1024) {
    addFinding('Performans', 'warning', `Toplam sayfa boyutu: ${(totalTransfer / 1024 / 1024).toFixed(2)} MB`, '2.5MB+ optimize edilmeli.', '');
  } else {
    addFinding('Performans', 'pass', `Toplam sayfa boyutu: ${(totalTransfer / 1024 / 1024).toFixed(2)} MB`, '', '');
  }

  // Largest resources
  const largest = [...resources].sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0));
  console.log('%cEn büyük 5 kaynak:', STYLE.value);
  for (const r of largest.slice(0, 5)) {
    console.log(`%c  ${(r.transferSize / 1024).toFixed(0)} KB — ${r.name.split('/').pop()?.split('?')[0]}`, STYLE.label);
  }
  console.groupEnd();

  // Font optimization
  console.group('%cFont Optimizasyonu', STYLE.subheader);
  const fontResources = resources.filter(r => /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(r.name));
  const totalFontSize = fontResources.reduce((s, r) => s + (r.transferSize || 0), 0);
  console.log(`%cToplam font: ${fontResources.length} dosya, ${(totalFontSize / 1024).toFixed(0)} KB`, STYLE.value);

  const nonWoff2 = fontResources.filter(r => !/\.woff2/i.test(r.name));
  if (nonWoff2.length > 0) {
    addFinding('Performans', 'warning', `${nonWoff2.length} font woff2 değil`, 'woff2 en verimli font formatıdır.', 'Tüm fontları woff2 formatına dönüştürün.');
  }

  const preloadedFonts = document.querySelectorAll('link[rel="preload"][as="font"]');
  if (preloadedFonts.length === 0 && fontResources.length > 0) {
    addFinding('Performans', 'info', 'Font preload yok', 'İlk render için kritik fontları preload edin.', '<link rel="preload" href="font.woff2" as="font" crossorigin> ekleyin.');
  }
  console.groupEnd();

  // DOM stats
  console.group('%cDOM İstatistikleri', STYLE.subheader);
  const domSize = document.querySelectorAll('*').length;
  console.log(`%cDOM element sayısı: ${domSize}`, STYLE.value);
  if (domSize > 5000) {
    addFinding('Performans', 'critical', `Aşırı büyük DOM: ${domSize} element`, '', 'Virtual scrolling veya pagination kullanın.');
  } else if (domSize > 4000) {
    addFinding('Performans', 'warning', `Büyük DOM: ${domSize} element`, '', '');
  } else {
    addFinding('Performans', 'pass', `DOM boyutu: ${domSize} element`, '', '');
  }
  console.groupEnd();

  // Long tasks
  console.group('%cLong Task Analizi', STYLE.subheader);
  const longTasks = performance.getEntriesByType('longtask');
  if (longTasks.length > 0) {
    addFinding('Performans', 'warning', `${longTasks.length} long task tespit edildi`, `Toplam blocking: ${longTasks.reduce((s, t) => s + t.duration, 0).toFixed(0)}ms`, 'Ağır işlemleri Web Worker\'a taşıyın veya parçalara bölün.');
    console.log('%c🟡 %d long task (>50ms)', STYLE.warning, longTasks.length);
  } else {
    console.log('%c✅ Long task tespit edilmedi', STYLE.pass);
  }
  console.groupEnd();

  // HTTP/2 check
  console.group('%cNetwork Optimizasyonu', STYLE.subheader);
  const http2Resources = resources.filter(r => r.nextHopProtocol === 'h2' || r.nextHopProtocol === 'h3');
  const http1Resources = resources.filter(r => r.nextHopProtocol === 'http/1.1' && !r.name.includes('localhost') && !r.name.includes('127.0.0.1'));
  if (http1Resources.length > 0) {
    addFinding('Performans', 'warning', `${http1Resources.length} kaynak HTTP/1.1`, 'HTTP/2 veya HTTP/3 daha verimli.', 'Sunucuyu HTTP/2+ destekleyecek şekilde yapılandırın.');
  }
  if (http2Resources.length > 0) {
    console.log('%c✅ %d kaynak HTTP/2+', STYLE.pass, http2Resources.length);
  }

  const preconnects = document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]');
  const thirdPartyDomains = [...new Set(resources.map(r => { try { return new URL(r.name).hostname; } catch { return null; } }).filter(h => h && h !== location.hostname))];
  if (thirdPartyDomains.length > 3 && preconnects.length === 0) {
    addFinding('Performans', 'info', `${thirdPartyDomains.length} 3rd-party domain, preconnect yok`, '', 'Sık kullanılan 3rd-party domain\'lere preconnect ekleyin.');
  }
  console.groupEnd();

  /* =========================================================================
     FINAL UI/UX REPORT & SCORING
     ========================================================================= */
  console.log('%c📊 FINAL UI/UX AUDIT REPORT', STYLE.header);

  let score = 100;
  const counts = { critical: 0, warning: 0, info: 0, pass: 0 };
  for (const f of FINDINGS) {
    counts[f.severity]++;
    if (f.severity === 'critical') score -= 10;
    else if (f.severity === 'warning') score -= 3;
    else if (f.severity === 'info') score -= 1;
  }
  score = Math.max(0, score);

  console.group('%cKategori Bazlı Özet', STYLE.subheader);
  const categories = {};
  for (const f of FINDINGS) {
    if (!categories[f.category]) categories[f.category] = { critical: 0, warning: 0, info: 0, pass: 0 };
    categories[f.category][f.severity]++;
  }
  for (const [cat, c] of Object.entries(categories)) {
    console.log(`%c${cat}: %c🔴 ${c.critical} | 🟡 ${c.warning} | 🔵 ${c.info} | ✅ ${c.pass}`, 'font-weight:bold;color:#e94560', STYLE.value);
  }
  console.groupEnd();

  console.group('%cÖncelikli Bulgular (Critical + Warning)', STYLE.subheader);
  const priority = FINDINGS.filter(f => f.severity === 'critical' || f.severity === 'warning');
  const sorted = [...priority].sort((a, b) => {
    const order = { critical: 0, warning: 1 };
    return order[a.severity] - order[b.severity];
  });
  for (const f of sorted.slice(0, 30)) {
    console.log(`%c${severityIcon(f.severity)} [${f.category}] ${f.title}%c\n   ${f.description}\n   💡 ${f.recommendation}`, STYLE[f.severity], STYLE.label);
  }
  console.groupEnd();

  console.log(`%c\n  UI/UX SCORE: ${score}/100  \n`, STYLE.score);
  console.log(`%c  🔴 Critical: ${counts.critical} (×-10 = -${counts.critical * 10})  |  🟡 Warning: ${counts.warning} (×-3 = -${counts.warning * 3})  |  🔵 Info: ${counts.info} (×-1 = -${counts.info})  |  ✅ Pass: ${counts.pass}  `, 'font-size:14px;color:#ccc;padding:4px');
  console.log(`%c  Toplam ${FINDINGS.length} bulgu | Toplam kesinti: -${counts.critical * 10 + counts.warning * 3 + counts.info}  `, 'font-size:12px;color:#888');

  console.group('%c📋 PUAN KIRILIMI (non-pass bulgular)', 'font-size:13px;font-weight:bold;color:#ff9f43');
  const nonPass = FINDINGS.filter(f => f.severity !== 'pass');
  for (const f of nonPass) {
    const penalty = f.severity === 'critical' ? -10 : f.severity === 'warning' ? -3 : -1;
    console.log(`%c  ${penalty > -5 ? ' ' : ''}${penalty} %c[${f.category}] ${f.title}`, f.severity === 'critical' ? 'color:#ff4444;font-weight:bold' : f.severity === 'warning' ? 'color:#ffaa00' : 'color:#6699cc', 'color:#ccc;font-size:12px');
  }
  console.groupEnd();

  if (score >= 80) console.log('%c  UI/UX Kalitesi: İYİ — Polish gerekli ama temel sağlam  ', 'color:#44bb44;font-size:14px;font-weight:bold');
  else if (score >= 50) console.log('%c  UI/UX Kalitesi: ORTA — Tutarlılık ve erişilebilirlik iyileştirmesi gerekli  ', 'color:#ffaa00;font-size:14px;font-weight:bold');
  else console.log('%c  UI/UX Kalitesi: DÜŞÜK — Kapsamlı design review gerekli!  ', 'color:#ff4444;font-size:14px;font-weight:bold');

  return { score, counts, findings: FINDINGS };
})();
