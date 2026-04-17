const Renderer = (() => {

  function home() {
    const next = State.nextLesson();
    const { xp, streak, completedLessons } = State.get();
    const total = State.allLessons().length;
    const done = completedLessons.length;
    const pct = State.totalPct();

    const banner = next
      ? `<div class="continue-banner fade-el" onclick="App.openLesson('${next.topic.id}','${next.lesson.id}')">
          <div class="continue-label">▶ Продолжить</div>
          <div class="continue-title">${next.lesson.title}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${State.topicPct(next.topic.id)}%"></div></div>
          <div class="progress-text">${next.topic.name} · ${next.lesson.duration}</div>
         </div>`
      : `<div class="continue-banner fade-el" style="border-color:rgba(200,255,0,.3)">
          <div class="continue-label" style="color:var(--accent)">✓ Все уроки пройдены</div>
          <div class="continue-title">Ты прошёл весь курс</div>
          <div class="progress-bar"><div class="progress-fill" style="width:100%"></div></div>
          <div class="progress-text">${done} из ${total} уроков</div>
         </div>`;

    return `
      <div class="hero fade-el">
        <div class="hero-tag">— arduino learn · 2026</div>
        <h1 class="hero-title">Учись.<br><span class="accent">Собирай.</span><br>Запускай.</h1>
        <p class="hero-sub">Курс по Arduino от нуля до рабочих проектов.</p>
        <button class="btn" onclick="navigate('topics')">Смотреть уроки ↓</button>
      </div>

      <div class="stats-row">
        <div class="stat-cell fade-el">
          <div class="stat-val green">${xp}</div>
          <div class="stat-label">Опыт XP</div>
        </div>
        <div class="stat-cell fade-el">
          <div class="stat-val">${streak}</div>
          <div class="stat-label">Дней подряд</div>
        </div>
        <div class="stat-cell fade-el">
          <div class="stat-val">${pct}%</div>
          <div class="stat-label">Пройдено</div>
        </div>
      </div>

      ${banner}

      <div class="section-hd">
        <span class="label-tag">Темы курса</span>
        <span class="label-tag">${TOPICS.length} раздела</span>
      </div>

      <div class="bento">
        ${TOPICS.map((t, i) => {
          const p = State.topicPct(t.id);
          return `
            <div class="bento-card${i === TOPICS.length - 1 && TOPICS.length % 2 !== 0 ? ' full-width' : ''} fade-el"
                 onclick="App.openTopic('${t.id}')">
              ${p === 100 ? '<div class="done-dot"></div>' : `<div class="pct-badge">${p}%</div>`}
              <div class="card-num">${t.num}</div>
              <span class="ms ms-lg">${t.icon}</span>
              <h3>${t.name}</h3>
              <p>${t.lessons.length} урок${t.lessons.length > 1 ? 'а' : ''}</p>
            </div>`;
        }).join('')}
        <a class="bento-card bento-card--sandbox full-width fade-el" href="sandbox.html" target="_blank">
          <div class="card-num" style="color:var(--accent)">⚡</div>
          <svg viewBox="0 0 24 24" style="width:26px;height:26px;stroke:#555;fill:none;stroke-width:1.6;stroke-linecap:round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <h3>Конструктор схем</h3>
          <p>Собирай схемы и проверяй код с AI</p>
          <div class="sandbox-arrow">↗</div>
        </a>
      </div>`;
  }

  function topics() {
    return `
      <div class="topic-hero fade-el">
        <div class="label-tag">02 / Уроки</div>
        <h2 style="margin-top:.5rem">Все темы</h2>
      </div>
      ${TOPICS.map((t, ti) => `
        <div class="section-hd fade-el">
          <span class="label-tag">${t.num} / ${t.name}</span>
          <span class="label-tag">${State.topicPct(t.id)}%</span>
        </div>
        <div class="lesson-list">
          ${t.lessons.map((l, li) => {
            const done = State.isDone(l.id);
            const isNext = !done && t.lessons.slice(0, li).every(x => State.isDone(x.id));
            return `
              <div class="lesson-row fade-el" onclick="App.openLesson('${t.id}','${l.id}')">
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
        </div>`
      ).join('')}`;
  }

  function progress() {
    const { xp, streak, completedLessons, quizScores } = State.get();
    const total = State.allLessons().length;
    const quizPassed = Object.values(quizScores).filter(Boolean).length;
    const pct = State.totalPct();

    return `
      <div class="progress-page">
        <div class="progress-hero fade-el">
          <div class="label-tag">03 / Прогресс</div>
          <h2 style="margin-top:.5rem">${pct}% <span class="accent">пройдено</span></h2>
          <div style="margin-top:1rem">
            <div class="progress-bar" style="height:3px">
              <div class="progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="progress-text" style="margin-top:.5rem">${completedLessons.length} из ${total} уроков</div>
          </div>
        </div>

        <div class="progress-stats">
          <div class="progress-stat fade-el">
            <div class="stat-val" style="color:var(--accent)">${xp}</div>
            <div class="stat-label">Опыт (XP)</div>
          </div>
          <div class="progress-stat fade-el">
            <div class="stat-val">${streak} <span style="font-size:.9rem">🔥</span></div>
            <div class="stat-label">Серия дней</div>
          </div>
          <div class="progress-stat fade-el">
            <div class="stat-val">${completedLessons.length}</div>
            <div class="stat-label">Уроков пройдено</div>
          </div>
          <div class="progress-stat fade-el">
            <div class="stat-val">${quizPassed}</div>
            <div class="stat-label">Тестов сдано</div>
          </div>
        </div>

        <div class="section-hd fade-el">
          <span class="label-tag">По темам</span>
        </div>

        <div class="topic-progress-list">
          ${TOPICS.map(t => {
            const p = State.topicPct(t.id);
            return `
              <div class="topic-progress-row fade-el">
                <span class="ms tp-icon">${t.icon}</span>
                <div style="flex:1">
                  <div class="tp-name">${t.name}</div>
                  <div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div>
                </div>
                <span class="tp-pct ${p === 100 ? 'done' : ''}">${p}%</span>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  function lesson(topicId, lessonId) {
    const topic = TOPICS.find(t => t.id === topicId);
    const lesson = topic?.lessons.find(l => l.id === lessonId);
    if (!topic || !lesson) return '<p style="padding:2rem;color:var(--muted)">Урок не найден.</p>';

    const li = topic.lessons.indexOf(lesson);
    const prev = topic.lessons[li - 1];

    // Bottom nav: always leads to quiz if lesson has one
    const rightBtn = lesson.quiz
      ? `<button class="btn" onclick="App.openQuiz('${topicId}','${lessonId}')">
           Тест
           <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round"><polyline points="9 18 15 12 9 6"/></svg>
         </button>`
      : `<button class="btn" onclick="App.goBack()">✓ Завершить</button>`;

    return `
      <div class="lesson-top">
        <button class="back-btn" onclick="App.goBack()">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </button>
        <div class="lesson-badge">${topic.num} / ${topic.name}</div>
        <div class="lesson-main-title">${lesson.title}</div>
        <div class="lesson-chips">
          <span class="chip">${lesson.duration}</span>
          ${State.isDone(lesson.id) ? '<span class="chip done">✓ Пройден</span>' : ''}
          ${lesson.quiz ? '<span class="chip chip-quiz">Есть тест</span>' : ''}
        </div>
      </div>

      <div class="lesson-body">
        ${lesson.sections.map(renderSection).join('')}
      </div>

      <div class="lesson-nav">
        ${prev
          ? `<button class="btn btn-muted" onclick="App.openLesson('${topicId}','${prev.id}')">← Назад</button>`
          : `<button class="btn btn-muted" onclick="App.goBack()">← К урокам</button>`
        }
        ${rightBtn}
      </div>`;
  }

  function quizPage(topicId, lessonId) {
    const topic = TOPICS.find(t => t.id === topicId);
    const lesson = topic?.lessons.find(l => l.id === lessonId);
    if (!topic || !lesson || !lesson.quiz) return '<p style="padding:2rem;color:var(--muted)">Тест не найден.</p>';

    const li = topic.lessons.indexOf(lesson);
    const next = topic.lessons[li + 1];
    const q = lesson.quiz;
    const alreadyDone = State.isDone(lesson.id);

    // After-quiz nav (hidden until answered)
    const afterNav = `
      <div class="lesson-nav quiz-after-nav" id="quiz-page-nav-${lessonId}" style="display:none">
        <button class="btn btn-muted" onclick="App.openLesson('${topicId}','${lessonId}')">← К уроку</button>
        ${next
          ? `<button class="btn" onclick="App.openLesson('${topicId}','${next.id}')">Далее →</button>`
          : `<button class="btn" onclick="App.goBack()">✓ Завершить</button>`
        }
      </div>`;

    return `
      <div class="lesson-top fade-el">
        <button class="back-btn" onclick="App.openLesson('${topicId}','${lessonId}')">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          К уроку
        </button>
        <div class="lesson-badge">${topic.num} / ${topic.name}</div>
        <div class="lesson-main-title">${lesson.title}</div>
        <div class="lesson-chips">
          <span class="chip chip-quiz">Мини-тест</span>
          ${alreadyDone ? '<span class="chip done">✓ Пройден</span>' : ''}
        </div>
      </div>

      <div class="quiz-standalone fade-el">
        <div class="quiz-standalone-header">
          <div class="quiz-standalone-icon">?</div>
          <div class="quiz-standalone-label">Проверь себя</div>
        </div>

        <div class="quiz-q quiz-standalone-q">${q.question}</div>

        <div class="quiz-options" id="quiz-${lesson.id}">
          ${q.options.map((o, i) => `
            <button class="quiz-opt"
              onclick="doQuiz('${topicId}','${lesson.id}',${i},${q.correct},'${q.explanation.replace(/'/g,"\\'")}')">
              <span class="quiz-opt-letter">${String.fromCharCode(65 + i)}</span>
              ${o}
            </button>`).join('')}
        </div>

        <div class="quiz-feedback" id="qfb-${lesson.id}">
          <div class="quiz-fb-title" id="qfbt-${lesson.id}"></div>
          <div class="quiz-fb-text" id="qfbd-${lesson.id}"></div>
        </div>
      </div>

      ${afterNav}`;
  }

  function renderSection(s) {
    switch (s.type) {
      case 'text':
        return `<div class="lesson-section"><p class="lesson-text">${s.content}</p></div>`;

      case 'info':
        return `
          <div class="lesson-section">
            <div class="info-box">
              <div class="info-box-title">${s.title}</div>
              <div class="info-box-text">${s.text.replace(/\n/g, '<br>')}</div>
            </div>
          </div>`;

      case 'components':
        return `
          <div class="lesson-section">
            <div class="lesson-section-label">Компоненты</div>
            <div class="comp-list">
              ${s.items.map(i => `
                <div class="comp-item">
                  <span class="ms ms-sm comp-icon">${i.icon}</span>
                  <span class="comp-name">${i.name}</span>
                  <span class="comp-qty">${i.qty}</span>
                </div>`).join('')}
            </div>
          </div>`;

      case 'code':
        const hi = highlight(s.code);
        const esc = s.code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        return `
          <div class="lesson-section lesson-section--code">
            <div class="code-block">
              <div class="code-top">
                <span class="code-lang">Arduino C++</span>
                <button class="copy-btn" onclick="copyCode(this,\`${esc}\`)">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  копировать
                </button>
              </div>
              <div class="code-body">${hi}</div>
            </div>
          </div>`;

      case 'builder': {
        const taskEnc = encodeURIComponent(s.task);
        const titleEnc = encodeURIComponent(s.title || 'Задание');
        const compsHtml = s.components
          ? `<div class="builder-chips">${s.components.map(c => `<span class="builder-chip">${c}</span>`).join('')}</div>`
          : '';
        return `
          <div class="lesson-section builder-section">
            <div class="builder-header">
              <div class="builder-icon">⚡</div>
              <div>
                <div class="lesson-section-label">Задание в конструкторе</div>
                <div class="builder-title">${s.title}</div>
              </div>
            </div>
            <p class="builder-task">${s.task}</p>
            ${s.hint ? `<div class="builder-hint"><span class="builder-hint-icon">💡</span>${s.hint}</div>` : ''}
            ${compsHtml}
            <a class="btn builder-btn" href="sandbox.html?task=${taskEnc}&title=${titleEnc}" target="_blank">
              <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
              Открыть конструктор
            </a>
          </div>`;
      }

      default: return '';
    }
  }

  function highlight(code) {
    return code
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/(\/\/[^\n]*)/g,'<span class="cm">$1</span>')
      .replace(/\b(void|int|float|bool|char|byte|if|else|for|while|return|define|include)\b/g,'<span class="kw">$1</span>')
      .replace(/\b(setup|loop|pinMode|digitalWrite|digitalRead|analogWrite|analogRead|delay|tone|noTone|map)\b/g,'<span class="fn">$1</span>')
      .replace(/\b(\d+)\b/g,'<span class="num">$1</span>');
  }

  return { home, topics, progress, lesson, quizPage };
})();