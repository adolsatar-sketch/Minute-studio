/* ================================================================
   MINUTE / دقيقة — homepage opening ident
   Fails open by design: `.ident` is hidden by default in CSS, and
   only appears if this script explicitly opts in. If JS never
   runs or errors, the hero is simply visible immediately — never a
   stuck black screen (unlike the old site's fail-closed preloader).
   Plays once per browser session; skipped entirely (not just
   shortened) for prefers-reduced-motion, checked before any state
   is written.
   ================================================================ */
(function(){
  var ident = document.getElementById('ident');
  if(!ident) return;

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var seenKey = 'minute_ident_seen';
  if(sessionStorage.getItem(seenKey)) return;

  try{ sessionStorage.setItem(seenKey, '1'); } catch(err){ /* private mode: still fine to play once */ }

  ident.classList.add('ident-active');

  var finished = false;
  function finish(){
    if(finished) return;
    finished = true;
    ident.classList.add('ident-out');
    ident.addEventListener('transitionend', function(){ ident.remove(); }, {once:true});
    setTimeout(function(){ ident.remove(); }, 900);
  }

  var autoTimer = setTimeout(finish, 3100);

  function skip(){ clearTimeout(autoTimer); finish(); }
  ident.addEventListener('click', skip);
  ident.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') skip();
  });
})();
