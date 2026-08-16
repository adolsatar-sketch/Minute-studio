/* ================================================================
   MINUTE / دقيقة — shared site behaviour
   Nav/menu, scroll reveal, topbar scroll state, running timecodes,
   cursor micro-interaction, magnetic buttons. Loaded on every page.
   ================================================================ */
(function(){

  var hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* ---------- TOPBAR SCROLL STATE ---------- */
  var topbar = document.querySelector('.topbar');
  if(topbar){
    var setScrolled = function(){
      topbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, {passive:true});
  }

  /* ---------- MENU ---------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menuOverlay = document.querySelector('.menu-overlay');
  var menuRows = document.querySelectorAll('.menu-row');
  menuRows.forEach(function(row, i){ row.style.transitionDelay = reducedMotion ? '0ms' : (i * 55) + 'ms'; });

  function openMenu(){
    document.documentElement.classList.add('menu-open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    var firstLink = menuOverlay && menuOverlay.querySelector('a');
    if(firstLink) firstLink.focus({preventScroll:true});
  }
  function closeMenu(){
    document.documentElement.classList.remove('menu-open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    if(menuBtn) menuBtn.focus({preventScroll:true});
  }
  if(menuBtn){
    menuBtn.addEventListener('click', function(){
      document.documentElement.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) closeMenu();
  });
  if(menuOverlay){
    menuOverlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- RUNNING TIMECODE ----------
     Purely decorative brand motif — a small ticking readout,
     not a real clock. Formats elapsed-since-load as HH:MM:SS:FF
     (FF = a stylised 24fps frame count). Throttled to ~10fps of
     its own so it never competes for the main thread. */
  var tcEls = document.querySelectorAll('[data-timecode]');
  if(tcEls.length && !reducedMotion){
    var start = performance.now();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var last = 0;
    function tick(now){
      if(now - last > 90){
        last = now;
        var elapsed = (now - start) / 1000;
        var h = Math.floor(elapsed / 3600);
        var m = Math.floor((elapsed % 3600) / 60);
        var s = Math.floor(elapsed % 60);
        var f = Math.floor((elapsed % 1) * 24);
        var str = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
        tcEls.forEach(function(el){ el.textContent = str; });
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  } else if(tcEls.length){
    tcEls.forEach(function(el){ el.textContent = '00:00:00:00'; });
  }

  /* ---------- CURSOR DOT (desktop only) ---------- */
  if(hoverCapable && !reducedMotion){
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    var raf = null, tx = 0, ty = 0;
    window.addEventListener('pointermove', function(e){
      tx = e.clientX; ty = e.clientY;
      dot.classList.add('active');
      if(!raf){
        raf = requestAnimationFrame(function(){
          dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%)';
          raf = null;
        });
      }
    }, {passive:true});
    document.addEventListener('mouseleave', function(){ dot.classList.remove('active'); });
    document.querySelectorAll('a, button, [data-cursor-big]').forEach(function(el){
      el.addEventListener('mouseenter', function(){ dot.classList.add('big'); });
      el.addEventListener('mouseleave', function(){ dot.classList.remove('big'); });
    });
  }

  /* ---------- MAGNETIC BUTTONS (desktop only) ---------- */
  if(hoverCapable && !reducedMotion){
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      var strength = 0.35;
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width/2);
        var my = e.clientY - (r.top + r.height/2);
        el.style.transform = 'translate(' + (mx*strength) + 'px,' + (my*strength) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

})();
