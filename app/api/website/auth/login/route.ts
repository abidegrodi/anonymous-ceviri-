import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';

const BACKEND_URL = 'https://api.anonymousceviri.com/api/website';
const httpsAgent = new https.Agent({ family: 4 });

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first && first !== '::1' && first !== '127.0.0.1') return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp !== '::1' && realIp !== '127.0.0.1') return realIp;
  return null;
}

export async function POST(request: NextRequest) {
  const url = `${BACKEND_URL}/auth/login`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers['User-Agent'] = userAgent;

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const clientIp = getClientIp(request);
  if (clientIp) {
    headers['X-Forwarded-For'] = clientIp;
    headers['X-Real-IP'] = clientIp;
  }

  let bodyText = '';
  try {
    bodyText = await request.text();
  } catch { /* no body */ }

  if (bodyText) {
    headers['Content-Length'] = String(Buffer.byteLength(bodyText, 'utf-8'));
  }

  console.log(`[Auth Proxy] POST ${url} | IP: ${clientIp || 'localhost'}`);

  return new Promise<NextResponse>((resolve) => {
    const urlObj = new URL(url);

    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers,
      agent: httpsAgent,
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', async () => {
        const responseBody = Buffer.concat(chunks).toString('utf-8');
        console.log(`[Auth Proxy] ← ${res.statusCode} ${responseBody.substring(0, 200)}`);

        const nextResponse = new NextResponse(responseBody, {
          status: res.statusCode || 500,
          headers: { 'Content-Type': res.headers['content-type'] || 'application/json' },
        });

        const setCookieRaw = res.headers['set-cookie'];
        let authJwt = '';

        if (setCookieRaw) {
          const isLocalhost = request.headers.get('host')?.includes('localhost') ?? false;

          setCookieRaw.forEach((raw) => {
            // JWT'yi Set-Cookie'den çıkar
            const jwtMatch = raw.match(/^__anonymousceviri_website=([^;]+)/);
            if (jwtMatch) authJwt = jwtMatch[1];

            let adjusted = raw;
            if (isLocalhost) {
              adjusted = adjusted.replace(/;\s*Domain=[^;]*/gi, '');
              adjusted = adjusted.replace(/;\s*Secure/gi, '');
              adjusted = adjusted.replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
              if (!/;\s*Path=/i.test(adjusted)) {
                adjusted += '; Path=/';
              } else {
                adjusted = adjusted.replace(/;\s*Path=[^;]*/gi, '; Path=/');
              }
            }
            console.log(`[Auth Proxy] Set-Cookie: ${adjusted.split('=')[0]}... (${raw.length}ch)`);
            nextResponse.headers.append('Set-Cookie', adjusted);
          });
        }

        // SERVER-SIDE TEST: Login başarılıysa, çeşitli header kombinasyonlarıyla /auth/me'yi test et
        if (res.statusCode === 200 && authJwt) {
          console.log(`\n[Auth Proxy] ===== SERVER-SIDE /auth/me TESTS =====`);

          // JWT decode
          try {
            const parts = authJwt.split('.');
            if (parts.length >= 2) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
              console.log(`[Auth Proxy] JWT Payload: ${JSON.stringify(payload)}`);
            }
          } catch (e) {
            console.log(`[Auth Proxy] JWT decode error: ${e}`);
          }

          // Login response'dan TÜM Set-Cookie'leri topla
          const allCookies: string[] = [];
          if (setCookieRaw) {
            for (const raw of setCookieRaw) {
              const nameVal = raw.split(';')[0];
              allCookies.push(nameVal);
            }
          }
          console.log(`[Auth Proxy] All cookies from login: ${allCookies.map(c => c.split('=')[0]).join(', ')}`);

          const testCall = (label: string, testHeaders: Record<string, string>) => {
            return new Promise<void>((testResolve) => {
              const meReq = https.request({
                hostname: 'api.anonymousceviri.com',
                port: 443,
                path: '/api/website/auth/me',
                method: 'GET',
                headers: testHeaders,
                agent: httpsAgent,
              }, (meRes) => {
                const meChunks: Buffer[] = [];
                meRes.on('data', (c) => meChunks.push(c));
                meRes.on('end', () => {
                  const body = Buffer.concat(meChunks).toString('utf-8');
                  console.log(`[Auth Proxy] TEST "${label}": ${meRes.statusCode} ${body.substring(0, 200)}`);
                  testResolve();
                });
              });
              meReq.on('error', (e) => {
                console.log(`[Auth Proxy] TEST "${label}" ERROR: ${e.message}`);
                testResolve();
              });
              meReq.end();
            });
          };

          // Test 1: Sadece JWT cookie
          await testCall('Only JWT', {
            'Accept': 'application/json',
            'Cookie': `__anonymousceviri_website=${authJwt}`,
          });

          // Test 2: JWT + Origin header
          await testCall('JWT + Origin', {
            'Accept': 'application/json',
            'Cookie': `__anonymousceviri_website=${authJwt}`,
            'Origin': 'https://www.anonymousceviri.com',
          });

          // Test 3: JWT + TÜM login response cookie'leri
          await testCall('ALL login cookies', {
            'Accept': 'application/json',
            'Cookie': allCookies.join('; '),
          });

          // Test 4: JWT + Origin + Referer
          await testCall('JWT + Origin + Referer', {
            'Accept': 'application/json',
            'Cookie': `__anonymousceviri_website=${authJwt}`,
            'Origin': 'https://www.anonymousceviri.com',
            'Referer': 'https://www.anonymousceviri.com/',
          });

          // Test 5: JWT'yi Authorization header olarak gönder
          await testCall('Authorization Bearer', {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authJwt}`,
          });

          // Test 6: Tam JWT'yi dosyaya yaz (curl ile test için)
          const fs = await import('node:fs');
          fs.writeFileSync('/tmp/anon_jwt.txt', authJwt);
          console.log(`[Auth Proxy] Full JWT written to /tmp/anon_jwt.txt (${authJwt.length} chars)`);

          console.log(`[Auth Proxy] ===== END SERVER-SIDE TESTS =====\n`);
        }

        resolve(nextResponse);
      });
    });

    req.on('error', (error) => {
      console.error('[Auth Proxy] Error:', error.message);
      resolve(NextResponse.json({ status: false, message: 'Backend bağlantı hatası.' }, { status: 502 }));
    });

    if (bodyText) req.write(bodyText);
    req.end();
  });
}
