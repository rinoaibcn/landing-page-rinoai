/* RinoAI — botón + ventana flotante de WhatsApp (esquina inferior derecha).
   Al abrir, 3 mensajes aparecen con efecto de "escribiendo…". */
(function () {
  var NUM = '34683327908';
  var NAME = 'RinoAI';
  var AVATAR = '/icon.png';
  var MSGS = [
    '¡Hola! 👋 Soy Mauro, de RinoAI.',
    'Ayudamos a pymes a automatizar procesos y a integrar agentes de IA. ¿Qué tienes entre manos?',
    'Escríbeme por WhatsApp y le damos una vuelta a tu caso, sin compromiso.'
  ];
  var WA_GLYPH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  var css = document.createElement('style');
  css.textContent = [
    '#wa-fab{position:fixed;right:24px;bottom:24px;z-index:9998;width:56px;height:56px;border:0;padding:0;',
      'border-radius:50%;background:#25D366;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 6px 24px rgba(37,211,102,.45);transition:transform .2s,box-shadow .2s}',
    '#wa-fab:hover{transform:scale(1.08);box-shadow:0 8px 30px rgba(37,211,102,.6)}',
    '#wa-fab svg{width:30px;height:30px;fill:#fff}',
    '#wa-fab::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(37,211,102,.45);animation:wa-pulse 2.4s ease-out infinite}',
    '#wa-fab.wa-on::after{animation:none}',
    '@keyframes wa-pulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.45)}70%{box-shadow:0 0 0 18px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}',
    '#wa-panel{position:fixed;right:24px;bottom:92px;z-index:10000;width:340px;max-width:calc(100vw - 32px);',
      'border-radius:16px;overflow:hidden;background:#E7E0D8;box-shadow:0 20px 60px rgba(0,0,0,.45);',
      'font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;',
      'opacity:0;transform:translateY(12px) scale(.96);transform-origin:bottom right;pointer-events:none;',
      'transition:opacity .18s ease,transform .18s ease}',
    '#wa-panel.open{opacity:1;transform:none;pointer-events:auto}',
    '#wa-panel .wa-hd{display:flex;align-items:center;gap:10px;background:#075E54;color:#fff;padding:12px 14px}',
    '#wa-panel .wa-av{width:38px;height:38px;border-radius:50%;object-fit:cover;background:#0b0b12;flex:0 0 auto}',
    '#wa-panel .wa-hd-t{display:flex;flex-direction:column;line-height:1.25;flex:1;min-width:0}',
    '#wa-panel .wa-hd-t strong{font-size:14.5px}',
    '#wa-panel .wa-hd-t span{font-size:12px;color:rgba(255,255,255,.8)}',
    '#wa-panel .wa-x{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:2px 4px;opacity:.85}',
    '#wa-panel .wa-x:hover{opacity:1}',
    '#wa-panel .wa-body{padding:14px 12px 6px;max-height:300px;overflow-y:auto;background-color:#E7E0D8;',
      'background-image:radial-gradient(rgba(0,0,0,.04) 1px,transparent 1px);background-size:22px 22px}',
    '#wa-panel .wa-day{width:max-content;margin:0 auto 12px;background:#E1F2FB;color:#54656F;font-size:11.5px;',
      'font-weight:600;padding:4px 12px;border-radius:8px}',
    '#wa-panel .wa-b{position:relative;max-width:82%;background:#fff;color:#303030;border-radius:9px;',
      'border-top-left-radius:2px;padding:7px 10px 6px;margin:0 0 9px;box-shadow:0 1px 1px rgba(0,0,0,.13);',
      'animation:wa-in .22s ease both}',
    '#wa-panel .wa-b p{margin:0;white-space:pre-wrap}',
    '#wa-panel .wa-b time{display:block;text-align:right;font-size:10.5px;color:#667781;margin-top:2px}',
    '#wa-panel .wa-typing{display:flex;gap:4px;align-items:center;padding:11px 12px}',
    '#wa-panel .wa-typing span{width:6px;height:6px;border-radius:50%;background:#9aa4ab;animation:wa-blink 1.2s infinite}',
    '#wa-panel .wa-typing span:nth-child(2){animation-delay:.2s}#wa-panel .wa-typing span:nth-child(3){animation-delay:.4s}',
    '@keyframes wa-blink{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}',
    '@keyframes wa-in{from{opacity:0;transform:translateY(6px) scale(.97)}to{opacity:1;transform:none}}',
    '#wa-panel .wa-foot{padding:10px 12px 14px;background:#E7E0D8}',
    '#wa-panel .wa-go{display:flex;align-items:center;justify-content:center;gap:9px;background:#25D366;color:#fff;',
      'text-decoration:none;font-weight:700;font-size:14.5px;padding:12px;border-radius:26px;box-shadow:0 6px 18px rgba(37,211,102,.4)}',
    '#wa-panel .wa-go:hover{background:#1eb257}',
    '#wa-panel .wa-go svg{width:20px;height:20px;fill:#fff}',
    '#wa-panel .wa-note{text-align:center;font-size:11px;color:#8696A0;margin-top:8px}',
    '@media(max-width:560px){#wa-fab{right:16px;bottom:16px;width:52px;height:52px}',
      '#wa-panel{right:12px;left:12px;width:auto;max-width:none;bottom:82px}}'
  ].join('');
  document.head.appendChild(css);

  var fab = document.createElement('button');
  fab.id = 'wa-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Abrir chat de WhatsApp');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = WA_GLYPH;
  document.body.appendChild(fab);

  var panel = document.createElement('div');
  panel.id = 'wa-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat de WhatsApp con ' + NAME);
  panel.innerHTML =
    '<div class="wa-hd"><img class="wa-av" src="' + AVATAR + '" alt="">' +
    '<div class="wa-hd-t"><strong>' + NAME + '</strong><span>en línea</span></div>' +
    '<button class="wa-x" type="button" aria-label="Cerrar">×</button></div>' +
    '<div class="wa-body"><div class="wa-day">Hoy</div><div class="wa-msgs"></div></div>' +
    '<div class="wa-foot"><a class="wa-go" href="https://wa.me/' + NUM + '" target="_blank" rel="noopener">' +
    WA_GLYPH + ' Continuar en WhatsApp</a>' +
    '<div class="wa-note">Se abre WhatsApp sin ningún mensaje escrito</div></div>';
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('.wa-msgs');
  var bodyEl = panel.querySelector('.wa-body');
  var timers = [];
  var played = false;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function scrollDown() { bodyEl.scrollTop = bodyEl.scrollHeight; }
  function now() {
    try { return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { var d = new Date(); return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); }
  }

  function playSequence() {
    clearTimers();
    msgsEl.innerHTML = '';
    var delay = 400;
    MSGS.forEach(function (text) {
      timers.push(setTimeout(function () {
        var typing = document.createElement('div');
        typing.className = 'wa-b wa-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        msgsEl.appendChild(typing);
        scrollDown();
      }, delay));
      delay += 950;
      timers.push(setTimeout(function () {
        var t = msgsEl.querySelector('.wa-typing');
        if (t) t.remove();
        var b = document.createElement('div');
        b.className = 'wa-b';
        b.innerHTML = '<p></p><time>' + now() + '</time>';
        b.querySelector('p').textContent = text;
        msgsEl.appendChild(b);
        scrollDown();
      }, delay));
      delay += 500;
    });
  }

  function open() {
    panel.classList.add('open');
    fab.classList.add('wa-on');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Cerrar chat de WhatsApp');
    playSequence();
    played = true;
  }
  function close() {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir chat de WhatsApp');
    clearTimers();
  }
  function toggle() { panel.classList.contains('open') ? close() : open(); }

  fab.addEventListener('click', toggle);
  panel.querySelector('.wa-x').addEventListener('click', close);
  panel.querySelector('.wa-go').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
})();
