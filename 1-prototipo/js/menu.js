// Desplegables: todo el botón los abre, no solo la flecha.
// Escritorio con ratón: se abren al pasar; pulsar el nombre abre la página.
// Táctil o menú hamburguesa: tocar la fila despliega; el primer enlace lleva a la página.
(() => {
  const ancho = matchMedia('(min-width:1280px)'), raton = matchMedia('(hover:hover) and (pointer:fine)');
  const conRaton = () => ancho.matches && raton.matches;
  const subs = [...document.querySelectorAll('.e-sub')];
  const poner = (li, v) => { const d = li.querySelector('details'); if (d.open !== v) d.open = v; };
  subs.forEach(li => {
    const d = li.querySelector('details'), a = li.querySelector(':scope > a'), s = d.querySelector('summary');
    let t;
    li.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && conRaton()) { clearTimeout(t); subs.forEach(o => o !== li && poner(o, false)); poner(li, true); } });
    li.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && conRaton()) { clearTimeout(t); t = setTimeout(() => poner(li, false), 250); } });
    // Con ratón ya está abierto al pasar: pulsar la flecha no debe cerrarlo (con teclado, sí alterna)
    s.addEventListener('click', e => { if (conRaton() && e.detail > 0 && e.pointerType !== 'touch') { e.preventDefault(); poner(li, true); } });
    let tactil = false;
    a.addEventListener('pointerdown', e => { tactil = e.pointerType !== 'mouse'; });
    a.addEventListener('keydown', () => { tactil = false; });
    a.addEventListener('click', e => { if (!ancho.matches || tactil) { e.preventDefault(); const v = !d.open; subs.forEach(o => poner(o, false)); poner(li, v); } });
    li.addEventListener('focusout', e => { if (ancho.matches && e.relatedTarget && !li.contains(e.relatedTarget)) poner(li, false); });
  });
  document.addEventListener('pointerdown', e => subs.forEach(li => { if (!li.contains(e.target)) poner(li, false); }));
})();
