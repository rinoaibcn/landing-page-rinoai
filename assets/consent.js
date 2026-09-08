/* RinoAI — Consent Mode v2 + aviso de cookies para páginas internas.
   Comparte la clave de localStorage con la home, así la elección vale en todo el sitio. */
(function () {
  var GA_ID = 'G-FBNS0EM7DB';
  var KEY = 'rinoai_cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'denied'
  });
  gtag('js', new Date());

  window.rinoaiLoadGA = function () {
    if (window.__rinoaiGA) return;
    window.__rinoaiGA = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('config', GA_ID, { anonymize_ip: true });
  };

  function read(){ try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }

  function buildBanner() {
    var css = document.createElement('style');
    css.textContent =
      '#ck-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:10001;background:#0d0d16;' +
      'border:1px solid rgba(108,99,255,.3);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.55);' +
      'padding:16px 18px;font:14px/1.55 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#d8d8e6}' +
      '#ck-banner .ck-inner{max-width:1080px;margin:0 auto;display:flex;gap:16px 20px;align-items:center;' +
      'flex-wrap:wrap;justify-content:space-between}#ck-banner .ck-txt{margin:0;flex:1 1 440px;min-width:260px}' +
      '#ck-banner a{color:#a78bfa;text-decoration:underline}#ck-banner .ck-btns{display:flex;gap:10px}' +
      '#ck-banner button{border-radius:9px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer;' +
      'border:1px solid transparent;font-family:inherit}#ck-banner .ck-ghost{background:transparent;' +
      'border-color:rgba(255,255,255,.24);color:#d8d8e6}#ck-banner .ck-solid{background:#6c63ff;color:#fff}' +
      '@media(max-width:560px){#ck-banner .ck-btns{width:100%}#ck-banner button{flex:1}}';
    document.head.appendChild(css);

    var b = document.createElement('div');
    b.id = 'ck-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<div class="ck-inner"><p class="ck-txt">Usamos una cookie propia necesaria y, solo si lo aceptas, ' +
      'cookies de <strong>Google Analytics</strong> para medir el tráfico de forma anónima. ' +
      'Consulta la <a href="/politica-de-privacidad#cookies">política de cookies</a>.</p>' +
      '<div class="ck-btns"><button type="button" class="ck-ghost" id="ck-reject">Rechazar</button>' +
      '<button type="button" class="ck-solid" id="ck-accept">Aceptar</button></div></div>';
    document.body.appendChild(b);
    return b;
  }

  function init() {
    var stored = read();
    if (stored === 'granted') { window.rinoaiLoadGA(); return; }
    if (stored === 'denied') { return; }
    var banner = buildBanner();
    function choose(v){ write(v); banner.remove(); if (v === 'granted') window.rinoaiLoadGA(); }
    document.getElementById('ck-accept').addEventListener('click', function(){ choose('granted'); });
    document.getElementById('ck-reject').addEventListener('click', function(){ choose('denied'); });
  }

  window.rinoaiOpenCookieSettings = function () {
    write('');
    try { localStorage.removeItem(KEY); } catch (e) {}
    if (!document.getElementById('ck-banner')) {
      var banner = buildBanner();
      function choose(v){ write(v); banner.remove(); if (v === 'granted') window.rinoaiLoadGA(); }
      document.getElementById('ck-accept').addEventListener('click', function(){ choose('granted'); });
      document.getElementById('ck-reject').addEventListener('click', function(){ choose('denied'); });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
