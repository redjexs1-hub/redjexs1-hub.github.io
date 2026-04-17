/* ── Navigation Island indicator ──────────── */
(function () {
  const navIcons  = document.querySelector('.nav-icons');
  const items     = document.querySelectorAll('.nav-island-btn');
  const indicator = document.querySelector('.nav-indicator');
  const GAP = 5;

  let currentIndex = 0;

  // Original algorithm — stable, matches click behaviour exactly
  function moveIndicator(index, animate) {
    const el          = items[index];
    const containerW  = navIcons.getBoundingClientRect().width;
    const elCenter    = el.offsetLeft + el.offsetWidth / 2;
    const firstCenter = items[0].offsetLeft + items[0].offsetWidth / 2;
    const sidePadding = firstCenter - GAP;
    const fixedWidth  = sidePadding * 2;
    let   left        = elCenter - fixedWidth / 2;

    left = Math.min(Math.max(left, GAP), containerW - fixedWidth - GAP);

    if (!animate) {
      indicator.classList.add('no-transition');
      indicator.style.left  = left + 'px';
      indicator.style.width = fixedWidth + 'px';
      indicator.getBoundingClientRect(); // force reflow
      indicator.classList.remove('no-transition');
    } else {
      indicator.classList.add('flying');
      indicator.style.left  = left + 'px';
      indicator.style.width = fixedWidth + 'px';
    }

    currentIndex = index;
  }

  function getIndexByPage(page) {
    const btn = document.querySelector('.nav-island-btn[data-page="' + page + '"]');
    return btn ? Array.from(items).indexOf(btn) : 0;
  }

  indicator.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'left') indicator.classList.remove('flying');
  });

  items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      if (currentIndex === index) return;
      items.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      moveIndicator(index, true);
      navigate(item.dataset.page);
    });
  });

  window._navMoveIndicator = function (page) {
    if (!page) return;
    moveIndicator(getIndexByPage(page), true);
  };

  window.addEventListener('resize', function () {
    moveIndicator(currentIndex, false);
  });

  // fonts.ready guarantees fonts + layout are fully settled —
  // so offsetLeft/offsetWidth match exactly what happens on click
  document.fonts.ready.then(function () {
    moveIndicator(0, false);
  });
})();