/* ================================================================
   MINUTE / دقيقة — cinematic page-transition controller.
   Expects a `#frame-transition` overlay (see css/transitions.css)
   present in the DOM of every page. Real multi-page navigation
   (location.href) — never SPA routing — so back/forward, direct
   URL entry and no-JS fallback keep working unaided.
   ================================================================ */
(function(){
  var overlay = document.getElementById('frame-transition');
  if(!overlay) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navigating = false;

  /* reveal the page: overlay is opaque by default (render-blocking
     CSS, no flash), we lift it once the page has actually painted.
     A timeout backstops the rAF chain — rAF is reliable once a tab
     is actually compositing, but must never be the only path that
     can reveal the page (fail-open, not fail-closed). */
  var revealed = false;
  function reveal(){
    if(revealed) return;
    revealed = true;
    overlay.setAttribute('data-state', 'out');
  }
  requestAnimationFrame(function(){ requestAnimationFrame(reveal); });
  setTimeout(reveal, 200);

  document.addEventListener('click', function(e){
    if(navigating) return;

    var link = e.target.closest('a[href]');
    if(!link) return;
    if(e.defaultPrevented || e.button !== 0) return;
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if(link.target && link.target !== '_self') return;
    if(link.hasAttribute('download')) return;
    if(link.dataset.noTransition !== undefined) return;

    var url;
    try{ url = new URL(link.getAttribute('href'), location.href); }
    catch(err){ return; }

    if(url.origin !== location.origin) return;
    if(!/\.html$/i.test(url.pathname)) return;
    if(url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    navigating = true;

    overlay.classList.remove('ft-play');
    void overlay.offsetWidth; /* restart the animation on repeated navigations */
    overlay.classList.add('ft-play');
    overlay.setAttribute('data-state', 'in');

    var go = (function(){
      var done = false;
      return function(){
        if(done) return;
        done = true;
        location.href = url.href;
      };
    })();
    overlay.addEventListener('transitionend', go, {once:true});
    setTimeout(go, reducedMotion ? 60 : 520); /* fallback: throttled/backgrounded tabs can drop transitionend */
  });
})();
