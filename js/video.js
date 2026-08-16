/* ================================================================
   MINUTE / دقيقة — media loading scaffold (Phase 1)
   No real video sources exist yet. This wires the lazy-loading
   contract placeholder cards will use in Phase 2: an element with
   [data-media-observe] gets `.in-view` once it enters the viewport.
   Phase 2 attaches this to real <video> elements and reads
   data-src/data-poster here instead of eager-loading every one.
   ================================================================ */
(function(){
  var els = document.querySelectorAll('[data-media-observe]');
  if(!els.length) return;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        /* Phase 2: entry.target.querySelector('video').src = entry.target.dataset.src; */
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});

  els.forEach(function(el){ io.observe(el); });

  /* hover-to-preview scaffold for future <video> tiles: touch
     devices get a tap-to-reveal affordance instead of hover */
  var hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('[data-media-preview]').forEach(function(card){
    if(hoverCapable){
      card.addEventListener('mouseenter', function(){ card.classList.add('preview-active'); });
      card.addEventListener('mouseleave', function(){ card.classList.remove('preview-active'); });
    } else {
      card.addEventListener('click', function(e){
        if(!card.classList.contains('preview-active')){
          e.preventDefault();
          card.classList.add('preview-active');
        }
      });
    }
  });
})();
