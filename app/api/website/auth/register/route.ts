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
  const url = `${BACKEND_URL}/auth/register`;

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
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf-8');
        console.log(`[Auth Proxy] ← ${res.statusCode} ${responseBody.substring(0, 200)}`);

        const nextResponse = new NextResponse(responseBody, {
          status: res.statusCode || 500,
          headers: { 'Content-Type': res.headers['content-type'] || 'application/json' },
        });

        // Set-Cookie
        const setCookieRaw = res.headers['set-cookie'];
        if (setCookieRaw) {
          const isLocalhost = request.headers.get('host')?.includes('localhost') ?? false;
          setCookieRaw.forEach((raw) => {
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
            nextResponse.headers.append('Set-Cookie', adjusted);
          });
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
