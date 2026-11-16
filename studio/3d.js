(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.top'), sticky = document.querySelector('.sticky-cta');

  // progress of a tall pinned section: 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom
  function progress(el) {
    var r = el.getBoundingClientRect(), span = r.height - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }

  // ---------- hero: draw the turning jacket from a frame sequence
  var hero = document.getElementById('hero'), canvas = hero.querySelector('.turn'), ctx = canvas.getContext('2d');
  var deg = hero.querySelector('.deg'), FRAMES = 96, frames = new Array(FRAMES), current = -1;
  function src(i) { return '3d/frames/' + String(i).padStart(3, '0') + '.webp'; }
  function nearestLoaded(i) {
    for (var d = 0; d < FRAMES; d++) {
      var a = frames[(i + d) % FRAMES], b = frames[(i - d + FRAMES) % FRAMES];
      if (a && a.complete && a.naturalWidth) return a;
      if (b && b.complete && b.naturalWidth) return b;
    }
    return null;
  }
  function draw(i) {
    var img = nearestLoaded(i); if (!img) return;
    if (canvas.width !== img.naturalWidth) { canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; }
    ctx.drawImage(img, 0, 0); current = i;
  }
  function load(i) { var im = new Image(); im.decoding = 'async'; im.src = src(i); im.onload = function () { if (current === -1 || i === target) draw(target); }; frames[i] = im; }
  var target = 0;
  if (!reduce) {
    load(0);
    // load every 8th frame first so scrubbing works early, then fill in the rest
    for (var s = 8; s >= 1; s = s >> 1) for (var i = 0; i < FRAMES; i += s) if (!frames[i]) load(i);
  }

  // ---------- exploded stack
  var stackSec = document.getElementById('built'), stack = stackSec.querySelector('.stack'),
      planes = stackSec.querySelectorAll('.plane'), items = stackSec.querySelectorAll('.layer-list li');

  // ---------- models rail
  var railSec = document.getElementById('models'), track = railSec.querySelector('.track'), cards = railSec.querySelectorAll('.card');

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function frame() {
    ticking = false;
    header.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6);
    if (sticky) sticky.classList.toggle('hide-top', window.scrollY < window.innerHeight * 0.9);
    if (reduce) return;

    var p = progress(hero);
    target = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
    if (target !== current) draw(target);
    deg.textContent = String(Math.round(p * 360)).padStart(3, '0') + '°';
    hero.style.setProperty('--prog', p.toFixed(3));

    var q = progress(stackSec), e = ease(Math.min(1, q / 0.75));
    stack.style.setProperty('--e', e.toFixed(3));
    var active = q < 0.25 ? 0 : q < 0.55 ? 1 : 2;
    items.forEach(function (li, k) { li.classList.toggle('on', k <= active); });
    planes.forEach(function (pl, k) { pl.classList.toggle('hot', k === active); });

    var rp = progress(railSec), max = track.scrollWidth - window.innerWidth;
    track.style.setProperty('--x', Math.max(0, rp * max).toFixed(1));
    var mid = window.innerWidth / 2;
    cards.forEach(function (c) {
      var r = c.getBoundingClientRect(), off = (r.left + r.width / 2 - mid) / mid;
      off = Math.max(-1.2, Math.min(1.2, off));
      c.style.setProperty('--ry', (-off * 14).toFixed(2));
      c.style.setProperty('--s', (1 - Math.abs(off) * 0.06).toFixed(3));
    });
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // ---------- reveal on scroll
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- detail tiles tilt toward the pointer
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (t) {
      t.addEventListener('pointermove', function (ev) {
        var r = t.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
        t.style.transform = 'rotateY(' + (x * 12).toFixed(2) + 'deg) rotateX(' + (-y * 12).toFixed(2) + 'deg)';
      });
      t.addEventListener('pointerleave', function () { t.style.transform = ''; });
    });
  }
})();
