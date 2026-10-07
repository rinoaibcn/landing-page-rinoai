const FIELDS = [
  ['nombre', 'Nombre'],
  ['empresa', 'Empresa'],
  ['email', 'Email'],
  ['¿Qué necesitas?', '¿Qué necesitas?'],
  ['mensaje', 'Mensaje'],
];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  // Campo trampa invisible: solo lo rellenan los bots. Fingimos éxito para no darles pistas.
  if (data.website) return json({ ok: true });

  const get = (key) => String(data[key] ?? '').trim().slice(0, 5000);
  const nombre = get('nombre');
  const email = get('email');
  if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Faltan el nombre o un email válido.' }, 400);
  }

  const rows = FIELDS.map(([key, label]) => [label, get(key) || '—']);
  const text = rows.map(([label, value]) => `${label}:\n${value}`).join('\n\n');
  const html =
    '<table cellpadding="8" style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">' +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="color:#888;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>` +
          `<td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
      )
      .join('') +
    '</table>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Nueva notificación <web@rinoai.es>',
      to: [env.CONTACT_TO || 'contacto@rinoai.es'],
      reply_to: email,
      subject: `Nueva solicitud de llamada: ${nombre}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', res.status, await res.text());
    return json({ error: 'No se pudo enviar el mensaje.' }, 502);
  }
  return json({ ok: true });
}
