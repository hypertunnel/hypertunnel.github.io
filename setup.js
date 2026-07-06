(function(){
  var root = document.documentElement;
  try { var s = localStorage.getItem('ht_theme'); if (s) root.setAttribute('data-theme', s); } catch(e){}
  document.getElementById('themeToggle').addEventListener('click', function(){
    var n = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', n); try { localStorage.setItem('ht_theme', n); } catch(e){}
  });
  // platform tabs
  document.querySelectorAll('.tab').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.tab').forEach(function(x){ x.classList.remove('on'); });
      document.querySelectorAll('.pane').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on'); document.getElementById('pane-' + b.dataset.pane).classList.add('on');
    });
  });
  var CONTACT = 'admin@ubghyper.xyz';  // support email
  var help = 'mailto:' + CONTACT + '?subject=' + encodeURIComponent('HyperTunnel setup help');
  var hb = document.getElementById('help-btn'); if (hb) hb.href = help;
  var fs = document.getElementById('foot-support'); if (fs) fs.href = 'mailto:' + CONTACT;
})();
