(function(){
  var root = document.documentElement;
  try { var s = localStorage.getItem('ht_theme'); if (s) root.setAttribute('data-theme', s); } catch(e){}
  var t = document.getElementById('themeToggle');
  if (t) t.addEventListener('click', function(){
    var n = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('ht_theme', n); } catch(e){}
  });
  var fs = document.getElementById('foot-support');
  if (fs) fs.href = 'mailto:admin@ubghyper.xyz';
})();
