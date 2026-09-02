import { rewrite, next } from '@vercel/edge';

// Solo intercepta la home. El resto del sitio y /api/* no se tocan.
export const config = { matcher: '/' };

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';

  // Negociación de contenido: si el cliente pide Markdown explícitamente,
  // servimos /index.md manteniendo la URL en "/". Los navegadores piden
  // text/html, así que reciben la web normal.
  if (accept.includes('text/markdown')) {
    return rewrite(new URL('/index.md', request.url));
  }

  return next();
}
