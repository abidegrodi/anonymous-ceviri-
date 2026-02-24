import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';

const BACKEND_URL = 'https://api.anonymousceviri.com/api/website';
const httpsAgent = new https.Agent({ family: 4 });

export async function GET(request: NextRequest) {
  const url = `${BACKEND_URL}/auth/me`;

  const cookie = request.headers.get('cookie');
  console.log(`\n[DEBUG /auth/me] ============================`);
  console.log(`[DEBUG /auth/me] Browser cookie: ${cookie ? 'YES' : 'NONE'}`);

  // JWT decode (header ve payload'u görelim)
  if (cookie) {
    const authCookieMatch = cookie.match(/__anonymousceviri_website=([^;]+)/);
    if (authCookieMatch) {
      const jwt = authCookieMatch[1];
      const parts = jwt.split('.');
      if (parts.length >= 2) {
        try {
          const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
          console.log(`[DEBUG /auth/me] JWT Header: ${JSON.stringify(header)}`);
          console.log(`[DEBUG /auth/me] JWT Payload: ${JSON.stringify(payload)}`);
        } catch (e) {
          console.log(`[DEBUG /auth/me] JWT decode error: ${e}`);
        }
      }
      console.log(`[DEBUG /auth/me] JWT value (${jwt.length} chars): ${jwt.substring(0, 50)}...${jwt.substring(jwt.length - 20)}`);
    }
  }

  // Backend'e gönderilecek header'lar
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers['User-Agent'] = userAgent;

  // Sadece auth cookie'yi forward et (__cf_bm Cloudflare'ı şüphelendirebilir)
  if (cookie) {
    const authCookie = cookie.split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('__anonymousceviri_website='));
    if (authCookie) {
      headers['Cookie'] = authCookie;
      console.log(`[DEBUG /auth/me] Forwarding ONLY auth cookie (${authCookie.length} chars)`);
    } else {
      console.log(`[DEBUG /auth/me] No auth cookie found!`);
    }
  }

  console.log(`[DEBUG /auth/me] Forwarding to: ${url}`);
  console.log(`[DEBUG /auth/me] Headers sent: ${JSON.stringify(Object.keys(headers))}`);

  return new Promise<NextResponse>((resolve) => {
    const urlObj = new URL(url);

    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers,
      agent: httpsAgent,
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf-8');
        console.log(`[DEBUG /auth/me] Backend response: ${res.statusCode}`);
        console.log(`[DEBUG /auth/me] Backend body: ${responseBody.substring(0, 300)}`);

        // Backend'in set-cookie döndürdüyse logla
        if (res.headers['set-cookie']) {
          console.log(`[DEBUG /auth/me] Backend Set-Cookie count: ${res.headers['set-cookie'].length}`);
        }
        console.log(`[DEBUG /auth/me] ============================\n`);

        let responseBodyForClient = responseBody;
        try {
          const parsed = JSON.parse(responseBody);
          if (parsed?.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
            delete parsed.data.UserId;
            delete parsed.data.userId;
          }
          responseBodyForClient = JSON.stringify(parsed);
        } catch {
          // Non-JSON response, forward as-is.
        }

        const nextResponse = new NextResponse(responseBodyForClient, {
          status: res.statusCode || 500,
          headers: {
            'Content-Type': res.headers['content-type'] || 'application/json',
          },
        });

        // Set-Cookie ilet
        const setCookieRaw = res.headers['set-cookie'];
        if (setCookieRaw) {
          const isLocalhost = request.headers.get('host')?.includes('localhost') ?? false;
          setCookieRaw.forEach((raw) => {
            let adjusted = raw;
            if (isLocalhost) {
              adjusted = adjusted.replace(/;\s*Domain=[^;]*/gi, '');
              adjusted = adjusted.replace(/;\s*Secure/gi, '');
              adjusted = adjusted.replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
              if (!/;\s*Path=/i.test(adjusted)) adjusted += '; Path=/';
              else adjusted = adjusted.replace(/;\s*Path=[^;]*/gi, '; Path=/');
            }
            nextResponse.headers.append('Set-Cookie', adjusted);
          });
        }

        resolve(nextResponse);
      });
    });

    req.on('error', (error) => {
      console.error(`[DEBUG /auth/me] ERROR: ${error.message}`);
      resolve(NextResponse.json({ status: false, message: 'Backend bağlantı hatası.' }, { status: 502 }));
    });

    req.end();
  });
}
