const State = (() => {
  const KEY = 'ard_state_v2';

  const defaults = {
    completedLessons: [],
    quizScores: {},
    xp: 0,
    streak: 0,
    lastActiveDate: null
  };

  let d = (() => {
    try {
      const s = localStorage.getItem(KEY);
      return s ? { ...defaults, ...JSON.parse(s) } : { ...defaults };
    } catch { return { ...defaults }; }
  })();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
  }

  function markDone(lessonId, quizPassed) {
    if (!d.completedLessons.includes(lessonId)) {
      d.completedLessons.push(lessonId);
      d.xp += quizPassed ? 30 : 15;
    }
    const today = new Date().toDateString();
    if (d.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      d.streak = d.lastActiveDate === yesterday ? d.streak + 1 : 1;
      d.lastActiveDate = today;
    }
    save();
  }

  function setQuiz(lessonId, correct) {
    d.quizScores[lessonId] = correct;
    save();
  }

  function isDone(id) { return d.completedLessons.includes(id); }

  function topicPct(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) return 0;
    return Math.round(t.lessons.filter(l => isDone(l.id)).length / t.lessons.length * 100);
  }

  function totalPct() {
    const total = TOPICS.reduce((s, t) => s + t.lessons.length, 0);
    return total ? Math.round(d.completedLessons.length / total * 100) : 0;
  }

  function nextLesson() {
    for (const t of TOPICS)
      for (const l of t.lessons)
        if (!isDone(l.id)) return { topic: t, lesson: l };
    return null;
  }

  function allLessons() {
    return TOPICS.flatMap(t => t.lessons.map(l => ({ ...l, topic: t })));
  }

  return { get: () => d, markDone, setQuiz, isDone, topicPct, totalPct, nextLesson, allLessons };
})();