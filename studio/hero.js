(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var hero = document.querySelector('.vhero'), video = hero && hero.querySelector('.vhero-video'), btn = hero && hero.querySelector('.sound');
  if (video && !reduce && !saveData) {
    video.src = window.innerWidth >= 1000 ? 'hero/hero_1080.mp4' : 'hero/hero_720.mp4';
    video.muted = true;
    var p = video.play(); if (p && p.catch) p.catch(function () {});
    btn.hidden = false;
    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (!video.muted) { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
      btn.setAttribute('aria-pressed', String(!video.muted));
      btn.querySelector('.sound-text').textContent = video.muted ? 'Sound on' : 'Sound off';
    });
  }
  // play videos only while they are on screen
  var vids = [].slice.call(document.querySelectorAll('.world video'));
  if (video && !reduce && !saveData) vids.push(video);
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var r = v.play(); if (r && r.catch) r.catch(function () {}); } else { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { if (v !== video || v.src) io.observe(v); });
  }
})();
