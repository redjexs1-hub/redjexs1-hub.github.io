/* ── Fallback task list ─────────────────────── */
var FALLBACK_TASKS = [
  { title: '1. Микроконтроллер Arduino',          difficulty: 'easy',   href: 'menu/menu1.html'  },
  { title: '2. Первая сборка Arduino',             difficulty: 'easy',   href: 'menu/menu2.html'  },
  { title: '3. Светодиод с нарастающей яркостью', difficulty: 'easy',   href: 'menu/menu3.html'  },
  { title: '4. Датчики',                           difficulty: 'easy',   href: 'menu/menu4.html'  },
  { title: '5. Удивительные элементы',             difficulty: 'medium', href: 'menu/menu5.html'  },
  { title: '6. Визуальные элементы',               difficulty: 'medium', href: 'menu/menu6.html'  },
  { title: '7. Звуковые элементы',                 difficulty: 'medium', href: 'menu/menu7.html'  },
  { title: '8. Полезные элементы',                 difficulty: 'medium', href: 'menu/menu8.html'  },
  { title: '9. Элементы вывода',                   difficulty: 'hard',   href: 'menu/menu9.html'  },
  { title: '10. Элементы ввода',                   difficulty: 'hard',   href: 'menu/menu10.html' },
];

/* ── Worker fetch ──────────────────────────── */
(function () {
  var workerSrc =
    'self.onmessage=async function(e){' +
      'var url=e.data.url;' +
      'try{' +
        'var r=await fetch(url);' +
        'if(!r.ok)throw new Error("HTTP "+r.status);' +
        'var d=await r.json();' +
        'self.postMessage({ok:true,tasks:d.tasks||d});' +
      '}catch(err){' +
        'self.postMessage({ok:false,error:err.message});' +
      '}' +
    '};';

  var blob      = new Blob([workerSrc], { type: 'application/javascript' });
  var workerUrl = URL.createObjectURL(blob);
  var worker    = new Worker(workerUrl);

  function cleanup() {
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
  }

  worker.onmessage = function (e) {
    renderCards(e.data.ok ? e.data.tasks : FALLBACK_TASKS);
    cleanup();
  };

  worker.onerror = function () {
    renderCards(FALLBACK_TASKS);
    cleanup();
  };

  worker.postMessage({ url: 'tasks.json' });
})();