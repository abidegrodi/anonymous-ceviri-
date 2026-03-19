(async () => {
  'use strict';

  const FINDINGS = [];
  const STYLE = {
    critical: 'color:#ff4444;font-weight:bold;font-size:13px',
    warning: 'color:#ffaa00;font-weight:bold;font-size:13px',
    info: 'color:#4488ff;font-weight:bold;font-size:13px',
    pass: 'color:#44bb44;font-weight:bold;font-size:13px',
    header: 'color:#fff;background:#1a1a2e;padding:8px 16px;font-size:16px;font-weight:bold;border-radius:4px',
    subheader: 'color:#e94560;font-weight:bold;font-size:14px;border-bottom:2px solid #e94560;padding-bottom:4px',
    label: 'color:#aaa;font-size:11px',
    value: 'color:#eee;font-size:12px',
    score: 'color:#fff;background:#e94560;padding:10px 20px;font-size:20px;font-weight:bold;border-radius:8px',
  };

  function addFinding(category, severity, title, description, recommendation) {
    FINDINGS.push({ category, severity, title, description, recommendation });
  }

  function severityIcon(s) {
    return { critical: '🔴', warning: '🟡', info: '🔵', pass: '✅' }[s] || '❓';
  }

  function safeStringify(v, maxLen = 200) {
    try {
      const s = typeof v === 'string' ? v : JSON.stringify(v);
      return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
    } catch { return String(v).slice(0, maxLen); }
  }

  async function safeFetch(url, opts = {}) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch(url, { ...opts, signal: ctrl.signal });
      clearTimeout(timer);
      return r;
    } catch { return null; }
  }

  /* =========================================================================
     SECTION 1: HTTP RESPONSE HEADERS & PASSIVE RECONNAISSANCE
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 1: HTTP Headers & Passive Recon', STYLE.header);

  const SECURITY_HEADERS = [
    { name: 'Content-Security-Policy', critical: true, desc: 'XSS koruması — inline script/style kısıtlaması' },
    { name: 'X-Content-Type-Options', critical: false, desc: 'MIME sniffing koruması' },
    { name: 'X-Frame-Options', critical: true, desc: 'Clickjacking koruması' },
    { name: 'Strict-Transport-Security', critical: true, desc: 'HTTPS zorunluluğu (HSTS)' },
    { name: 'Referrer-Policy', critical: false, desc: 'Referrer bilgisi sızıntısı kontrolü' },
    { name: 'Permissions-Policy', critical: false, desc: 'Tarayıcı API erişim kontrolü' },
    { name: 'Cross-Origin-Opener-Policy', critical: false, desc: 'Cross-origin pencere izolasyonu' },
    { name: 'Cross-Origin-Embedder-Policy', critical: false, desc: 'Cross-origin kaynak yükleme kontrolü' },
    { name: 'Cross-Origin-Resource-Policy', critical: false, desc: 'Kaynak paylaşım politikası' },
    { name: 'X-XSS-Protection', critical: false, desc: 'Legacy XSS filtresi (modern CSP ile değiştirilmeli)' },
  ];

  try {
    const mainResp = await safeFetch(location.href, { method: 'HEAD' });
    if (mainResp) {
      console.group('%cSecurity Headers', STYLE.subheader);
      for (const h of SECURITY_HEADERS) {
        const val = mainResp.headers.get(h.name);
        if (val) {
          addFinding('Headers', 'pass', `${h.name} mevcut`, `Değer: ${val}`, 'Politikayı düzenli gözden geçirin.');
          console.log(`%c✅ ${h.name}:%c ${val}`, STYLE.pass, STYLE.value);
        } else {
          const sev = h.critical ? 'critical' : 'warning';
          addFinding('Headers', sev, `${h.name} EKSİK`, h.desc, `next.config.js headers() ile ekleyin.`);
          console.log(`%c${severityIcon(sev)} ${h.name}: EKSİK — ${h.desc}`, STYLE[sev]);
        }
      }

      const server = mainResp.headers.get('Server');
      const powered = mainResp.headers.get('X-Powered-By');
      if (server) {
        addFinding('Headers', 'warning', 'Server header açık', `Server: ${server}`, 'Server header bilgisini gizleyin.');
        console.log('%c🟡 Server header bilgi sızıntısı: %c' + server, STYLE.warning, STYLE.value);
      }
      if (powered) {
        addFinding('Headers', 'warning', 'X-Powered-By açık', `Değer: ${powered}`, 'next.config.js poweredByHeader:false yapın.');
        console.log('%c🟡 X-Powered-By bilgi sızıntısı: %c' + powered, STYLE.warning, STYLE.value);
      } else {
        addFinding('Headers', 'pass', 'X-Powered-By gizli', 'Framework bilgisi sızmıyor.', '');
        console.log('%c✅ X-Powered-By gizli', STYLE.pass);
      }

      const csp = mainResp.headers.get('Content-Security-Policy');
      if (csp) {
        console.group('%cCSP Detaylı Analiz', STYLE.subheader);
        const dangerousDirectives = ['unsafe-inline', 'unsafe-eval', 'data:', 'blob:'];
        for (const d of dangerousDirectives) {
          if (csp.includes(d)) {
            addFinding('Headers', 'critical', `CSP içinde ${d}`, `CSP politikasında tehlikeli directive: ${d}`, `${d} kullanımını kaldırın, nonce/hash tabanlı geçiş yapın.`);
            console.log(`%c🔴 CSP tehlikeli directive: ${d}`, STYLE.critical);
          }
        }
        if (!csp.includes('report-uri') && !csp.includes('report-to')) {
          addFinding('Headers', 'warning', 'CSP reporting yok', 'CSP ihlalleri raporlanmıyor.', 'report-uri veya report-to directive ekleyin.');
        }
        console.groupEnd();
      }
      console.groupEnd();
    }
  } catch (e) {
    console.warn('Header kontrolünde hata:', e.message);
  }

  // Mixed content
  console.group('%cMixed Content Kontrolü', STYLE.subheader);
  const allResources = performance.getEntriesByType('resource');
  const httpResources = allResources.filter(r => r.name.startsWith('http://'));
  if (httpResources.length > 0) {
    for (const r of httpResources) {
      addFinding('Mixed Content', 'critical', 'HTTP kaynak yükleniyor', `URL: ${r.name}`, 'Tüm kaynakları HTTPS üzerinden yükleyin.');
      console.log('%c🔴 HTTP kaynak: %c' + r.name, STYLE.critical, STYLE.value);
    }
  } else {
    addFinding('Mixed Content', 'pass', 'Tüm kaynaklar HTTPS', 'Mixed content tespit edilmedi.', '');
    console.log('%c✅ Tüm kaynaklar HTTPS üzerinden yükleniyor', STYLE.pass);
  }
  console.groupEnd();

  // robots.txt, sitemap, well-known
  console.group('%cPasif Keşif (robots.txt, sitemap, .well-known)', STYLE.subheader);
  const recon = ['/robots.txt', '/sitemap.xml', '/.well-known/security.txt', '/crossdomain.xml', '/clientaccesspolicy.xml'];
  for (const path of recon) {
    const r = await safeFetch(location.origin + path);
    if (r && r.ok) {
      const text = await r.text().catch(() => '');
      const hasSecrets = /admin|password|secret|token|internal|staging|dev\./i.test(text);
      if (hasSecrets) {
        addFinding('Recon', 'warning', `${path} — hassas bilgi ipucu`, 'Dosya içeriğinde potansiyel hassas referans bulundu.', 'Dosya içeriğini gözden geçirin.');
        console.log('%c🟡 %s — hassas bilgi ipuçları bulundu', STYLE.warning, path);
      } else {
        addFinding('Recon', 'info', `${path} erişilebilir`, `Dosya mevcut (${text.length} byte)`, 'İçeriğini gözden geçirin.');
        console.log('%c🔵 %s erişilebilir (%d byte)', STYLE.info, path, text.length);
      }
    } else {
      console.log('%c✅ %s — erişilemez veya yok', STYLE.pass, path);
    }
  }
  console.groupEnd();

  // HTML comments
  console.group('%cHTML Comment Analizi', STYLE.subheader);
  const htmlSource = document.documentElement.outerHTML;
  const comments = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) comments.push(walker.currentNode.textContent.trim());
  const sensitiveCommentPattern = /TODO|FIXME|HACK|password|token|secret|api.key|internal|debug|BUG|XXX|TEMP/i;
  let sensitiveComments = 0;
  for (const c of comments) {
    if (sensitiveCommentPattern.test(c)) {
      sensitiveComments++;
      addFinding('Data Leakage', 'warning', 'HTML comment — hassas içerik', safeStringify(c, 150), 'Production build\'de commentleri strip edin.');
      console.log('%c🟡 Hassas comment: %c' + safeStringify(c, 100), STYLE.warning, STYLE.value);
    }
  }
  if (sensitiveComments === 0 && comments.length > 0) {
    addFinding('Data Leakage', 'info', `${comments.length} HTML comment bulundu`, 'Hassas içerik tespit edilmedi.', 'Gereksiz commentleri kaldırın.');
    console.log('%c🔵 %d HTML comment bulundu (hassas içerik yok)', STYLE.info, comments.length);
  } else if (comments.length === 0) {
    addFinding('Data Leakage', 'pass', 'HTML comment yok', '', '');
    console.log('%c✅ HTML comment bulunmadı', STYLE.pass);
  }
  console.groupEnd();

  // Technology fingerprinting
  console.group('%cTeknoloji Fingerprinting', STYLE.subheader);
  const techDetections = [];
  if (window.__NEXT_DATA__) techDetections.push('Next.js');
  if (window.__NUXT__) techDetections.push('Nuxt.js');
  if (window.React || document.querySelector('[data-reactroot]')) techDetections.push('React');
  if (window.angular || document.querySelector('[ng-app]')) techDetections.push('Angular');
  if (window.__VUE__) techDetections.push('Vue.js');
  if (window.jQuery || window.$?.fn?.jquery) techDetections.push('jQuery ' + (window.jQuery?.fn?.jquery || ''));
  for (const t of techDetections) {
    addFinding('Recon', 'info', 'Framework tespit edildi', t, 'Client-side framework bilgisi saldırganlar için keşif verisi oluşturur.');
    console.log('%c🔵 Framework: %c' + t, STYLE.info, STYLE.value);
  }
  if (window.__NEXT_DATA__) {
    const nextData = window.__NEXT_DATA__;
    if (nextData.props?.pageProps) {
      const propsStr = JSON.stringify(nextData.props.pageProps);
      if (/password|secret|token|apiKey|private/i.test(propsStr)) {
        addFinding('Data Leakage', 'critical', '__NEXT_DATA__ içinde hassas veri', 'pageProps içinde potansiyel secret bulundu.', 'getServerSideProps\'tan client\'a hassas veri geçirmeyin.');
        console.log('%c🔴 __NEXT_DATA__ içinde hassas veri ipucu!', STYLE.critical);
      }
    }
    addFinding('Recon', 'info', 'Next.js build ID açık', `Build: ${nextData.buildId}`, 'Bu bilgi saldırgana versiyon tespiti sağlar.');
    console.log('%c🔵 Next.js Build ID: %c' + nextData.buildId, STYLE.info, STYLE.value);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 2: JAVASCRIPT BUNDLE ANALYSIS
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 2: JS Bundle & Static Analysis', STYLE.header);

  const scripts = Array.from(document.querySelectorAll('script'));
  const externalScripts = scripts.filter(s => s.src);
  const inlineScripts = scripts.filter(s => !s.src && s.textContent.trim());

  console.group('%cScript Envanteri', STYLE.subheader);
  console.log(`%cToplam: ${scripts.length} | External: ${externalScripts.length} | Inline: ${inlineScripts.length}`, STYLE.value);

  // SRI check
  let sriMissing = 0;
  for (const s of externalScripts) {
    if (!s.integrity) {
      sriMissing++;
      const isSameOrigin = new URL(s.src, location.origin).origin === location.origin;
      if (!isSameOrigin) {
        addFinding('Supply Chain', 'warning', 'SRI eksik (external)', `Script: ${s.src}`, 'integrity ve crossorigin attribute ekleyin.');
        console.log('%c🟡 SRI eksik (3rd-party): %c' + s.src, STYLE.warning, STYLE.value);
      }
    }
  }
  if (sriMissing === 0) {
    addFinding('Supply Chain', 'pass', 'Tüm external scriptlerde SRI mevcut', '', '');
    console.log('%c✅ Tüm external script\'lerde SRI mevcut', STYLE.pass);
  }
  console.groupEnd();

  // Fetch & analyze JS bundles for secrets
  console.group('%cHardcoded Secret Taraması', STYLE.subheader);
  const SECRET_PATTERNS = [
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g },
    { name: 'AWS Secret Key', pattern: /(?:aws_secret|AWS_SECRET)[^=]*=\s*['"][A-Za-z0-9/+=]{40}['"]/gi },
    { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/g },
    { name: 'GitHub Token', pattern: /ghp_[A-Za-z0-9]{36}/g },
    { name: 'Slack Token', pattern: /xox[bpors]-[A-Za-z0-9-]{10,}/g },
    { name: 'Private Key', pattern: /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----/g },
    { name: 'Bearer Token Hardcoded', pattern: /['"]Bearer\s+[A-Za-z0-9._~+/=-]{20,}['"]/g },
    { name: 'Basic Auth Hardcoded', pattern: /['"]Basic\s+[A-Za-z0-9+/=]{10,}['"]/g },
    { name: 'Connection String', pattern: /(mongodb|postgresql|mysql|redis|amqp):\/\/[^\s'"]{10,}/gi },
    { name: 'Stripe Key', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/g },
    { name: 'Firebase Config', pattern: /firebase[A-Za-z]*\s*[:=]\s*['"][A-Za-z0-9:._/-]{20,}['"]/gi },
    { name: 'Hardcoded Password', pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{6,}['"]/gi },
    { name: 'JWT Hardcoded', pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
    { name: 'Turnstile/reCAPTCHA Key', pattern: /(?:0x|6L)[A-Za-z0-9_-]{20,}/g },
    { name: 'Generic API Key', pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9]{16,}['"]/gi },
  ];

  const jsContents = [];
  for (const s of externalScripts.slice(0, 30)) {
    try {
      const r = await safeFetch(s.src);
      if (r && r.ok) {
        const txt = await r.text();
        jsContents.push({ url: s.src, content: txt });
      }
    } catch {}
  }
  for (const s of inlineScripts) {
    jsContents.push({ url: 'inline', content: s.textContent });
  }

  let secretsFound = 0;
  for (const js of jsContents) {
    for (const sp of SECRET_PATTERNS) {
      const matches = js.content.match(sp.pattern);
      if (matches) {
        for (const m of matches) {
          const isFalsePositive = /NEXT_PUBLIC_|process\.env|placeholder|example|xxx/i.test(m);
          if (!isFalsePositive) {
            secretsFound++;
            addFinding('Secrets', 'critical', `${sp.name} bulundu`, `Dosya: ${js.url.split('/').pop()} | Match: ${safeStringify(m, 80)}`, 'Bu secret\'ı derhal kaldırın ve rotate edin.');
            console.log('%c🔴 %s: %c%s %cin %s', STYLE.critical, sp.name, STYLE.value, safeStringify(m, 60), STYLE.label, js.url.split('/').pop());
          }
        }
      }
    }
  }
  if (secretsFound === 0) {
    addFinding('Secrets', 'pass', 'Hardcoded secret bulunamadı', 'JS bundle\'larda açık secret tespit edilmedi.', '');
    console.log('%c✅ JS bundle\'larda hardcoded secret bulunamadı', STYLE.pass);
  }

  // Endpoint & internal URL discovery
  console.group('%cEndpoint & Internal URL Keşfi', STYLE.subheader);
  const URL_PATTERNS = [
    { name: 'API Endpoint', pattern: /['"`](\/api\/[^'"`\s]{2,})['"`]/g },
    { name: 'Internal IP', pattern: /(https?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)[^\s'"]*)/g },
    { name: 'Localhost', pattern: /(https?:\/\/localhost[:\d]*[^\s'"]*)/g },
    { name: 'Staging/Dev Domain', pattern: /(https?:\/\/(?:staging|dev|test|qa|uat|sandbox|local)[.\-][^\s'"]{5,})/gi },
    { name: 'GraphQL', pattern: /['"`]((?:\/graphql|\/gql)[^'"`]*)['"`]/gi },
    { name: 'WebSocket', pattern: /(wss?:\/\/[^\s'"]{5,})/g },
    { name: 'Full URL', pattern: /(https?:\/\/[^\s'"<>]{10,})/g },
  ];

  const discoveredEndpoints = new Set();
  for (const js of jsContents) {
    for (const up of URL_PATTERNS) {
      const matches = [...js.content.matchAll(up.pattern)];
      for (const m of matches) {
        const url = m[1] || m[0];
        if (!discoveredEndpoints.has(url) && url.length < 300) {
          discoveredEndpoints.add(url);
          const isInternal = /localhost|127\.0\.0\.1|10\.\d|192\.168|staging|dev\./i.test(url);
          if (isInternal) {
            addFinding('Data Leakage', 'warning', `Internal URL açığa çıkmış`, `Tür: ${up.name} | URL: ${safeStringify(url, 100)}`, 'Production bundle\'dan internal URL\'leri temizleyin.');
            console.log('%c🟡 %s: %c%s', STYLE.warning, up.name, STYLE.value, safeStringify(url, 100));
          }
        }
      }
    }
  }
  addFinding('Recon', 'info', `${discoveredEndpoints.size} benzersiz URL/endpoint keşfedildi`, '', 'Gereksiz endpoint referanslarını bundle\'dan kaldırın.');
  console.log('%c🔵 Toplam %d benzersiz URL/endpoint keşfedildi', STYLE.info, discoveredEndpoints.size);
  console.groupEnd();

  // Debug & dev remnants
  console.group('%cDebug & Dev Kalıntıları', STYLE.subheader);
  const DEBUG_PATTERNS = [
    { name: 'console.log', pattern: /console\.log\s*\(/g },
    { name: 'console.debug', pattern: /console\.debug\s*\(/g },
    { name: 'debugger statement', pattern: /\bdebugger\b/g },
    { name: 'TODO/FIXME/HACK', pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX|BUG|TEMP)\b/gi },
    { name: 'process.env reference', pattern: /process\.env\.[A-Z_]{3,}/g },
  ];

  let debugFindings = 0;
  for (const js of jsContents) {
    for (const dp of DEBUG_PATTERNS) {
      const matches = js.content.match(dp.pattern);
      if (matches && matches.length > 0) {
        debugFindings += matches.length;
        const sev = dp.name === 'debugger statement' ? 'warning' : 'info';
        addFinding('Code Quality', sev, `${dp.name} (${matches.length}x)`, `Dosya: ${js.url.split('/').pop()}`, 'Production build\'de temizleyin.');
        console.log('%c%s %s: %d adet — %s', STYLE[sev], severityIcon(sev), dp.name, matches.length, js.url.split('/').pop());
      }
    }
  }
  if (debugFindings === 0) {
    console.log('%c✅ Debug kalıntısı bulunamadı', STYLE.pass);
  }
  console.groupEnd();

  // Source map check
  console.group('%cSource Map Kontrolü', STYLE.subheader);
  let sourceMapsAccessible = 0;
  for (const js of jsContents) {
    const mapMatch = js.content.match(/\/\/[#@]\s*sourceMappingURL=(\S+)/);
    if (mapMatch) {
      const mapUrl = new URL(mapMatch[1], js.url === 'inline' ? location.href : js.url).href;
      const mapResp = await safeFetch(mapUrl, { method: 'HEAD' });
      if (mapResp && mapResp.ok) {
        sourceMapsAccessible++;
        addFinding('Data Leakage', 'critical', 'Source map erişilebilir', `URL: ${mapUrl}`, 'Production\'da source map\'leri devre dışı bırakın veya erişimi engelleyin.');
        console.log('%c🔴 Source map erişilebilir: %c' + mapUrl, STYLE.critical, STYLE.value);
      }
    }
  }
  if (sourceMapsAccessible === 0) {
    addFinding('Data Leakage', 'pass', 'Erişilebilir source map yok', '', '');
    console.log('%c✅ Erişilebilir source map bulunamadı', STYLE.pass);
  }
  console.groupEnd();

  // Hidden routes discovery
  console.group('%cGizli/Admin Route Keşfi', STYLE.subheader);
  const SENSITIVE_ROUTES = ['/admin', '/dashboard', '/internal', '/debug', '/test', '/staging', '/api-docs', '/swagger', '/graphql', '/playground', '/phpmyadmin', '/wp-admin', '/panel', '/config'];
  for (const route of SENSITIVE_ROUTES) {
    const r = await safeFetch(location.origin + route, { method: 'HEAD' });
    if (r && r.ok && r.status < 400) {
      addFinding('Recon', 'warning', `Hassas route erişilebilir: ${route}`, `Status: ${r.status}`, 'Bu route\'u auth ile koruyun veya kaldırın.');
      console.log('%c🟡 Erişilebilir hassas route: %s (HTTP %d)', STYLE.warning, route, r.status);
    }
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 3: API SURFACE MAPPING
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 3: API Surface & CORS', STYLE.header);

  const perfEntries = performance.getEntriesByType('resource');
  const apiCalls = perfEntries.filter(r => /\/api\//i.test(r.name) || /\.json/i.test(r.name));
  const uniqueOrigins = [...new Set(perfEntries.map(r => { try { return new URL(r.name).origin; } catch { return null; } }).filter(Boolean))];

  console.group('%cAPI Endpoint Envanteri', STYLE.subheader);
  console.log(`%cToplam network isteği: ${perfEntries.length} | API çağrısı: ${apiCalls.length} | Benzersiz origin: ${uniqueOrigins.length}`, STYLE.value);
  for (const entry of apiCalls.slice(0, 20)) {
    console.log('%c  → %s (%dms, %dKB)', STYLE.label, entry.name, Math.round(entry.duration), Math.round(entry.transferSize / 1024));
  }
  console.groupEnd();

  // CORS test
  console.group('%cCORS Konfigürasyon Testi', STYLE.subheader);
  const testOrigins = new Set([location.origin, ...uniqueOrigins.filter(o => o !== location.origin).slice(0, 5)]);
  for (const origin of testOrigins) {
    if (origin === location.origin) continue;
    try {
      const r = await safeFetch(origin, { method: 'OPTIONS' });
      if (r) {
        const acao = r.headers.get('Access-Control-Allow-Origin');
        const acac = r.headers.get('Access-Control-Allow-Credentials');
        if (acao === '*' && acac === 'true') {
          addFinding('CORS', 'critical', 'CORS wildcard + credentials', `Origin: ${origin}`, 'Wildcard origin ile credentials:true birlikte kullanılamaz — spesifik origin belirleyin.');
          console.log('%c🔴 CORS: wildcard + credentials! Origin: %s', STYLE.critical, origin);
        } else if (acao === '*') {
          addFinding('CORS', 'warning', 'CORS wildcard origin', `Origin: ${origin}`, 'Spesifik origin whitelist kullanın.');
          console.log('%c🟡 CORS wildcard: %s', STYLE.warning, origin);
        }
      }
    } catch {}
  }
  console.groupEnd();

  // Error response analysis
  console.group('%cHata Response Analizi', STYLE.subheader);
  const errorTestUrls = [
    location.origin + '/api/website/nonexistent-endpoint-test-404',
    location.origin + '/api/website/auth/login',
  ];
  for (const url of errorTestUrls) {
    try {
      const r = await safeFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"invalid": true}'
      });
      if (r) {
        const text = await r.text().catch(() => '');
        const hasStackTrace = /at\s+\w+\s+\(|stack|trace|\.js:\d+/i.test(text);
        const hasDbInfo = /mysql|postgres|mongodb|sqlite|sequelize|prisma/i.test(text);
        const hasFilePath = /\/home\/|\/var\/|\/usr\/|C:\\|node_modules/i.test(text);
        if (hasStackTrace || hasDbInfo || hasFilePath) {
          addFinding('API', 'critical', 'Error response — verbose bilgi sızıntısı', `URL: ${url} | Stack trace/DB info/File path tespit edildi`, 'Production\'da generic error mesajları döndürün.');
          console.log('%c🔴 Verbose error response: %s', STYLE.critical, url);
        } else {
          addFinding('API', 'pass', 'Error response temiz', `URL: ${url}`, '');
          console.log('%c✅ Error response temiz: %s', STYLE.pass, url);
        }
      }
    } catch {}
  }
  console.groupEnd();

  // Rate limit check
  console.group('%cRate Limiting Kontrolü', STYLE.subheader);
  const rateLimitUrl = location.origin + '/api/website/auth/login';
  let rateLimited = false;
  for (let i = 0; i < 3; i++) {
    const r = await safeFetch(rateLimitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test', turnstileToken: 'test' })
    });
    if (r) {
      const rl = r.headers.get('X-RateLimit-Limit') || r.headers.get('RateLimit-Limit') || r.headers.get('Retry-After');
      if (rl || r.status === 429) {
        rateLimited = true;
        addFinding('API', 'pass', 'Rate limiting aktif', `Header: ${rl || 'Status 429'}`, '');
        console.log('%c✅ Rate limiting tespit edildi', STYLE.pass);
        break;
      }
    }
  }
  if (!rateLimited) {
    addFinding('API', 'warning', 'Rate limiting tespit edilemedi', `Endpoint: ${rateLimitUrl}`, 'Login endpoint\'ine rate limiting ekleyin (brute force koruması).');
    console.log('%c🟡 Rate limiting tespit edilemedi: %s', STYLE.warning, rateLimitUrl);
  }
  console.groupEnd();

  // GraphQL introspection
  console.group('%cGraphQL Kontrolü', STYLE.subheader);
  const gqlEndpoints = ['/graphql', '/gql', '/api/graphql'];
  for (const ep of gqlEndpoints) {
    const r = await safeFetch(location.origin + ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __schema { types { name } } }' })
    });
    if (r && r.ok) {
      const data = await r.json().catch(() => null);
      if (data?.data?.__schema) {
        addFinding('API', 'critical', 'GraphQL introspection AÇIK', `Endpoint: ${ep} | ${data.data.__schema.types.length} type keşfedildi`, 'Production\'da introspection\'ı kapatın.');
        console.log('%c🔴 GraphQL introspection açık: %s', STYLE.critical, ep);
      }
    }
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 4: AUTHENTICATION & SESSION MANAGEMENT
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 4: Auth & Session', STYLE.header);

  function decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { header, payload };
    } catch { return null; }
  }

  // Token hunting in storage
  console.group('%cToken & Hassas Veri Taraması', STYLE.subheader);
  const sensitivePatterns = /token|auth|jwt|session|password|secret|key|credential|bearer|refresh/i;
  const piiPatterns = /email|phone|telefon|tc.?kimlik|credit.?card|kredi.?kart|ssn|iban/i;

  // localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const val = localStorage.getItem(key);
    if (sensitivePatterns.test(key) || sensitivePatterns.test(val)) {
      addFinding('Auth', 'critical', `localStorage\'da hassas veri: ${key}`, `Değer uzunluğu: ${val.length} | XSS ile çalınabilir`, 'Tokenları HttpOnly cookie\'de saklayın, localStorage\'dan kaldırın.');
      console.log('%c🔴 localStorage hassas: %c%s = %s', STYLE.critical, STYLE.value, key, safeStringify(val, 60));
    }
    const jwt = decodeJWT(val);
    if (jwt) {
      addFinding('Auth', 'critical', `localStorage\'da JWT: ${key}`, `Algorithm: ${jwt.header.alg} | Exp: ${jwt.payload.exp ? new Date(jwt.payload.exp * 1000).toISOString() : 'yok'}`, 'JWT\'yi HttpOnly cookie ile yönetin.');
      console.log('%c🔴 JWT bulundu (localStorage): %cAlg=%s, Exp=%s', STYLE.critical, STYLE.value, jwt.header.alg, jwt.payload.exp ? new Date(jwt.payload.exp * 1000).toISOString() : 'N/A');
      if (jwt.header.alg === 'none' || jwt.header.alg === 'HS256') {
        addFinding('Auth', 'critical', `JWT zayıf algorithm: ${jwt.header.alg}`, 'Algorithm confusion saldırısına açık olabilir.', 'RS256 veya ES256 kullanın.');
      }
      if (jwt.payload.exp) {
        const expiry = jwt.payload.exp * 1000;
        const now = Date.now();
        const hoursLeft = (expiry - now) / 3600000;
        if (hoursLeft > 24 * 7) {
          addFinding('Auth', 'warning', 'JWT çok uzun expiry', `${Math.round(hoursLeft / 24)} gün — çalınma durumunda uzun süre kullanılabilir.`, 'Token süresini kısaltın (15dk-1saat) ve refresh token kullanın.');
        }
      }
      if (piiPatterns.test(JSON.stringify(jwt.payload))) {
        addFinding('Auth', 'warning', 'JWT payload\'da PII', 'Email, telefon veya diğer kişisel veriler JWT içinde.', 'JWT payload\'ından kişisel verileri kaldırın.');
      }
    }
  }

  // sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const val = sessionStorage.getItem(key);
    if (sensitivePatterns.test(key) || sensitivePatterns.test(val)) {
      addFinding('Auth', 'warning', `sessionStorage\'da hassas veri: ${key}`, `XSS ile çalınabilir`, 'HttpOnly cookie kullanın.');
      console.log('%c🟡 sessionStorage hassas: %c%s', STYLE.warning, STYLE.value, key);
    }
  }

  // Cookie analysis
  console.group('%cCookie Analizi', STYLE.subheader);
  const cookies = document.cookie.split(';').map(c => c.trim()).filter(Boolean);
  if (cookies.length === 0) {
    addFinding('Auth', 'info', 'document.cookie ile erişilebilen cookie yok', 'HttpOnly cookie\'ler JS ile okunamaz — bu iyi.', '');
    console.log('%c🔵 document.cookie boş — HttpOnly cookie\'ler JS ile okunamaz (bu iyi bir işaret)', STYLE.info);
  }
  for (const c of cookies) {
    const [name, ...valParts] = c.split('=');
    const val = valParts.join('=');
    const isSession = sensitivePatterns.test(name);
    if (isSession) {
      addFinding('Auth', 'critical', `Cookie HttpOnly DEĞİL: ${name}`, 'JS ile okunabiliyor — XSS ile çalınabilir.', 'Bu cookie\'yi HttpOnly olarak işaretleyin.');
      console.log('%c🔴 HttpOnly değil: %c%s', STYLE.critical, STYLE.value, name);
    }

    const isTracker = /^(_ga|_gid|_fbp|_gcl|_hjid|mp_|ajs_)/i.test(name);
    if (isTracker) {
      addFinding('Auth', 'info', `Tracking cookie: ${name}`, '', 'Cookie consent ile yönetin.');
    }
  }
  console.groupEnd();

  // CSRF check
  console.group('%cCSRF Koruması', STYLE.subheader);
  const forms = document.querySelectorAll('form');
  let csrfProtected = 0;
  for (const form of forms) {
    const csrfInput = form.querySelector('input[name*="csrf"], input[name*="_token"], input[name*="csrfmiddlewaretoken"]');
    if (csrfInput) csrfProtected++;
    else {
      const method = (form.method || 'GET').toUpperCase();
      if (method === 'POST') {
        addFinding('Auth', 'warning', 'Form CSRF token eksik', `Action: ${form.action || 'N/A'}`, 'POST formlarına CSRF token ekleyin veya SameSite cookie kullanın.');
        console.log('%c🟡 CSRF token eksik: %c%s', STYLE.warning, STYLE.value, form.action || 'inline form');
      }
    }
  }
  console.groupEnd();

  // Privilege escalation hints
  console.group('%cYetki Yükseltme İpuçları', STYLE.subheader);
  const roleKeys = ['role', 'isAdmin', 'is_admin', 'userType', 'user_type', 'permissions', 'level'];
  for (const key of roleKeys) {
    const lsVal = localStorage.getItem(key);
    if (lsVal) {
      addFinding('Auth', 'critical', `Client-side rol bilgisi manipüle edilebilir: ${key}`, `Değer: ${safeStringify(lsVal, 50)}`, 'Rol/yetki kontrollerini server-side yapın.');
      console.log('%c🔴 Manipüle edilebilir rol: %c%s = %s', STYLE.critical, STYLE.value, key, safeStringify(lsVal, 50));
    }
  }
  console.groupEnd();
  console.groupEnd();

  /* =========================================================================
     SECTION 5: BUSINESS LOGIC FLAWS
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 5: Business Logic', STYLE.header);

  // Client-side validation analysis
  console.group('%cClient-Side Validation Analizi', STYLE.subheader);
  const allForms = document.querySelectorAll('form');
  for (const form of allForms) {
    const inputs = form.querySelectorAll('input, select, textarea');
    for (const input of inputs) {
      if (input.type === 'hidden') {
        const name = input.name || input.id;
        const dangerousHiddenFields = /price|amount|total|discount|user.?id|role|admin|quantity|coupon/i;
        if (dangerousHiddenFields.test(name)) {
          addFinding('Business Logic', 'critical', `Manipüle edilebilir hidden field: ${name}`, `Değer: ${input.value}`, 'Fiyat/miktar/rol gibi değerleri server-side validate edin.');
          console.log('%c🔴 Tehlikeli hidden field: %c%s = %s', STYLE.critical, STYLE.value, name, input.value);
        }
      }
      if (input.disabled || input.readOnly) {
        addFinding('Business Logic', 'info', `Disabled/readonly input: ${input.name || input.id}`, 'DevTools ile değiştirilebilir — server-side validate edin.', '');
      }
    }
  }
  console.groupEnd();

  // File upload analysis
  console.group('%cDosya Upload Analizi', STYLE.subheader);
  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (const fi of fileInputs) {
    const accept = fi.accept;
    if (!accept) {
      addFinding('Business Logic', 'warning', 'Dosya upload — kabul edilen tür kısıtlaması yok', 'Herhangi bir dosya türü yüklenebilir.', 'accept attribute ve server-side MIME type kontrolü ekleyin.');
      console.log('%c🟡 Dosya upload: kabul edilen tür kısıtlaması yok', STYLE.warning);
    } else {
      addFinding('Business Logic', 'info', `Dosya upload: accept="${accept}"`, 'Client-side kısıtlama — server-side doğrulama da şart.', '');
      console.log('%c🔵 Dosya upload accept: %c%s', STYLE.info, STYLE.value, accept);
    }
  }
  if (fileInputs.length === 0) {
    console.log('%c✅ Dosya upload alanı bulunamadı', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 6: CLIENT-SIDE STORAGE DEEP AUDIT
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 6: Client-Side Storage', STYLE.header);

  console.group('%clocalStorage Detaylı Tarama', STYLE.subheader);
  let totalLSSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const val = localStorage.getItem(key);
    const size = new Blob([key + val]).size;
    totalLSSize += size;

    let dataType = 'string';
    try { JSON.parse(val); dataType = 'JSON'; } catch {}
    if (/^eyJ/.test(val)) dataType = 'JWT';
    try { atob(val); if (val.length > 20 && /^[A-Za-z0-9+/=]+$/.test(val)) dataType = 'base64'; } catch {}

    const hasPII = piiPatterns.test(key) || piiPatterns.test(val);
    if (hasPII) {
      addFinding('Storage', 'critical', `localStorage PII: ${key}`, `Tür: ${dataType}, Boyut: ${size}B`, 'PII verilerini client-side depolamayın veya şifreleyin.');
      console.log('%c🔴 PII tespit: %c%s (tür: %s, %dB)', STYLE.critical, STYLE.value, key, dataType, size);
    }
  }
  const lsQuota = 5 * 1024 * 1024;
  const lsUsagePercent = ((totalLSSize / lsQuota) * 100).toFixed(1);
  addFinding('Storage', 'info', `localStorage kullanım: ${(totalLSSize / 1024).toFixed(1)}KB / 5MB (${lsUsagePercent}%)`, '', '');
  console.log('%c🔵 localStorage: %s KB / 5 MB (%s%%)', STYLE.info, (totalLSSize / 1024).toFixed(1), lsUsagePercent);
  console.groupEnd();

  // IndexedDB
  console.group('%cIndexedDB Tarama', STYLE.subheader);
  try {
    const dbs = await indexedDB.databases();
    if (dbs.length > 0) {
      for (const db of dbs) {
        addFinding('Storage', 'info', `IndexedDB: ${db.name} (v${db.version})`, '', 'İçeriğini hassas veri açısından kontrol edin.');
        console.log('%c🔵 IndexedDB: %c%s (v%d)', STYLE.info, STYLE.value, db.name, db.version);
      }
    } else {
      console.log('%c✅ IndexedDB veritabanı yok', STYLE.pass);
    }
  } catch {
    console.log('%c🔵 IndexedDB.databases() desteklenmiyor', STYLE.info);
  }
  console.groupEnd();

  // Service Worker & Cache
  console.group('%cService Worker & Cache', STYLE.subheader);
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length > 0) {
      for (const reg of regs) {
        addFinding('Storage', 'info', `Service Worker aktif`, `Scope: ${reg.scope}`, 'SW cache içeriğini hassas veri açısından kontrol edin.');
        console.log('%c🔵 Service Worker: %c%s', STYLE.info, STYLE.value, reg.scope);
      }
    } else {
      console.log('%c✅ Service Worker kayıtlı değil', STYLE.pass);
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cn of cacheNames) {
        const cache = await caches.open(cn);
        const keys = await cache.keys();
        const hasApiCache = keys.some(k => /\/api\//i.test(k.url));
        if (hasApiCache) {
          addFinding('Storage', 'warning', `Cache\'de API response: ${cn}`, `${keys.length} entry`, 'API response\'larını cache\'lemeyin veya hassas verileri strip edin.');
          console.log('%c🟡 Cache\'de API response: %c%s (%d entry)', STYLE.warning, STYLE.value, cn, keys.length);
        }
      }
    }
  }
  console.groupEnd();

  // window.name & history.state
  console.group('%cDiğer Depolama Kontrolleri', STYLE.subheader);
  if (window.name && window.name.length > 0) {
    addFinding('Storage', 'warning', 'window.name dolu', `Uzunluk: ${window.name.length}`, 'window.name cross-origin veri sızıntısına neden olabilir — temizleyin.');
    console.log('%c🟡 window.name dolu: %c%s', STYLE.warning, STYLE.value, safeStringify(window.name, 60));
  }
  if (history.state) {
    const stateStr = JSON.stringify(history.state);
    if (sensitivePatterns.test(stateStr)) {
      addFinding('Storage', 'warning', 'history.state\'de hassas veri', safeStringify(stateStr, 100), 'history.state\'e hassas veri koymayın.');
    }
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 7: THIRD-PARTY & SUPPLY CHAIN
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 7: Third-Party & Supply Chain', STYLE.header);

  console.group('%c3rd-Party Script Envanteri', STYLE.subheader);
  const domainMap = {};
  for (const s of externalScripts) {
    try {
      const url = new URL(s.src);
      const domain = url.hostname;
      if (!domainMap[domain]) domainMap[domain] = [];
      domainMap[domain].push(s.src);
    } catch {}
  }
  for (const [domain, urls] of Object.entries(domainMap)) {
    const isSameOrigin = domain === location.hostname;
    console.log('%c  %s: %d script%s', isSameOrigin ? STYLE.pass : STYLE.info, domain, urls.length, isSameOrigin ? ' (same-origin)' : '');
    if (!isSameOrigin) {
      addFinding('Supply Chain', 'info', `3rd-party domain: ${domain}`, `${urls.length} script yükleniyor`, 'SRI ve CSP ile koruyun.');
    }
  }
  console.groupEnd();

  // Library version detection
  console.group('%cKütüphane Versiyon Tespiti', STYLE.subheader);
  const libs = [];
  if (window.React?.version) libs.push({ name: 'React', version: window.React.version });
  if (window.jQuery?.fn?.jquery) libs.push({ name: 'jQuery', version: window.jQuery.fn.jquery });
  if (window.angular?.version?.full) libs.push({ name: 'Angular', version: window.angular.version.full });
  if (window.Vue?.version) libs.push({ name: 'Vue', version: window.Vue.version });
  if (window._?.VERSION) libs.push({ name: 'Lodash', version: window._.VERSION });
  if (window.__NEXT_DATA__?.nextExport !== undefined) libs.push({ name: 'Next.js', version: 'detected' });

  for (const lib of libs) {
    addFinding('Supply Chain', 'info', `${lib.name} ${lib.version}`, 'Sürümü bilinen CVE\'ler ile karşılaştırın.', 'Kütüphaneleri güncel tutun.');
    console.log('%c🔵 %s: %c%s', STYLE.info, lib.name, STYLE.value, lib.version);
  }
  console.groupEnd();

  // Prototype pollution check
  console.group('%cPrototype Pollution Kontrolü', STYLE.subheader);
  const defaultObjProps = Object.getOwnPropertyNames(Object.prototype);
  const expectedObjProps = new Set(['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', 'toLocaleString', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', '__proto__']);
  const unexpectedObjProps = defaultObjProps.filter(p => !expectedObjProps.has(p));
  if (unexpectedObjProps.length > 0) {
    addFinding('DOM Security', 'critical', 'Object.prototype kirlenmesi', `Eklenen property\'ler: ${unexpectedObjProps.join(', ')}`, 'Prototype pollution kaynağını tespit edip düzeltin.');
    console.log('%c🔴 Object.prototype kirlenmesi: %c%s', STYLE.critical, STYLE.value, unexpectedObjProps.join(', '));
  } else {
    addFinding('DOM Security', 'pass', 'Object.prototype temiz', '', '');
    console.log('%c✅ Object.prototype temiz', STYLE.pass);
  }

  const defaultArrProps = new Set(['length', 'constructor', 'at', 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort', 'splice', 'toLocaleString', 'toReversed', 'toSorted', 'toSpliced', 'toString', 'unshift', 'values', 'with']);
  const arrProps = Object.getOwnPropertyNames(Array.prototype);
  const unexpectedArrProps = arrProps.filter(p => !defaultArrProps.has(p));
  if (unexpectedArrProps.length > 0) {
    addFinding('DOM Security', 'warning', 'Array.prototype değiştirilmiş', `Eklenen: ${unexpectedArrProps.join(', ')}`, 'Monkey-patching kaynağını tespit edin.');
    console.log('%c🟡 Array.prototype değiştirilmiş: %c%s', STYLE.warning, STYLE.value, unexpectedArrProps.join(', '));
  }
  console.groupEnd();

  // iframe analysis
  console.group('%ciframe Analizi', STYLE.subheader);
  const iframes = document.querySelectorAll('iframe');
  for (const iframe of iframes) {
    const src = iframe.src || iframe.srcdoc ? 'srcdoc' : 'none';
    const sandbox = iframe.getAttribute('sandbox');
    if (!sandbox) {
      addFinding('Supply Chain', 'warning', `iframe sandbox yok`, `Src: ${safeStringify(src, 80)}`, 'Tüm iframe\'lere sandbox attribute ekleyin.');
      console.log('%c🟡 iframe sandbox yok: %c%s', STYLE.warning, STYLE.value, safeStringify(src, 80));
    } else {
      console.log('%c✅ iframe sandbox: %c%s → %s', STYLE.pass, STYLE.value, safeStringify(src, 60), sandbox);
    }
  }
  if (iframes.length === 0) {
    console.log('%c✅ Sayfada iframe yok', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 8: WEBSOCKET & REALTIME
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 8: WebSocket & Realtime', STYLE.header);

  console.group('%cWebSocket & EventSource Kontrolü', STYLE.subheader);
  const wsInstances = [];
  const origWS = window.WebSocket;
  if (origWS) {
    const openConnections = performance.getEntriesByType('resource').filter(r => /^wss?:/.test(r.name));
    if (openConnections.length > 0) {
      for (const ws of openConnections) {
        const isSecure = ws.name.startsWith('wss:');
        if (!isSecure) {
          addFinding('WebSocket', 'critical', 'Şifrelenmemiş WebSocket (ws://)', `URL: ${ws.name}`, 'wss:// kullanın.');
          console.log('%c🔴 ws:// (şifrelenmemiş): %c%s', STYLE.critical, STYLE.value, ws.name);
        }
        if (/token=|key=|auth=/i.test(ws.name)) {
          addFinding('WebSocket', 'warning', 'WS URL\'de credential', `URL: ${ws.name}`, 'Auth bilgisini URL yerine mesaj veya cookie ile gönderin.');
          console.log('%c🟡 WS URL\'de credential: %c%s', STYLE.warning, STYLE.value, ws.name);
        }
      }
    } else {
      console.log('%c✅ Aktif WebSocket bağlantısı yok', STYLE.pass);
    }
  }
  console.groupEnd();

  // postMessage security
  console.group('%cpostMessage Güvenliği', STYLE.subheader);
  let postMessageListeners = 0;
  const origAddEventListener = EventTarget.prototype.addEventListener;
  for (const js of jsContents) {
    const pmMatches = js.content.match(/addEventListener\s*\(\s*['"]message['"]/g);
    if (pmMatches) postMessageListeners += pmMatches.length;
    const hasOriginCheck = /event\.origin|e\.origin|msg\.origin/.test(js.content);
    if (pmMatches && !hasOriginCheck) {
      addFinding('WebSocket', 'critical', 'postMessage listener — origin kontrolü yok', `Dosya: ${js.url.split('/').pop()}`, 'message event handler\'da event.origin kontrolü yapın.');
      console.log('%c🔴 postMessage origin kontrolü yok: %c%s', STYLE.critical, STYLE.value, js.url.split('/').pop());
    }
  }
  if (postMessageListeners === 0) {
    console.log('%c✅ postMessage listener tespit edilmedi', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 9: BROWSER API & PERMISSIONS
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 9: Browser API & Permissions', STYLE.header);

  console.group('%cPermission Durumu', STYLE.subheader);
  const permNames = ['camera', 'microphone', 'geolocation', 'notifications', 'push', 'clipboard-read', 'clipboard-write', 'persistent-storage', 'screen-wake-lock'];
  for (const name of permNames) {
    try {
      const status = await navigator.permissions.query({ name });
      if (status.state === 'granted') {
        addFinding('Browser API', 'warning', `Permission granted: ${name}`, 'Kullanıcı bu izni vermiş.', 'Bu iznin gerçekten gerekli olduğunu doğrulayın.');
        console.log('%c🟡 Permission GRANTED: %c%s', STYLE.warning, STYLE.value, name);
      } else if (status.state === 'prompt') {
        console.log('%c✅ %s: prompt (henüz istenmemiş)', STYLE.pass, name);
      }
    } catch {}
  }
  console.groupEnd();

  // Storage estimate
  console.group('%cDepolama Kapasitesi', STYLE.subheader);
  if (navigator.storage?.estimate) {
    const est = await navigator.storage.estimate();
    const usagePercent = ((est.usage / est.quota) * 100).toFixed(2);
    addFinding('Browser API', 'info', `Depolama: ${(est.usage / 1024 / 1024).toFixed(2)}MB / ${(est.quota / 1024 / 1024).toFixed(0)}MB (${usagePercent}%)`, '', '');
    console.log('%c🔵 Depolama: %s MB / %s MB (%s%%)', STYLE.info, (est.usage / 1024 / 1024).toFixed(2), (est.quota / 1024 / 1024).toFixed(0), usagePercent);
  }
  console.groupEnd();

  // Global scope leak detection
  console.group('%cGlobal Scope Sızıntısı', STYLE.subheader);
  const defaultWindowProps = new Set([
    'window', 'self', 'document', 'name', 'location', 'customElements', 'history', 'navigation',
    'locationbar', 'menubar', 'personalbar', 'scrollbars', 'statusbar', 'toolbar', 'status', 'closed',
    'frames', 'length', 'top', 'opener', 'parent', 'frameElement', 'navigator', 'origin',
    'external', 'screen', 'visualViewport', 'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight',
    'devicePixelRatio', 'clientInformation', 'screenX', 'screenY', 'screenLeft', 'screenTop',
    'styleMedia', 'onsearch', 'isSecureContext', 'crossOriginIsolated', 'performance', 'caches',
    'cookieStore', 'scheduler', 'alert', 'atob', 'blur', 'btoa', 'cancelAnimationFrame',
    'cancelIdleCallback', 'clearInterval', 'clearTimeout', 'close', 'confirm', 'createImageBitmap',
    'fetch', 'find', 'focus', 'getComputedStyle', 'getSelection', 'matchMedia', 'moveBy', 'moveTo',
    'open', 'postMessage', 'print', 'prompt', 'queueMicrotask', 'reportError',
    'requestAnimationFrame', 'requestIdleCallback', 'resizeBy', 'resizeTo', 'scroll', 'scrollBy',
    'scrollTo', 'setInterval', 'setTimeout', 'stop', 'structuredClone', 'webkitCancelAnimationFrame',
    'webkitRequestAnimationFrame', 'chrome', 'WebSocket', 'crypto', 'indexedDB',
    'sessionStorage', 'localStorage'
  ]);
  const windowProps = Object.getOwnPropertyNames(window);
  const suspiciousGlobals = windowProps.filter(p => {
    if (defaultWindowProps.has(p)) return false;
    if (/^on[a-z]/.test(p)) return false;
    if (/^[A-Z]/.test(p) && typeof window[p] === 'function') return false;
    if (/^webkit|^moz|^ms/.test(p)) return false;
    return sensitivePatterns.test(p);
  });

  if (suspiciousGlobals.length > 0) {
    for (const g of suspiciousGlobals) {
      addFinding('Data Leakage', 'warning', `Global scope sızıntısı: window.${g}`, `Tür: ${typeof window[g]}`, 'Bu değişkeni global scope\'tan kaldırın.');
      console.log('%c🟡 Şüpheli global: %cwindow.%s = %s', STYLE.warning, STYLE.value, g, typeof window[g]);
    }
  } else {
    console.log('%c✅ Şüpheli global scope sızıntısı yok', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 10: DOM & XSS DEEP ANALYSIS
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 10: DOM & XSS Analysis', STYLE.header);

  // Inline event handlers
  console.group('%cInline Event Handler Denetimi', STYLE.subheader);
  const inlineHandlerAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'oninput', 'onkeydown', 'onkeyup', 'onkeypress'];
  let inlineHandlerCount = 0;
  for (const attr of inlineHandlerAttrs) {
    const elements = document.querySelectorAll(`[${attr}]`);
    for (const el of elements) {
      inlineHandlerCount++;
      const handler = el.getAttribute(attr);
      addFinding('DOM Security', 'warning', `Inline ${attr} handler`, `Element: <${el.tagName.toLowerCase()}> | Handler: ${safeStringify(handler, 80)}`, 'Inline handler yerine addEventListener kullanın. CSP unsafe-inline gerektirir.');
      console.log('%c🟡 Inline handler: %c<%s %s="%s">', STYLE.warning, STYLE.value, el.tagName.toLowerCase(), attr, safeStringify(handler, 60));
    }
  }
  if (inlineHandlerCount === 0) {
    addFinding('DOM Security', 'pass', 'Inline event handler yok', 'CSP uyumluluğu için iyi.', '');
    console.log('%c✅ Inline event handler bulunamadı', STYLE.pass);
  }
  console.groupEnd();

  // DOM-based XSS sinks in JS
  console.group('%cDOM-Based XSS Sink Taraması', STYLE.subheader);
  const XSS_SINKS = [
    { name: 'innerHTML', pattern: /\.innerHTML\s*=(?!=)/g, severity: 'critical' },
    { name: 'outerHTML', pattern: /\.outerHTML\s*=(?!=)/g, severity: 'critical' },
    { name: 'document.write', pattern: /document\.write(?:ln)?\s*\(/g, severity: 'critical' },
    { name: 'eval()', pattern: /\beval\s*\(/g, severity: 'critical' },
    { name: 'Function()', pattern: /new\s+Function\s*\(/g, severity: 'critical' },
    { name: 'setTimeout string', pattern: /setTimeout\s*\(\s*['"]/g, severity: 'warning' },
    { name: 'setInterval string', pattern: /setInterval\s*\(\s*['"]/g, severity: 'warning' },
    { name: 'insertAdjacentHTML', pattern: /\.insertAdjacentHTML\s*\(/g, severity: 'warning' },
    { name: 'location.href assign', pattern: /location\.href\s*=(?!=)/g, severity: 'warning' },
    { name: 'location.assign', pattern: /location\.assign\s*\(/g, severity: 'warning' },
    { name: 'window.open', pattern: /window\.open\s*\(/g, severity: 'info' },
    { name: 'jQuery .html()', pattern: /\.html\s*\([^)]+\)/g, severity: 'warning' },
  ];

  for (const js of jsContents) {
    for (const sink of XSS_SINKS) {
      const matches = js.content.match(sink.pattern);
      if (matches) {
        addFinding('DOM Security', sink.severity, `XSS sink: ${sink.name} (${matches.length}x)`, `Dosya: ${js.url.split('/').pop()}`, `${sink.name} kullanımlarını gözden geçirin — kullanıcı input\'undan etkileniyor olabilir.`);
        console.log('%c%s XSS sink %s: %d adet — %s', STYLE[sink.severity], severityIcon(sink.severity), sink.name, matches.length, js.url.split('/').pop());
      }
    }
  }
  console.groupEnd();

  // DOM XSS sources
  console.group('%cXSS Source Analizi', STYLE.subheader);
  const XSS_SOURCES = [
    { name: 'location.search', pattern: /location\.search/g },
    { name: 'location.hash', pattern: /location\.hash/g },
    { name: 'location.href (read)', pattern: /location\.href(?!\s*=)/g },
    { name: 'document.referrer', pattern: /document\.referrer/g },
    { name: 'window.name', pattern: /window\.name/g },
    { name: 'document.URL', pattern: /document\.URL/g },
    { name: 'document.documentURI', pattern: /document\.documentURI/g },
  ];
  for (const js of jsContents) {
    for (const src of XSS_SOURCES) {
      const matches = js.content.match(src.pattern);
      if (matches) {
        addFinding('DOM Security', 'info', `XSS source: ${src.name} (${matches.length}x)`, `Dosya: ${js.url.split('/').pop()} — sink\'e akış olup olmadığını kontrol edin.`, '');
        console.log('%c🔵 XSS source %s: %d adet — %s', STYLE.info, src.name, matches.length, js.url.split('/').pop());
      }
    }
  }
  console.groupEnd();

  // Trusted Types & DOMPurify
  console.group('%cSanitization Kontrolü', STYLE.subheader);
  const hasDOMPurify = jsContents.some(js => /DOMPurify|dompurify|purify\.sanitize/i.test(js.content));
  if (hasDOMPurify) {
    addFinding('DOM Security', 'pass', 'DOMPurify kullanılıyor', 'XSS sanitization kütüphanesi mevcut.', '');
    console.log('%c✅ DOMPurify tespit edildi', STYLE.pass);
  } else {
    addFinding('DOM Security', 'warning', 'Sanitization kütüphanesi tespit edilemedi', 'DOMPurify veya benzeri bir XSS sanitizer bulunamadı.', 'Kullanıcı girdisi render edilen yerlerde DOMPurify kullanın.');
    console.log('%c🟡 Sanitization kütüphanesi bulunamadı', STYLE.warning);
  }

  try {
    const trustedTypesPolicy = window.trustedTypes?.defaultPolicy;
    if (trustedTypesPolicy) {
      addFinding('DOM Security', 'pass', 'Trusted Types aktif', '', '');
      console.log('%c✅ Trusted Types default policy aktif', STYLE.pass);
    } else {
      addFinding('DOM Security', 'info', 'Trusted Types yapılandırılmamış', 'DOM XSS koruması için Trusted Types kullanın.', '');
      console.log('%c🔵 Trusted Types yapılandırılmamış', STYLE.info);
    }
  } catch {}
  console.groupEnd();

  // DOM clobbering check
  console.group('%cDOM Clobbering Kontrolü', STYLE.subheader);
  const namedElements = document.querySelectorAll('[id], [name]');
  const jsGlobals = new Set(['alert', 'confirm', 'prompt', 'fetch', 'open', 'close', 'focus', 'blur', 'scroll', 'print', 'stop', 'find', 'name', 'status', 'length', 'origin', 'parent', 'top', 'self', 'frames', 'location', 'document', 'navigator', 'history', 'screen', 'performance', 'caches']);
  let clobberingRisk = 0;
  for (const el of namedElements) {
    const ident = el.id || el.getAttribute('name');
    if (jsGlobals.has(ident)) {
      clobberingRisk++;
      addFinding('DOM Security', 'warning', `DOM clobbering riski: ${ident}`, `<${el.tagName.toLowerCase()} id/name="${ident}"> global JS değişkeniyle çakışıyor.`, 'id/name değerlerini JS global\'leriyle çakışmayacak şekilde seçin.');
      console.log('%c🟡 DOM clobbering: %c<%s id/name="%s">', STYLE.warning, STYLE.value, el.tagName.toLowerCase(), ident);
    }
  }
  if (clobberingRisk === 0) {
    console.log('%c✅ DOM clobbering riski yok', STYLE.pass);
  }
  console.groupEnd();

  /* =========================================================================
     SECTION 11: PERFORMANCE & QUALITY (BONUS)
     ========================================================================= */
  console.log('%c🛡️ SECURITY AUDIT — Section 11: Performance & Quality', STYLE.header);

  // DOM size
  console.group('%cDOM Boyutu', STYLE.subheader);
  const domCount = document.querySelectorAll('*').length;
  if (domCount > 3000) {
    addFinding('Performance', 'critical', `Aşırı büyük DOM: ${domCount} element`, '3000+ element performansı ciddi etkiler.', 'Virtualization, lazy rendering veya pagination kullanın.');
    console.log('%c🔴 DOM: %d element (çok büyük!)', STYLE.critical, domCount);
  } else if (domCount > 1500) {
    addFinding('Performance', 'warning', `Büyük DOM: ${domCount} element`, '1500+ element performansı etkiler.', 'DOM boyutunu küçültün.');
    console.log('%c🟡 DOM: %d element', STYLE.warning, domCount);
  } else {
    addFinding('Performance', 'pass', `DOM boyutu: ${domCount} element`, '', '');
    console.log('%c✅ DOM: %d element', STYLE.pass, domCount);
  }

  const maxDepth = (function getDepth(el) {
    let max = 0;
    for (const child of el.children) {
      max = Math.max(max, getDepth(child) + 1);
    }
    return max;
  })(document.documentElement);
  if (maxDepth > 32) {
    addFinding('Performance', 'warning', `Derin DOM: ${maxDepth} seviye`, 'CSS selector matching ve layout hesaplaması yavaşlar.', 'DOM yapısını düzleştirin.');
    console.log('%c🟡 DOM derinliği: %d seviye', STYLE.warning, maxDepth);
  } else {
    console.log('%c✅ DOM derinliği: %d seviye', STYLE.pass, maxDepth);
  }
  console.groupEnd();

  // Render blocking resources
  console.group('%cRender-Blocking Kaynaklar', STYLE.subheader);
  const headScripts = document.head.querySelectorAll('script[src]:not([async]):not([defer]):not([type="module"])');
  for (const s of headScripts) {
    addFinding('Performance', 'warning', 'Render-blocking script', `URL: ${s.src}`, 'async veya defer attribute ekleyin.');
    console.log('%c🟡 Render-blocking: %c%s', STYLE.warning, STYLE.value, s.src.split('/').pop());
  }
  const headStyles = document.head.querySelectorAll('link[rel="stylesheet"]');
  for (const s of headStyles) {
    const isCritical = !s.media || s.media === 'all';
    if (isCritical) {
      addFinding('Performance', 'info', 'Render-blocking stylesheet', `URL: ${s.href}`, 'Critical CSS\'i inline edin, geri kalanı async yükleyin.');
    }
  }
  if (headScripts.length === 0) {
    console.log('%c✅ Render-blocking script yok', STYLE.pass);
  }
  console.groupEnd();

  // Basic a11y
  console.group('%cTemel Erişilebilirlik (a11y)', STYLE.subheader);
  const htmlLang = document.documentElement.lang;
  if (!htmlLang) {
    addFinding('a11y', 'critical', '<html> lang attribute eksik', 'Screen reader\'lar sayfa dilini belirleyemez.', '<html lang="tr"> ekleyin.');
    console.log('%c🔴 <html lang> eksik', STYLE.critical);
  } else {
    console.log('%c✅ <html lang="%s">', STYLE.pass, htmlLang);
  }

  const imgs = document.querySelectorAll('img');
  let missingAlt = 0;
  for (const img of imgs) {
    if (!img.hasAttribute('alt')) missingAlt++;
  }
  if (missingAlt > 0) {
    addFinding('a11y', 'warning', `${missingAlt} img alt attribute eksik`, 'Screen reader\'lar görseli tanımlayamaz.', 'Tüm görsellere alt text ekleyin.');
    console.log('%c🟡 %d img alt eksik', STYLE.warning, missingAlt);
  } else {
    console.log('%c✅ Tüm görsellerde alt attribute mevcut', STYLE.pass);
  }

  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    addFinding('a11y', 'warning', 'h1 heading yok', 'Sayfa yapısı için en az bir h1 gerekli.', '<h1> ekleyin.');
  } else if (h1s.length > 1) {
    addFinding('a11y', 'info', `${h1s.length} h1 heading var`, 'Genellikle tek h1 önerilir.', '');
  }

  const skipLink = document.querySelector('a[href="#main"], a[href="#content"], a.skip-link, a.skip-to-content, [class*="skip"]');
  if (!skipLink) {
    addFinding('a11y', 'warning', 'Skip link bulunamadı', 'Klavye kullanıcıları ana içeriğe atlayamaz.', '"İçeriğe atla" linki ekleyin.');
    console.log('%c🟡 Skip link bulunamadı', STYLE.warning);
  }

  const focusHidden = document.querySelectorAll('[tabindex="-1"]');
  const posTabindex = document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])');
  if (posTabindex.length > 0) {
    addFinding('a11y', 'warning', `${posTabindex.length} element pozitif tabindex`, 'Doğal tab sırasını bozar.', 'tabindex > 0 kullanmayın.');
  }
  console.groupEnd();

  // SEO check
  console.group('%cSEO Meta Kontrolleri', STYLE.subheader);
  const title = document.title;
  if (!title || title.length < 10) {
    addFinding('SEO', 'warning', 'Sayfa title eksik veya çok kısa', `Title: "${title}"`, '50-60 karakter arası anlamlı title kullanın.');
    console.log('%c🟡 Title eksik/kısa: "%s"', STYLE.warning, title);
  } else if (title.length > 60) {
    addFinding('SEO', 'info', 'Title çok uzun', `${title.length} karakter`, '60 karakter altında tutun.');
  } else {
    console.log('%c✅ Title: "%s" (%d karakter)', STYLE.pass, title, title.length);
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc || !metaDesc.content) {
    addFinding('SEO', 'warning', 'Meta description eksik', '', '150-160 karakter arası description ekleyin.');
    console.log('%c🟡 Meta description eksik', STYLE.warning);
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    addFinding('SEO', 'info', 'Canonical URL eksik', '', '<link rel="canonical"> ekleyin.');
  }

  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  if (ogTags.length < 3) {
    addFinding('SEO', 'info', `Open Graph tag\'leri eksik (${ogTags.length}/4)`, '', 'og:title, og:description, og:image, og:url ekleyin.');
  }
  console.groupEnd();

  /* =========================================================================
     FINAL REPORT & SCORING
     ========================================================================= */
  console.log('%c📊 FINAL SECURITY AUDIT REPORT', STYLE.header);

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

  console.group('%cTüm Bulgular', STYLE.subheader);
  const sorted = [...FINDINGS].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, pass: 3 };
    return order[a.severity] - order[b.severity];
  });
  for (const f of sorted) {
    if (f.severity === 'pass') continue;
    console.log(`%c${severityIcon(f.severity)} [${f.category}] ${f.title}%c\n   ${f.description}\n   💡 ${f.recommendation}`, STYLE[f.severity], STYLE.label);
  }
  console.groupEnd();

  console.log(`%c\n  SECURITY SCORE: ${score}/100  \n`, STYLE.score);
  console.log(`%c  🔴 Critical: ${counts.critical}  |  🟡 Warning: ${counts.warning}  |  🔵 Info: ${counts.info}  |  ✅ Pass: ${counts.pass}  `, 'font-size:14px;color:#ccc;padding:4px');
  console.log(`%c  Toplam ${FINDINGS.length} bulgu analiz edildi  `, 'font-size:12px;color:#888');

  if (score >= 80) console.log('%c  Güvenlik durumu: İYİ — Küçük iyileştirmeler yeterli  ', 'color:#44bb44;font-size:14px;font-weight:bold');
  else if (score >= 50) console.log('%c  Güvenlik durumu: ORTA — Önemli iyileştirmeler gerekli  ', 'color:#ffaa00;font-size:14px;font-weight:bold');
  else console.log('%c  Güvenlik durumu: KRİTİK — Acil müdahale gerekli!  ', 'color:#ff4444;font-size:14px;font-weight:bold');

  return { score, counts, findings: FINDINGS };
})();
