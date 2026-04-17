document.addEventListener('DOMContentLoaded', () => {
  navigate('home');

  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }

  if (typeof vkBridge !== 'undefined') {
    vkBridge.send('VKWebAppInit')
      .then(() => {
        console.log('✅ VK Bridge инициализирован');
        return vkBridge.send('VKWebAppGetUserInfo');
      })
      .then(user => {
        console.log('👤 Пользователь:', user.first_name, user.id);
      })
      .catch(err => {
        console.error('❌ Ошибка VK Bridge:', err);
      });
  }
});

let _currentPage = 'home';
let _lessonCtx = null;

const PAGES = {
  home:     () => Renderer.home(),
  topics:   () => Renderer.topics(),
  progress: () => Renderer.progress()
};

function navigate(page) {
  _lessonCtx = null;

  const home   = document.getElementById('page-home');
  const lesson = document.getElementById('page-lesson');

  home.classList.remove('active');
  lesson.classList.remove('active');

  home.innerHTML = PAGES[page]();
  home.classList.add('active');
  home.scrollTop = 0;

  // Sync nav island active state
  const targetPage = (page === 'topics' || page === 'progress') ? page : 'home';
  document.querySelectorAll('.nav-island-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === targetPage);
  });
  if (window._navMoveIndicator) window._navMoveIndicator(targetPage);

  _currentPage = page;
  initFadeEls(home);
}

const App = {
  openTopic(topicId) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    const home = document.getElementById('page-home');
    home.classList.remove('active');
    home.innerHTML = renderTopicView(topic);
    home.classList.add('active');
    home.scrollTop = 0;
    _currentPage = 'topic_' + topicId;

    document.querySelectorAll('.nav-island-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.page === 'topics'));
    if (window._navMoveIndicator) window._navMoveIndicator('topics');

    initFadeEls(home);
  },

  openLesson(topicId, lessonId) {
    _lessonCtx = { topicId, lessonId, isQuiz: false };

    const lessonPage = document.getElementById('page-lesson');
    const homePage   = document.getElementById('page-home');

    lessonPage.innerHTML = Renderer.lesson(topicId, lessonId);
    lessonPage.scrollTop = 0;

    homePage.classList.remove('active');
    lessonPage.classList.add('active');

    document.querySelectorAll('.nav-island-btn').forEach(b => b.classList.remove('active'));
    if (window._navMoveIndicator) window._navMoveIndicator(null);

    initFadeEls(lessonPage);
  },

  openQuiz(topicId, lessonId) {
    _lessonCtx = { topicId, lessonId, isQuiz: true };

    const lessonPage = document.getElementById('page-lesson');
    lessonPage.innerHTML = Renderer.quizPage(topicId, lessonId);
    lessonPage.scrollTop = 0;

    // page-lesson is already active (coming from lesson view)
    // Make sure it's active in case called from elsewhere
    const homePage = document.getElementById('page-home');
    homePage.classList.remove('active');
    lessonPage.classList.add('active');

    document.querySelectorAll('.nav-island-btn').forEach(b => b.classList.remove('active'));
    if (window._navMoveIndicator) window._navMoveIndicator(null);

    initFadeEls(lessonPage);
  },

  goBack() {
    const lessonPage = document.getElementById('page-lesson');
    const homePage   = document.getElementById('page-home');

    lessonPage.classList.remove('active');
    homePage.classList.add('active');

    if (_lessonCtx) {
      const { topicId } = _lessonCtx;
      App.openTopic(topicId);
    } else {
      navigate('topics');
    }
    _lessonCtx = null;
  }
};

function renderTopicView(topic) {
  const pct = State.topicPct(topic.id);
  return `
    <div class="topic-hero fade-el">
      <button class="back-btn" onclick="navigate('topics')">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Все темы
      </button>
      <div class="label-tag">${topic.num} / ${topic.name}</div>
      <h2 style="margin-top:.4rem;font-size:1.6rem"><span class="ms">${topic.icon}</span> ${topic.name}</h2>
      <div style="margin-top:.75rem">
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-text" style="margin-top:.4rem">${pct}% завершено</div>
      </div>
    </div>
    <div class="lesson-list">
      ${topic.lessons.map((l, li) => {
        const done   = State.isDone(l.id);
        const isNext = !done && topic.lessons.slice(0, li).every(x => State.isDone(x.id));
        return `
          <div class="lesson-row fade-el" onclick="App.openLesson('${topic.id}','${l.id}')">
            <div class="lesson-num-box ${done ? 'done' : isNext ? 'next' : ''}">
              ${done ? '✓' : li + 1}
            </div>
            <div>
              <div class="lesson-title-text">${l.title}</div>
              <div class="lesson-meta-text">${l.duration}${done ? ' · пройден' : ''}</div>
            </div>
            <span class="lesson-arrow">›</span>
          </div>`;
      }).join('')}
    </div>`;
}

function initFadeEls(container) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });

  container.querySelectorAll('.fade-el').forEach(el => {
    el.classList.remove('visible');
    obs.observe(el);
  });
}

function doQuiz(topicId, lessonId, chosen, correct, explanation) {
  const container = document.getElementById(`quiz-${lessonId}`);
  if (!container) return;

  container.querySelectorAll('.quiz-opt').forEach(b => { b.onclick = null; });

  const isCorrect = chosen === correct;
  const opts = container.querySelectorAll('.quiz-opt');
  opts[chosen].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) opts[correct].classList.add('reveal');

  const fb  = document.getElementById(`qfb-${lessonId}`);
  const fbt = document.getElementById(`qfbt-${lessonId}`);
  const fbd = document.getElementById(`qfbd-${lessonId}`);

  fb.classList.add('show');
  if (!isCorrect) fb.classList.add('wrong-fb');
  fbt.textContent = isCorrect ? '✓ Верно' : '✗ Неверно';
  fbd.textContent = explanation;

  State.setQuiz(lessonId, isCorrect);
  State.markDone(lessonId, isCorrect);

  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Reveal after-quiz navigation (only present on quiz page)
  const quizNav = document.getElementById(`quiz-page-nav-${lessonId}`);
  if (quizNav) {
    setTimeout(() => {
      quizNav.style.display = 'flex';
      quizNav.style.animation = 'quizNavReveal .35s cubic-bezier(.4,0,.2,1) both';
      quizNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);
  }
}

function copyCode(btn, code) {
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✓ скопировано';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012 2v1"/></svg> копировать`;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {});
}

window.navigate = navigate;
window.App = App;
window.doQuiz = doQuiz;
window.copyCode = copyCode;

document.addEventListener('DOMContentLoaded', () => {
  navigate('home');

  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
});