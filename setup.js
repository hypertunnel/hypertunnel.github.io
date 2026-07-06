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

  // GA4 purchase event ("bought"). Fires only when Stripe redirects back here after a
  // successful payment. Set each Stripe payment link's success URL to:
  //   https://hypertunnel.github.io/setup.html?purchased=1&value=<price>
  // Stripe (dashboard) stays the source of truth for actual sales — this just lets GA
  // draw the visitors -> checkout -> purchase funnel.
  try {
    var q = new URLSearchParams(location.search);
    if (window.gtag && q.get('purchased') === '1') {
      var v = parseFloat(q.get('value'));
      gtag('event', 'purchase', {
        currency: 'AUD',
        value: isNaN(v) ? undefined : v,
        transaction_id: q.get('sid') || ('ht_' + Date.now())
      });
    }
  } catch (e) {}
})();
