// Carga el reproductor de YouTube solo al hacer clic: sin cookies ni peso extra hasta entonces.
document.addEventListener('click', e => {
  const btn = e.target.closest('.yt-facade');
  if (!btn) return;
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(btn.dataset.yt) + '?autoplay=1&rel=0';
  iframe.title = btn.dataset.title || 'Vídeo de YouTube';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.className = 'yt-frame';
  btn.replaceWith(iframe);
});
