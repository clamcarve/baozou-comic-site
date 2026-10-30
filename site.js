(function () {
  // 翻译对比：滑块只改一个 CSS 变量，遮罩和分割线都跟着它走
  var compare = document.getElementById('compare');
  if (compare) {
    var range = compare.querySelector('input');
    var apply = function () { compare.style.setProperty('--p', range.value + '%'); };
    range.addEventListener('input', apply);
    apply();
  }

  // 滚动到才淡入；不支持或用户关了动画时直接显示
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.heading, .split-copy, .source, .gallery figure, .feature-grid article, .phone-solo');
  if (!still && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  var copyBtn = document.getElementById('copy-group');
  if (copyBtn) {
    var copyStatus = document.getElementById('copy-status');
    copyBtn.addEventListener('click', function () {
      var id = document.getElementById('group-id').textContent;
      // 剪贴板接口只在 HTTPS 下有；拿不到时提示手动复制，群号本身点一下就能全选
      var job = navigator.clipboard ? navigator.clipboard.writeText(id) : Promise.reject();
      job.then(function () { copyStatus.textContent = '已复制'; }, function () { copyStatus.textContent = '复制失败，请手动选中群号复制'; });
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function fileButton(f) {
    var a = el('a', 'btn', f.url ? f.label : f.label + '（即将开放）');
    if (f.url) {
      a.href = f.url;
      a.rel = 'noopener';
    } else {
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('role', 'link');
    }
    return a;
  }

  function card(p) {
    var latest = p.versions[0];
    var c = el('article', 'dl-card');
    c.appendChild(el('h3', '', p.name));
    c.appendChild(el('p', 'dl-devices', p.devices));
    c.appendChild(el('p', 'dl-ver', '版本 ' + latest.version + (latest.date ? ' · ' + latest.date : '')));
    c.appendChild(el('p', 'dl-notes', latest.notes || ''));
    var files = el('div', 'dl-files');
    latest.files.forEach(function (f) { files.appendChild(fileButton(f)); });
    c.appendChild(files);
    var old = p.versions.slice(1);
    if (old.length) {
      var d = el('details', 'dl-history');
      d.appendChild(el('summary', '', '历史版本'));
      var ul = el('ul');
      old.forEach(function (v) {
        var li = el('li', '', v.version + (v.date ? ' · ' + v.date : ''));
        v.files.forEach(function (f) {
          if (!f.url) return;
          var a = el('a', '', f.label);
          a.href = f.url;
          a.rel = 'noopener';
          li.appendChild(a);
        });
        ul.appendChild(li);
      });
      d.appendChild(ul);
      c.appendChild(d);
    }
    return c;
  }

  // 带时间戳绕开 CDN 和浏览器缓存：改完 versions.json 要尽快生效
  fetch('versions.json?t=' + Math.floor(Date.now() / 60000))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var grid = document.getElementById('dl-grid');
      grid.textContent = '';
      ['android', 'ios'].forEach(function (key) {
        var p = data[key];
        if (!p || !p.versions || !p.versions.length) return;
        grid.appendChild(card(p));
        var first = p.versions[0].files.filter(function (f) { return f.url; })[0];
        var hero = document.querySelector('[data-latest="' + key + '"]');
        if (first && hero) { hero.href = first.url; hero.rel = 'noopener'; }
      });
      var v = data.android && data.android.versions[0];
      var slot = document.querySelector('[data-version]');
      if (v && slot) slot.textContent = v.version;
    })
    .catch(function () { /* 保留 HTML 里的提示文字 */ });

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[aria-disabled="true"]');
    if (t) e.preventDefault();
  });
})();
