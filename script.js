(function(){
  var root = document.documentElement; root.classList.add('js');
  try { var s = localStorage.getItem('ht_theme'); if (s) root.setAttribute('data-theme', s); } catch(e){}
  document.getElementById('themeToggle').addEventListener('click', function(){
    var n = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', n); try { localStorage.setItem('ht_theme', n); } catch(e){}
  });
  var nl = document.getElementById('navLinks');
  document.getElementById('hamburger').addEventListener('click', function(){ nl.classList.toggle('open'); });
  nl.addEventListener('click', function(e){ if (e.target.tagName === 'A') nl.classList.remove('open'); });
  // early-access banner — dismissible, remembers the choice
  var devbar = document.getElementById('devbar');
  if (devbar) {
    try { if (localStorage.getItem('ht_devbar_dismissed')) devbar.hidden = true; } catch(e){}
    var devbarX = document.getElementById('devbarX');
    if (devbarX) devbarX.addEventListener('click', function(){
      devbar.hidden = true; try { localStorage.setItem('ht_devbar_dismissed', '1'); } catch(e){}
    });
  }
  // secondary payment methods — accordion (click to open, click again to close)
  document.querySelectorAll('.pay-alt-tab').forEach(function(b){
    b.addEventListener('click', function(){
      var pane = document.getElementById('pane-' + b.dataset.pane);
      var wasOpen = b.classList.contains('on');
      document.querySelectorAll('.pay-alt-tab').forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
      document.querySelectorAll('.pay-alt-body').forEach(function(x){ x.hidden = true; });
      if (!wasOpen) { b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); if (pane) pane.hidden = false; }
    });
  });
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click', function(){
      navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent).then(function(){
        var o = b.textContent; b.textContent = 'Copied'; b.classList.add('done');
        setTimeout(function(){ b.textContent = o; b.classList.remove('done'); }, 1400);
      });
    });
  });
  /* ---------- PAYMENT CONFIG — edit these before going live ---------- */
  var CONTACT = 'admin@ubghyper.xyz';          // order / support email
  var PLANS = {
    // ⚠ Stripe TEST-mode links — swap for your live buy.stripe.com/... links before launch.
    monthly: { name: 'Monthly',     price: 5,  per: 'month', stripe: 'https://buy.stripe.com/bJe9AV1Nxb8y1qL4c88N201' },
    term:    { name: 'Term pass',   price: 12, per: 'term',  stripe: 'https://buy.stripe.com/8x2fZjcsb3G6glF8so8N202' },
    year:    { name: 'School year', price: 30, per: 'year',  stripe: 'https://buy.stripe.com/6oUcN7dwf4KaedxbEA8N200' }
  };
  /* ------------------------------------------------------------------- */

  var sel = 'term';
  function setPlan(key){
    if (!PLANS[key]) return;
    sel = key; var p = PLANS[key];
    document.querySelectorAll('.ckamt').forEach(function(el){ el.textContent = p.price; });
    var pt = document.getElementById('payTotal'); if (pt) pt.textContent = '$' + p.price;
    var pp = document.getElementById('payPer'); if (pp) pp.textContent = '/ ' + p.per;
    document.querySelectorAll('.pay-plan').forEach(function(b){
      var on = b.dataset.planKey === key;
      b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    var sb = document.getElementById('stripe-btn'); if (sb) sb.href = p.stripe;
  }
  document.querySelectorAll('[data-plan-key]').forEach(function(b){ b.addEventListener('click', function(){ setPlan(b.dataset.planKey); }); });
  setPlan('term');

  // GA4 funnel event — fires when someone starts paying ("almost bought").
  // No-op if analytics is blocked or hasn't loaded.
  function track(name, extra){
    if (!window.gtag) return;
    var p = PLANS[sel] || {};
    var d = { currency: 'AUD', value: p.price, items: [{ item_name: 'HyperTunnel ' + (p.name || '') }] };
    if (extra) for (var k in extra) d[k] = extra[k];
    gtag('event', name, d);
  }
  var sbtn = document.getElementById('stripe-btn');
  if (sbtn) sbtn.addEventListener('click', function(){ track('begin_checkout', { payment_type: 'card' }); });

  var fsup = document.getElementById('foot-support'); if (fsup) fsup.href = 'mailto:' + CONTACT;

  function mail(m){
    var p = PLANS[sel];
    return 'mailto:' + CONTACT + '?subject=' + encodeURIComponent('HyperTunnel order: ' + p.name + ' ($' + p.price + ')')
      + '&body=' + encodeURIComponent('Plan: ' + p.name + ' ($' + p.price + ')\nPaid via: ' + m + '\nMy email for the link: \nPayment reference / screenshot: ');
  }
  ['payid','crypto'].forEach(function(m){
    var el = document.getElementById('cta-' + m); if (el) el.addEventListener('click', function(e){ e.preventDefault(); track('begin_checkout', { payment_type: m }); window.location.href = mail(m); });
  });
  if ('IntersectionObserver' in window) {
    var els = document.querySelectorAll('.sec, .closing');
    var reveal = function(el){ el.classList.add('in'); };
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function(s){ s.classList.add('reveal'); io.observe(s); });
    // safety net: content must never stay hidden if the observer misfires
    setTimeout(function(){ els.forEach(reveal); }, 1800);
  }
})();
