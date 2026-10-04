import { handleChat } from './chat.js';
import { handleContact } from './contact.js';

const HOME_LINK =
  '<https://rinoai.es/sitemap.xml>; rel="sitemap", ' +
  '<https://rinoai.es/llms.txt>; rel="alternate"; type="text/plain", ' +
  '<https://rinoai.es/index.md>; rel="alternate"; type="text/markdown", ' +
  '<https://rinoai.es/.well-known/api-catalog>; rel="api-catalog"';

const CONTENT_TYPES = {
  '/.well-known/api-catalog': 'application/linkset+json; charset=utf-8',
  '/index.md': 'text/markdown; charset=utf-8',
  '/llms.txt': 'text/plain; charset=utf-8',
};

const withHeaders = (res, headers) => {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(headers)) out.headers.set(k, v);
  return out;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') return handleChat(request, env);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (url.pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });

    if (url.pathname === '/') {
      // Negociación de contenido: quien pide Markdown (agentes de IA) recibe /index.md en la misma URL.
      if ((request.headers.get('accept') || '').includes('text/markdown')) {
        const md = await env.ASSETS.fetch(new Request(new URL('/index.md', url), request));
        return withHeaders(md, { 'Content-Type': CONTENT_TYPES['/index.md'], Link: HOME_LINK, Vary: 'Accept' });
      }
      return withHeaders(await env.ASSETS.fetch(request), { Link: HOME_LINK, Vary: 'Accept' });
    }

    // Verificación de Google Search Console: debe responder 200 en la URL .html exacta, sin redirigir.
    if (/^\/google[0-9a-f]+\.html$/.test(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL(url.pathname.slice(0, -5), url), request));
    }

    const type = CONTENT_TYPES[url.pathname];
    if (type) return withHeaders(await env.ASSETS.fetch(request), { 'Content-Type': type });

    return env.ASSETS.fetch(request);
  },
};
