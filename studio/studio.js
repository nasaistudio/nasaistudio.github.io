(function () {
  // before / after sliders
  document.querySelectorAll('.ba input[type="range"]').forEach(function (range) {
    var box = range.closest('.ba');
    range.addEventListener('input', function () { box.style.setProperty('--p', range.value + '%'); });
  });

  // package buttons preselect the matching option in the brief
  var need = document.querySelector('#brief select[name="need"]');
  document.querySelectorAll('[data-pack]').forEach(function (a) {
    a.addEventListener('click', function () {
      var want = a.getAttribute('data-pack') + ' package';
      Array.prototype.forEach.call(need.options, function (o) { if (o.text === want) need.value = o.value; });
    });
  });

  // the brief opens WhatsApp with the message already written; nothing is sent to this site
  var form = document.getElementById('brief');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!f.name.value.trim()) { f.name.focus(); return; }
    var lines = ['Hi, I am ' + f.name.value.trim() + (f.brand.value.trim() ? ' from ' + f.brand.value.trim() : '') + '.',
                 'I am interested in: ' + f.need.value + '.'];
    if (f.note.value.trim()) lines.push(f.note.value.trim());
    lines.push('I will attach a product photo.');
    window.open('https://wa.me/923282891558?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  // hide the mobile call-to-action while the contact section is on screen
  var cta = document.querySelector('.sticky-cta'), contact = document.getElementById('contact');
  if ('IntersectionObserver' in window && cta && contact) {
    new IntersectionObserver(function (en) { cta.classList.toggle('off', en[0].isIntersecting); }, { threshold: 0.15 }).observe(contact);
  }
})();
