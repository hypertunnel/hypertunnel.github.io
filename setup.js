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
  // Self-serve link resend. The Worker always answers with the same generic message
  // whether or not the address matched, so there is nothing here to branch on — just
  // show what it says.
  var RESEND_URL = 'https://hypertunnel-provision.ames-pearson.workers.dev/resend';
  var rf = document.getElementById('resendForm');
  if (rf) rf.addEventListener('submit', function(e){
    e.preventDefault();
    var input = document.getElementById('resendEmail');
    var btn = document.getElementById('resendBtn');
    var msg = document.getElementById('resendMsg');
    if (!input.value) return;
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(RESEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.value })
    }).then(function(r){ return r.json(); }).then(function(d){
      msg.textContent = (d && d.message) || 'Sent — check your inbox and spam folder.';
      msg.hidden = false;
      btn.textContent = 'Sent';
    }).catch(function(){
      msg.textContent = 'Could not reach the server. Email admin@ubghyper.xyz and we’ll sort it by hand.';
      msg.hidden = false;
      btn.disabled = false; btn.textContent = 'Resend my link';
    });
  });

  // Post-payment acknowledgement. Stripe's After-payment redirect carries ?purchased=1.
  try {
    var pq = new URLSearchParams(location.search);
    if (pq.get('purchased') === '1') {
      var pb = document.getElementById('paidBanner');
      if (pb) pb.hidden = false;
    }
  } catch (e) {}

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
