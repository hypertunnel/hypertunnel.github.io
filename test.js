(function(){
  try{var t=localStorage.getItem('ht_theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}

  // Only DigitalOcean (or the exact server IP) proves the tunnel — NOT the city,
  // which reads "Sydney" for any eastern-Australian connection even when untunnelled.
  var EXPECTED = { ip: '209.38.91.204', org: /digital\s?ocean/i };

  // A representative sample — not exhaustive. A single red dot doesn't mean you're
  // unprotected; the IP verdict above is the real signal.
  var SITES = ['youtube.com','discord.com','instagram.com','tiktok.com','reddit.com','roblox.com','twitch.tv','spotify.com','snapchat.com'];

  var $ = function(id){ return document.getElementById(id); };

  function setVerdict(state, title, sub){
    var v = $('verdict'); v.className = 'verdict ' + state;
    var ico = $('vico');
    if(state==='ok') ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    else if(state==='bad') ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    else ico.innerHTML = '<div class="spin"></div>';
    $('vtitle').textContent = title; $('vsub').textContent = sub;
  }

  function checkIP(){
    setVerdict('checking','Checking…','Looking up where your traffic is coming from.');
    $('rows').hidden = true;
    fetch('https://ipwho.is/?fields=ip,city,region,country,connection', {cache:'no-store'})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(!d || d.success===false) throw new Error('lookup failed');
        var isp = (d.connection && (d.connection.isp || d.connection.org)) || 'Unknown';
        $('r-ip').textContent = d.ip || '—';
        $('r-loc').textContent = [d.city, d.country].filter(Boolean).join(', ') || '—';
        $('r-isp').textContent = isp;
        $('rows').hidden = false;
        var tunnelled = EXPECTED.org.test(isp) || d.ip===EXPECTED.ip;
        if(tunnelled){
          $('r-isp').classList.add('hit'); $('r-loc').classList.add('hit');
          setVerdict('ok','You’re protected ✅','Your traffic is exiting through HyperTunnel (' + isp + '). Your real IP and location are hidden.');
        } else {
          setVerdict('bad','Not tunnelled yet','You’re on your real connection: ' + isp + (d.city?(', '+d.city):'') + '. Open Hiddify, hit connect, then Run again.');
        }
      })
      .catch(function(){
        setVerdict('bad','Couldn’t check','Couldn’t reach the lookup service. If you’re on a blocked network and NOT connected, that itself means you’re not tunnelled yet.');
      });
  }

  // Reachability probe. A no-cors fetch resolves (opaque) as soon as the host is
  // reachable — even on a 404 — and only rejects on a real network/DNS block or
  // timeout. That's a far more reliable "can I reach this host" signal than the old
  // <img> favicon trick, which false-flagged any site without a hotlinkable favicon.
  function probe(site){
    return new Promise(function(res){
      var done=false;
      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var t = setTimeout(function(){ if(!done){done=true; if(ctrl) ctrl.abort(); res(false);} }, 6000);
      fetch('https://'+site+'/favicon.ico?_='+Date.now(), { mode:'no-cors', cache:'no-store', signal: ctrl ? ctrl.signal : undefined })
        .then(function(){ if(!done){done=true; clearTimeout(t); res(true);} })
        .catch(function(){ if(!done){done=true; clearTimeout(t); res(false);} });
    });
  }

  function checkReach(){
    var grid=$('grid'); grid.innerHTML=''; var done=0, ok=0;
    SITES.forEach(function(s){
      var el=document.createElement('div'); el.className='site'; el.innerHTML='<span class="dot"></span>'+s;
      grid.appendChild(el);
      probe(s).then(function(good){
        done++; if(good){ok++;el.classList.add('ok');} else el.classList.add('bad');
        $('reachcount').textContent = ok+'/'+SITES.length+' reachable';
      });
    });
  }

  function run(){ checkIP(); checkReach(); }
  $('rerun').addEventListener('click', run);
  run();
})();
