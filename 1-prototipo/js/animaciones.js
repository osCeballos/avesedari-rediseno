// Animaciones de la Home. Si algo falla, el contenido queda visible (ver <head>).
(() => {
  const raiz = document.documentElement;
  if (!raiz.classList.contains('anim')) { window.__anim = true; cabecera(); return; }
  const S = [...document.querySelectorAll('.h-cards,.h-pres,.h-est,.h-cif,.h-tes,.h-vid,.h-log,.h-cta')];
  document.querySelectorAll('.h-cif dl>div,.h-log li').forEach(e => e.style.setProperty('--i', [...e.parentNode.children].indexOf(e)));
  document.querySelectorAll('.h-trazo path').forEach(p => p.setAttribute('pathLength', 1));
  const entra = s => { if (s.classList.contains('v')) return; s.classList.add('v', 'entra'); setTimeout(() => s.classList.remove('entra'), 2500); };
  // Entra cuando asoma el 18 % o, si es muy alta, cuando ocupa un cuarto de pantalla.
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && (e.intersectionRatio >= .18 || e.intersectionRect.height > innerHeight * .25) || e.boundingClientRect.bottom < 0) { entra(e.target); io.unobserve(e.target); }
  }), { threshold: [0, .05, .1, .18, .3] });
  S.forEach(s => io.observe(s));
  // El foco de teclado nunca cae en algo invisible.
  document.addEventListener('focusin', e => { const s = e.target.closest('.h-cards,.h-pres,.h-est,.h-cif,.h-tes,.h-vid,.h-log,.h-cta'); if (s) entra(s); });
  // Testimonios: al elegir persona.
  document.querySelectorAll('.h-panel').forEach(p => new MutationObserver(m => {
    if (m.some(x => /\boff\b/.test(x.oldValue || '') && !p.classList.contains('off'))) { p.classList.remove('cambia'); void p.offsetWidth; p.classList.add('cambia'); }
  }).observe(p, { attributes: true, attributeFilter: ['class'], attributeOldValue: true }));
  cabecera();
  // Controles de revisión (solo prototipo).
  const lento = document.getElementById('lento'), rep = document.getElementById('repetir');
  if (lento) lento.onchange = () => raiz.style.setProperty('--av-ritmo', lento.checked ? 4 : 1);
  if (rep) rep.onclick = () => {
    const c = innerHeight / 2, todas = [document.querySelector('.h-hero'), ...S].map(s => [s, s.getBoundingClientRect()]).filter(([, r]) => r.bottom > 0 && r.top < innerHeight);
    const vis = todas.filter(([, r]) => r.top <= c && r.bottom >= c).map(x => x[0]); const L = vis.length ? vis : todas.map(x => x[0]);
    L.forEach(s => {
      if (s.matches('.h-hero')) { raiz.classList.remove('anim'); void s.offsetWidth; raiz.classList.add('anim'); return; }
      s.style.transition = 'none'; raiz.classList.add('sin-t'); s.classList.remove('v'); void s.offsetWidth;
      setTimeout(() => { raiz.classList.remove('sin-t'); s.style.transition = ''; entra(s); }, 120);
    });
  };
  window.__anim = true;
  function cabecera() {
    const c = document.querySelector('.w-cab'); let y0 = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY, abierto = c.querySelector('nav.abierto,details[open]');
      if (Math.abs(y - y0) < 6 && y > 0) return;
      c.classList.toggle('fija', y > innerHeight * .7 && (y < y0 || !!abierto && c.classList.contains('fija'))); y0 = y;
    }, { passive: true });
  }
})();
