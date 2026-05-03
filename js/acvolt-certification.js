// ============================================
// ACVOLT Certification Program
// Courses + Video Lessons + Quizzes from acvolt.school
// Access: $100/month WhatsApp membership students
// ============================================

var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

var _acvoltData = { courses: [], sections: [], lessons: [], questions: [], answers: [] };
var _acvoltLoaded = false;
var _acvoltCurrentCourse = null;
var _acvoltCurrentLesson = null;

// ---- Supabase helpers ----
function _acvoltQuery(table, params) {
  var url = SUPABASE_URL + '/rest/v1/' + table + '?' + params;
  return fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  }).then(function(r) { return r.json(); });
}

// ---- Load all data ----
async function _acvoltLoadData() {
  if (_acvoltLoaded) return;
  var results = await Promise.all([
    _acvoltQuery('acvolt_courses', 'select=*&order=sort_order,old_id'),
    _acvoltQuery('acvolt_sections', 'select=*&order=course_id,sort_order,old_id'),
    _acvoltQuery('acvolt_lessons', 'select=*&order=section_id,sort_order,old_id'),
  ]);
  _acvoltData.courses = results[0] || [];
  _acvoltData.sections = results[1] || [];
  _acvoltData.lessons = results[2] || [];
  _acvoltLoaded = true;
}

// ---- Load questions for a specific lesson ----
async function _acvoltLoadQuiz(lessonId) {
  var questions = await _acvoltQuery('acvolt_questions', 'select=*&lesson_id=eq.' + lessonId + '&status=eq.1&order=old_id');
  _acvoltData.questions = questions || [];
  if (_acvoltData.questions.length === 0) return [];
  // Load only answers for these specific questions
  var qIds = _acvoltData.questions.map(function(q) { return q.id; });
  var answers = await _acvoltQuery('acvolt_answers', 'select=id,question_id,answer_text,display_order&question_id=in.(' + qIds.join(',') + ')&order=old_id');
  _acvoltData.answers = answers || [];
  return _acvoltData.questions;
}

// ---- Escape HTML ----
function _acvEsc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Sanitize HTML — strip script tags, event handlers, and dangerous elements
function _acvSanitizeHtml(html) {
  if (!html) return '';
  // Remove script/iframe/object/embed tags entirely
  var clean = html.replace(/<\s*(script|iframe|object|embed|form|input|textarea|select|button|link|meta|base|applet)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
  clean = clean.replace(/<\s*(script|iframe|object|embed|form|input|textarea|select|button|link|meta|base|applet)[^>]*\/?>/gi, '');
  // Remove all on* event handlers from remaining tags
  clean = clean.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: and data: URLs in href/src/action attributes
  clean = clean.replace(/(href|src|action)\s*=\s*["']\s*(javascript|data|vbscript)\s*:/gi, '$1="');
  // Remove style expressions (IE)
  clean = clean.replace(/expression\s*\(/gi, 'blocked(');
  return clean;
}

// ---- Progress helpers ----
function _acvGetProgress() {
  try { return JSON.parse(localStorage.getItem('acvolt_cert_progress') || '{}'); } catch(e) { return {}; }
}
function _acvSaveProgress(lessonId) {
  var p = _acvGetProgress();
  p[lessonId] = { completed: true, date: new Date().toISOString() };
  localStorage.setItem('acvolt_cert_progress', JSON.stringify(p));
}
function _acvGetQuizResults() {
  try { return JSON.parse(localStorage.getItem('acvolt_cert_quizzes') || '{}'); } catch(e) { return {}; }
}
function _acvSaveQuizResult(lessonId, passed, score) {
  var r = _acvGetQuizResults();
  r[lessonId] = { passed: passed, score: score, date: new Date().toISOString() };
  localStorage.setItem('acvolt_cert_quizzes', JSON.stringify(r));
}

// ============================================
// SCREEN: Course List (acvoltCertScreen)
// ============================================
function _acvoltRenderCourseList() {
  var el = document.getElementById('acvoltCertScreen');
  if (!el) return;

  var activeCourses = _acvoltData.courses.filter(function(c) { return c.status === 1; });
  var progress = _acvGetProgress();

  var html = '<div class="acvolt-wrap">';
  // Header
  html += '<div style="text-align:center;margin-bottom:24px;position:relative;padding-top:8px;">';
  html += '<button onclick="showScreen(\'dashboardScreen\')" aria-label="Regresar" style="position:absolute;top:4px;left:0;width:40px;height:40px;border-radius:12px;background:#E8591C;border:none;color:#fff;cursor:pointer;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(232,89,28,0.35);-webkit-tap-highlight-color:transparent;z-index:2;">\u2039</button>';
  html += '<div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#fff;margin-bottom:12px;margin-top:28px;overflow:hidden;">';
  html += '<img src="maestro-hvacr-logo.png" alt="Maestro HVACR" style="width:100%;height:100%;object-fit:contain;"></div>';
  html += '<h2 style="color:#0F0F0F;font-size:22px;font-weight:800;margin:0;">Videos Maestro HVACR</h2>';
  html += '<p style="color:#6B6B66;font-size:13px;margin-top:4px;font-weight:500;">' + activeCourses.length + ' ' + _tc('acv_courses_available', 'cursos disponibles') + '</p>';
  html += '</div>';

  // Course cards
  activeCourses.forEach(function(course) {
    var courseLessons = _acvoltData.lessons.filter(function(l) { return l.course_id === course.id && l.status === 1; });
    var videoCount = courseLessons.filter(function(l) { return l.lesson_type === 0; }).length;
    var quizCount = courseLessons.filter(function(l) { return l.lesson_type === 2; }).length;
    var completedCount = courseLessons.filter(function(l) { return progress[l.id] && progress[l.id].completed; }).length;
    var pct = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

    // Duration
    var totalMin = 0;
    courseLessons.forEach(function(l) { totalMin += (l.duration_hours || 0) * 60 + (l.duration_minutes || 0); });
    var durStr = totalMin > 0 ? (totalMin >= 60 ? Math.floor(totalMin/60) + 'h ' + (totalMin%60) + 'min' : totalMin + ' min') : '';

    html += '<div onclick="_acvoltOpenCourse(' + course.id + ')" style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:14px;padding:16px;margin-bottom:12px;cursor:pointer;transition:transform 0.1s;-webkit-tap-highlight-color:transparent;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);" ontouchstart="this.style.transform=\'scale(0.98)\'" ontouchend="this.style.transform=\'\'">';
    // Title row
    html += '<div style="display:flex;align-items:center;gap:12px;">';
    html += '<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(232,89,28,0.14),rgba(232,89,28,0.06));display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(232,89,28,0.25);">';
    html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8591C" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="color:#0F0F0F;font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _acvEsc(course.title) + '</div>';
    html += '<div style="color:#6B6B66;font-size:12px;margin-top:2px;font-weight:500;">';
    if (videoCount > 0) html += videoCount + ' videos';
    if (videoCount > 0 && quizCount > 0) html += ' · ';
    if (quizCount > 0) html += quizCount + ' quizzes';
    if (durStr) html += ' · ' + durStr;
    html += '</div></div>';
    // Progress circle
    if (pct > 0) {
      html += '<div style="width:40px;height:40px;position:relative;flex-shrink:0;">';
      html += '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="#E7E5DE" stroke-width="3"/>';
      html += '<circle cx="20" cy="20" r="17" fill="none" stroke="' + (pct === 100 ? '#059669' : '#E8591C') + '" stroke-width="3" stroke-dasharray="' + (pct * 1.07) + ' 107" transform="rotate(-90 20 20)"/></svg>';
      html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:' + (pct === 100 ? '#059669' : '#E8591C') + ';font-size:12px;font-weight:700;">' + pct + '%</div>';
      html += '</div>';
    } else {
      html += '<div style="color:#C9C7C0;font-size:18px;">\u203A</div>';
    }
    html += '</div>'; // end title row

    // Progress bar
    if (pct > 0) {
      html += '<div style="margin-top:10px;height:3px;background:#E7E5DE;border-radius:2px;overflow:hidden;">';
      html += '<div style="height:100%;width:' + pct + '%;background:' + (pct === 100 ? '#059669' : '#E8591C') + ';border-radius:2px;transition:width 0.3s;"></div></div>';
    }
    html += '</div>'; // end card
  });

  // Upgrade banner removed — clon $59.99 unlocks all courses.

  html += '</div>';
  el.innerHTML = html;
}

// ============================================
// SCREEN: Course Detail (acvoltCourseScreen)
// ============================================
function _acvoltOpenCourse(courseId) {
  _acvoltCurrentCourse = _acvoltData.courses.find(function(c) { return c.id === courseId; });
  if (!_acvoltCurrentCourse) return;

  if (typeof showScreen === 'function') showScreen('acvoltCourseScreen');
}

function _acvoltRenderCourseDetail() {
  var el = document.getElementById('acvoltCourseScreen');
  if (!el || !_acvoltCurrentCourse) return;

  var course = _acvoltCurrentCourse;
  var sections = _acvoltData.sections.filter(function(s) { return s.course_id === course.id; });
  var lessons = _acvoltData.lessons.filter(function(l) { return l.course_id === course.id && l.status === 1; });
  var progress = _acvGetProgress();
  var quizResults = _acvGetQuizResults();

  var html = '<div class="acvolt-wrap">';
  // Back + title
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
  html += '<button onclick="_acvoltBackToCourses()" aria-label="Regresar" style="width:40px;height:40px;border-radius:12px;background:#E8591C;border:none;color:#fff;cursor:pointer;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(232,89,28,0.35);-webkit-tap-highlight-color:transparent;flex-shrink:0;">\u2039</button>';
  html += '<span style="color:#6B6B66;font-size:13px;font-weight:600;">' + _tc('acv_back_courses_label', 'Cursos') + '</span>';
  html += '</div>';
  html += '<h2 style="color:#0F0F0F;font-size:20px;font-weight:800;margin:0 0 4px;">' + _acvEsc(course.title) + '</h2>';

  var totalLessons = lessons.length;
  var completedLessons = lessons.filter(function(l) { return progress[l.id] && progress[l.id].completed; }).length;
  html += '<p style="color:#6B6B66;font-size:13px;margin:0 0 20px;font-weight:500;">' + completedLessons + ' / ' + totalLessons + ' ' + _tc('acv_completed', 'completadas') + '</p>';

  // Sections with lessons
  sections.forEach(function(section) {
    var sectionLessons = lessons.filter(function(l) { return l.section_id === section.id; });
    if (sectionLessons.length === 0) return;

    html += '<div style="margin-bottom:20px;">';
    html += '<div style="color:#E8591C;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;padding-left:4px;">' + _acvEsc(section.title) + '</div>';

    sectionLessons.forEach(function(lesson, idx) {
      var isCompleted = progress[lesson.id] && progress[lesson.id].completed;
      var quizPassed = quizResults[lesson.id] && quizResults[lesson.id].passed;
      var icon, typeLabel, iconColor;

      if (lesson.lesson_type === 0) {
        icon = '<polygon points="10 8 16 12 10 16 10 8"/>';
        typeLabel = lesson.duration_minutes > 0 ? lesson.duration_minutes + ' min' : 'Video';
        iconColor = '#3b82f6';
      } else if (lesson.lesson_type === 2) {
        icon = '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>';
        typeLabel = lesson.quiz_question_count > 0 ? lesson.quiz_question_count + ' ' + _tc('acv_questions', 'preguntas') : 'Quiz';
        iconColor = '#a855f7';
      } else {
        icon = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>';
        typeLabel = _tc('acv_reading', 'Lectura');
        iconColor = '#10b981';
      }

      var statusIcon = '';
      if (isCompleted || quizPassed) {
        statusIcon = '<div style="width:24px;height:24px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>';
      }

      html += '<div onclick="_acvoltOpenLesson(' + lesson.id + ')" style="display:flex;align-items:center;gap:12px;padding:12px;background:#FFFFFF;border:1px solid ' + (isCompleted || quizPassed ? 'rgba(5,150,105,0.35)' : '#E7E5DE') + ';border-radius:10px;margin-bottom:6px;cursor:pointer;transition:background 0.15s;-webkit-tap-highlight-color:transparent;min-height:48px;box-shadow:0 1px 2px rgba(17,17,17,0.03);">';
      // Icon
      html += '<div style="width:28px;height:28px;border-radius:8px;background:' + iconColor + '22;display:flex;align-items:center;justify-content:center;flex-shrink:0;">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2">' + icon + '</svg></div>';
      // Text
      html += '<div style="flex:1;min-width:0;">';
      html += '<div style="color:#0F0F0F;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _acvEsc(lesson.title) + '</div>';
      html += '<div style="color:#6B6B66;font-size:12px;font-weight:500;">' + typeLabel + '</div>';
      html += '</div>';
      html += statusIcon;
      html += '</div>';
    });
    html += '</div>';
  });

  // Also show lessons without sections
  var orphanLessons = lessons.filter(function(l) { return !l.section_id; });
  if (orphanLessons.length > 0) {
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="color:#E8591C;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">' + _tc('acv_lessons', 'Lecciones') + '</div>';
    orphanLessons.forEach(function(lesson) {
      var isCompleted = progress[lesson.id] && progress[lesson.id].completed;
      html += '<div onclick="_acvoltOpenLesson(' + lesson.id + ')" style="display:flex;align-items:center;gap:12px;padding:12px;background:#FFFFFF;border:1px solid #E7E5DE;border-radius:10px;margin-bottom:6px;cursor:pointer;min-height:48px;box-shadow:0 1px 2px rgba(17,17,17,0.03);">';
      html += '<div style="color:#0F0F0F;font-size:14px;flex:1;font-weight:600;">' + _acvEsc(lesson.title) + '</div>';
      if (isCompleted) html += '<span style="color:#059669;font-weight:800;">\u2713</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  el.innerHTML = html;
}

function _acvoltBackToCourses() {
  if (typeof showScreen === 'function') showScreen('acvoltCertScreen');
}

// ============================================
// SCREEN: Lesson Player / Quiz (acvoltLessonScreen)
// ============================================
function _acvoltOpenLesson(lessonId) {
  _acvoltCurrentLesson = _acvoltData.lessons.find(function(l) { return l.id === lessonId; });
  if (!_acvoltCurrentLesson) return;

  if (typeof showScreen === 'function') showScreen('acvoltLessonScreen');
}

async function _acvoltRenderLesson() {
  var el = document.getElementById('acvoltLessonScreen');
  if (!el || !_acvoltCurrentLesson) return;

  var lesson = _acvoltCurrentLesson;
  var html = '<div class="acvolt-wrap" style="padding-top:0;">';

  // Back
  html += '<div style="padding:16px 16px 0;">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
  html += '<button onclick="_acvoltBackToCourse()" aria-label="Regresar" style="width:40px;height:40px;border-radius:12px;background:#E8591C;border:none;color:#fff;cursor:pointer;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(232,89,28,0.35);-webkit-tap-highlight-color:transparent;flex-shrink:0;">\u2039</button>';
  html += '<span style="color:#6B6B66;font-size:13px;font-weight:600;">' + _tc('acv_back_to_course_label', 'Volver al curso') + '</span>';
  html += '</div>';
  html += '<h3 style="color:#0F0F0F;font-size:18px;font-weight:700;margin:0;">' + _acvEsc(lesson.title) + '</h3>';
  html += '</div>';

  // VIDEO lesson — render if stream_uid OR video_filename exists
  if (lesson.lesson_type === 0 && (lesson.stream_uid || lesson.video_filename)) {
    if (lesson.stream_uid) {
      // Cloudflare Stream player — 16:9 responsive
      html += '<div style="position:relative;padding-top:56.25%;background:#000;margin-top:12px;">';
      html += '<iframe src="https://iframe.videodelivery.net/' + _acvEsc(lesson.stream_uid) + '" ';
      html += 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>';
      html += '</div>';
    } else {
      // Video not yet uploaded to Stream
      html += '<div style="background:#FFFFFF;border:1px solid #E7E5DE;padding:40px 20px;text-align:center;border-radius:12px;margin:12px 16px 0;box-shadow:0 1px 2px rgba(17,17,17,0.03);">';
      html += '<div style="color:#E8591C;font-size:32px;margin-bottom:8px;">\uD83C\uDFAC</div>';
      html += '<div style="color:#0F0F0F;font-size:14px;font-weight:600;">' + _tc('acv_video_migrating', 'Video en proceso de migración') + '</div>';
      html += '<div style="color:#6B6B66;font-size:12px;margin-top:4px;word-break:break-all;font-weight:500;">' + _acvEsc(lesson.video_filename) + '</div>';
      html += '</div>';
    }

    // Duration info
    if (lesson.duration_minutes > 0 || lesson.duration_hours > 0) {
      var dur = '';
      if (lesson.duration_hours > 0) dur += lesson.duration_hours + 'h ';
      if (lesson.duration_minutes > 0) dur += lesson.duration_minutes + 'min';
      html += '<div style="padding:12px 16px;color:#6B6B66;font-size:12px;font-weight:500;">' + _tc('acv_duration', 'Duración') + ': ' + dur + '</div>';
    }

    // Mark complete button
    html += '<div style="padding:0 16px;margin-top:12px;">';
    html += '<button onclick="_acvoltMarkComplete(' + lesson.id + ',this)" style="width:100%;padding:14px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;min-height:48px;-webkit-tap-highlight-color:transparent;">' + _tc('acv_mark_complete', 'Marcar como completada') + ' ✓</button>';
    html += '</div>';
  }

  // QUIZ lesson
  if (lesson.lesson_type === 2) {
    html += '<div id="acvoltQuizContainer" style="padding:0 16px;">';
    html += '<div style="color:#6B6B66;text-align:center;padding:20px;font-weight:500;">' + _tc('acv_loading_quiz', 'Cargando quiz...') + '</div>';
    html += '</div>';

    // Load quiz questions
    el.innerHTML = html + '</div>';
    await _acvoltLoadAndRenderQuiz(lesson);
    return;
  }

  // TEXT lesson
  if (lesson.lesson_type === 1) {
    var textContent = lesson.html_content || lesson.description || '';
    html += '<div style="padding:16px;color:#0F0F0F;font-size:14px;line-height:1.7;">';
    if (textContent) {
      // Sanitize HTML content — allow safe tags only, strip scripts/events
      html += _acvSanitizeHtml(textContent);
    } else {
      html += '<p style="color:#6B6B66;">' + _tc('acv_text_unavailable', 'Contenido de texto no disponible.') + '</p>';
    }
    html += '</div>';
    html += '<div style="padding:0 16px;">';
    html += '<button onclick="_acvoltMarkComplete(' + lesson.id + ',this)" style="width:100%;padding:14px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;min-height:48px;-webkit-tap-highlight-color:transparent;">' + _tc('acv_mark_complete', 'Marcar como completada') + ' ✓</button>';
    html += '</div>';
  }

  // Description (only for non-text lessons)
  if (lesson.lesson_type !== 1 && lesson.description) {
    html += '<div style="padding:16px;color:#3D3D3A;font-size:13px;line-height:1.6;border-top:1px solid #E7E5DE;margin-top:16px;">' + _acvEsc(lesson.description) + '</div>';
  }

  // AI-generated quiz for VIDEO lessons
  if (lesson.lesson_type === 0) {
    html += '<div id="acvoltAiQuizSection" style="padding:0 16px 20px;">';
    html += '<div style="border-top:1px solid #E7E5DE;margin-top:8px;padding-top:20px;">';
    html += '<button id="acvoltAiQuizBtn" onclick="_acvoltStartAiQuiz(' + lesson.id + ')" style="width:100%;padding:14px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;min-height:48px;-webkit-tap-highlight-color:transparent;">🧠 Quiz de Comprensión (5 preguntas)</button>';
    html += '</div>';
    html += '<div id="acvoltAiQuizArea"></div>';
    html += '</div>';
  }

  html += '</div>';
  el.innerHTML = html;

  // If AI quiz was previously cached, show "retake" option
  if (lesson.lesson_type === 0) {
    var cached = _acvGetCachedAiQuiz(lesson.id);
    if (cached) {
      var btn = document.getElementById('acvoltAiQuizBtn');
      if (btn) btn.textContent = '🧠 Tomar Quiz de Comprensión otra vez';
    }
  }
}

function _acvoltBackToCourse() {
  if (_acvoltCurrentCourse && typeof showScreen === 'function') {
    showScreen('acvoltCourseScreen');
  }
}

function _acvoltMarkComplete(lessonId, btn) {
  _acvSaveProgress(lessonId);
  // Visual feedback
  if (btn) {
    btn.textContent = '✓ ' + _tc('acv_completed_label', 'Completada');
    btn.style.background = '#065f46';
    btn.disabled = true;
  }
}

// ============================================
// QUIZ RENDERER
// ============================================
async function _acvoltLoadAndRenderQuiz(lesson) {
  _acvoltSelectedAnswers = {};
  var questions = await _acvoltLoadQuiz(lesson.id);
  var container = document.getElementById('acvoltQuizContainer');
  if (!container) return;

  if (questions.length === 0) {
    container.innerHTML = '<div style="color:#6B6B66;text-align:center;padding:20px;font-weight:500;">' + _tc('acv_no_questions', 'No hay preguntas disponibles para este quiz.') + '</div>';
    return;
  }

  var html = '';
  html += '<div style="color:#E8591C;font-size:13px;font-weight:700;margin-bottom:16px;letter-spacing:0.5px;">' + questions.length + ' PREGUNTAS</div>';

  questions.forEach(function(q, qIdx) {
    var qAnswers = (Array.isArray(_acvoltData.answers) ? _acvoltData.answers : []).filter(function(a) { return a.question_id === q.id; });

    html += '<div class="acvolt-q-card" id="acvoltQ' + q.id + '" style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
    html += '<div style="color:#0F0F0F;font-size:14px;font-weight:600;margin-bottom:12px;">' + (qIdx + 1) + '. ' + _acvEsc(q.question) + '</div>';

    qAnswers.forEach(function(a) {
      html += '<button onclick="_acvoltSelectAnswer(this,' + q.id + ',' + a.id + ')" ';
      html += 'style="display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;background:#FAFAF7;border:1.5px solid #E7E5DE;border-radius:8px;color:#0F0F0F;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s;min-height:44px;-webkit-tap-highlight-color:transparent;line-height:1.4;">';
      html += _acvEsc(a.answer_text);
      html += '</button>';
    });
    html += '</div>';
  });

  // Submit
  html += '<div id="acvoltQuizResult" style="display:none;"></div>';
  html += '<button id="acvoltSubmitQuiz" onclick="_acvoltSubmitQuiz(' + lesson.id + ',' + questions.length + ')" style="width:100%;padding:14px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;margin-top:12px;min-height:48px;-webkit-tap-highlight-color:transparent;">' + _tc('acv_submit_answers', 'Enviar Respuestas') + '</button>';

  container.innerHTML = html;
}

var _acvoltSelectedAnswers = {};
function _acvoltSelectAnswer(btn, qId, aId) {
  if (_acvoltSelectedAnswers[qId]) return; // already answered

  // Disable all answer buttons for this question while verifying
  var card = document.getElementById('acvoltQ' + qId);
  if (!card) return;
  var allBtns = card.querySelectorAll('button');
  allBtns.forEach(function(b) { b.style.pointerEvents = 'none'; b.style.opacity = '0.6'; });

  // Highlight the selected answer
  btn.style.borderColor = '#a855f7';
  btn.style.background = '#a855f722';
  btn.style.color = '#e9d5ff';
  btn.style.opacity = '1';

  var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';

  fetch(sbUrl + '/functions/v1/verify-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sbKey },
    body: JSON.stringify({ system: 'acvolt', questionId: qId, answerId: aId })
  }).then(function(r) { return r.json(); }).then(function(res) {
    var isCorrect = !!res.isCorrect;
    _acvoltSelectedAnswers[qId] = { answerId: aId, correct: isCorrect };

    // Apply visual feedback — keep buttons disabled, show correct/incorrect
    if (isCorrect) {
      btn.style.borderColor = '#10b981';
      btn.style.background = '#10b98122';
      btn.style.color = '#6ee7b7';
    } else {
      btn.style.borderColor = '#ef4444';
      btn.style.background = '#ef444422';
      btn.style.color = '#fca5a5';
    }
    btn.style.opacity = '1';
  }).catch(function(err) {
    console.warn('[ACVOLT] Server verify failed:', err);
    // Re-enable buttons on error so student can retry
    allBtns.forEach(function(b) { b.style.pointerEvents = ''; b.style.opacity = ''; });
    // Reset selected button styling
    btn.style.borderColor = '#E7E5DE';
    btn.style.background = '#FAFAF7';
    btn.style.color = '#0F0F0F';
  });
}

function _acvoltSubmitQuiz(lessonId, totalQuestions) {
  var correctCount = 0;
  Object.keys(_acvoltSelectedAnswers).forEach(function(qId) {
    var sel = _acvoltSelectedAnswers[qId];
    var card = document.getElementById('acvoltQ' + qId);
    if (!card) return;

    // Show correct/incorrect
    card.querySelectorAll('button').forEach(function(b) {
      b.disabled = true;
      b.style.cursor = 'default';
    });

    if (sel.correct) {
      correctCount++;
    }
  });

  var passed = correctCount >= Math.ceil(totalQuestions * 0.8);
  var pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  _acvSaveQuizResult(lessonId, passed, pct);
  if (passed) _acvSaveProgress(lessonId);

  var resultEl = document.getElementById('acvoltQuizResult');
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = '<div style="text-align:center;padding:20px;background:' + (passed ? '#052e1622' : '#450a0a22') + ';border:1px solid ' + (passed ? '#10b981' : '#ef4444') + '33;border-radius:12px;margin-top:16px;">' +
      '<div style="font-size:32px;margin-bottom:8px;">' + (passed ? '🎉' : '😔') + '</div>' +
      '<div style="color:' + (passed ? '#10b981' : '#ef4444') + ';font-size:18px;font-weight:800;">' + correctCount + ' / ' + totalQuestions + ' (' + pct + '%)</div>' +
      '<div style="color:#6B6B66;font-size:13px;margin-top:4px;font-weight:500;">' + (passed ? _tc('acv_quiz_passed', 'Aprobado — Necesitas 80% para pasar') : _tc('acv_quiz_failed', 'No aprobado — Necesitas 80% para pasar')) + '</div>' +
      '</div>';
  }

  var submitBtn = document.getElementById('acvoltSubmitQuiz');
  if (submitBtn) submitBtn.style.display = 'none';

  _acvoltSelectedAnswers = {};
}

// ============================================
// WELCOME SCREEN — shown once before accessing Acvolt.school courses
// ============================================
function _acvHasSeenWelcome() {
  try { return localStorage.getItem('acvolt_welcome_seen') === '1'; } catch(e) { return false; }
}
function _acvMarkWelcomeSeen() {
  try { localStorage.setItem('acvolt_welcome_seen', '1'); } catch(e) { console.warn('[AcvoltCertification]', e.message || e); }
}

function _acvRenderWelcome(el, onContinue) {
  var nombre = 'Técnico';
  try {
    var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
    if (t.nombre && t.nombre !== t.email && !t.nombre.includes('@')) {
      nombre = t.nombre.split(' ')[0];
    }
  } catch(e) { console.warn('[AcvoltCertification]', e.message || e); }

  // Try to fetch real name from Supabase in background
  function _acvUpdateName() {
    try {
      var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      var email = (t.email || '').toLowerCase().trim();
      if (email && typeof supabaseClient !== 'undefined' && supabaseClient) {
        usersDataSelf('public_user_lookup', { emails: [email] }).then(function(res) {
          if (res.data && res.data[0] && res.data[0].nombre) {
            var realName = res.data[0].nombre.split(' ')[0];
            var titleEl = document.querySelector('.acv-welcome-title');
            if (titleEl) titleEl.textContent = (typeof _t === 'function' ? _t('acvolt_welcome_name') : '¡Bienvenido') + ', ' + realName + '!';
          }
        });
      }
    } catch(e) { console.warn('[AcvoltCertification]', e.message || e); }
  }

  el.innerHTML =
    '<div class="acv-welcome-overlay">' +
      '<div class="acv-welcome-card">' +
        '<div class="acv-welcome-header">' +
          '<img src="maestro-hvacr-logo.png" alt="Maestro HVACR" class="acv-welcome-logo" onerror="this.style.display=\'none\'">' +
          '<h1 class="acv-welcome-title">' + _tc('acv_welcome', '¡Bienvenido') + ', ' + _acvEsc(nombre) + '!</h1>' +
          '<p class="acv-welcome-subtitle">' + _tc('acv_welcome_subtitle', 'Maestro HVACR — Certificación Profesional') + '</p>' +
        '</div>' +
        '<div class="acv-welcome-video-wrap">' +
          '<iframe src="https://iframe.videodelivery.net/f94f72bea33b09dbd092967d7f1ed10a" style="border:none;width:100%;aspect-ratio:16/9;border-radius:12px;" allow="autoplay;fullscreen;encrypted-media" allowfullscreen></iframe>' +
        '</div>' +
        '<div class="acv-welcome-message">' +
          '<p style="font-size:16px;font-weight:600;color:#e6edf3;margin-bottom:16px;">' + _tc('acv_why_certs', '¿Por qué necesitas estas certificaciones?') + '</p>' +

          '<div class="acv-welcome-cert-item">' +
            '<div class="acv-welcome-cert-icon">🦺</div>' +
            '<div class="acv-welcome-cert-text">' +
              '<strong style="color:#f87171;">OSHA 10 / OSHA 30</strong><br>' +
              _tc('acv_osha_desc', 'Sin OSHA no puedes pisar un sitio de trabajo comercial. Los empleadores lo exigen — es tu licencia para trabajar seguro.') +
            '</div>' +
          '</div>' +

          '<div class="acv-welcome-cert-item">' +
            '<div class="acv-welcome-cert-icon">📋</div>' +
            '<div class="acv-welcome-cert-text">' +
              '<strong style="color:#34d399;">EPA Sección 608</strong><br>' +
              _tc('acv_epa_desc', 'La ley federal exige esta certificación para manejar refrigerantes. Sin ella no puedes comprar refrigerante ni hacer recovery — multas de hasta $44,539 por día.') +
            '</div>' +
          '</div>' +

          '<div class="acv-welcome-cert-item">' +
            '<div class="acv-welcome-cert-icon">❄️</div>' +
            '<div class="acv-welcome-cert-text">' +
              '<strong style="color:#f59e0b;">' + _tc('acv_hvac_course', 'Curso Completo HVAC') + '</strong><br>' +
              _tc('acv_hvac_desc', 'Herramientas, refrigeración, electricidad, soldadura, diagnóstico, mini splits, heat pumps, sistemas centrales y más.') +
            '</div>' +
          '</div>' +

          '<div class="acv-welcome-cert-item">' +
            '<div class="acv-welcome-cert-icon">⚡</div>' +
            '<div class="acv-welcome-cert-text">' +
              '<strong style="color:#a78bfa;">' + _tc('acv_advanced_specialties', 'Especialidades Avanzadas') + '</strong><br>' +
              _tc('acv_advanced_desc', 'A2L refrigerantes, controles eléctricos, diseño de ductos, cálculos de carga — lo que te separa del resto y te da los mejores trabajos.') +
            '</div>' +
          '</div>' +

        '</div>' +

        '<p style="text-align:center;color:#f59e0b;font-weight:600;font-size:15px;margin:0 0 24px;padding:0 8px;">' + _tc('acv_motivational', 'Estudia a tu ritmo, completa los quizzes, obtén tus certificados. ¡Échale ganas! 💪') + '</p>' +

        '<button class="acv-welcome-btn" id="acvWelcomeBtn">🚀 ' + _tc('acv_start_courses', 'Comenzar Mis Cursos') + '</button>' +

        '<div style="margin-top:16px;">' +
          '<a href="#" id="acvWelcomeSkip" class="acv-welcome-skip">' + _tc('acv_skip_to_courses', 'Saltar e ir directo a los cursos →') + '</a>' +
        '</div>' +

      '</div>' +
    '</div>';

  // Fetch real name from DB
  _acvUpdateName();

  if (!document.getElementById('acvWelcomeStyles')) {
    var style = document.createElement('style');
    style.id = 'acvWelcomeStyles';
    style.textContent =
      '.acv-welcome-overlay{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:20px;background:#0d1117;}' +
      '.acv-welcome-card{max-width:600px;width:100%;background:linear-gradient(145deg,#161b22,#1c2333);border-radius:20px;padding:36px 28px;text-align:center;border:1px solid #30363d;box-shadow:0 8px 32px rgba(0,0,0,.4);}' +
      '.acv-welcome-header{margin-bottom:24px;}' +
      '.acv-welcome-logo{width:100px;height:100px;object-fit:contain;border-radius:50%;background:#fff;padding:6px;margin-bottom:14px;box-shadow:0 4px 20px rgba(245,158,11,.25);}' +
      '.acv-welcome-title{color:#e6edf3;font-size:24px;font-weight:700;margin:0 0 6px;}' +
      '.acv-welcome-subtitle{color:#f59e0b;font-size:14px;font-weight:500;margin:0;letter-spacing:.5px;text-transform:uppercase;}' +
      '.acv-welcome-video-wrap{margin:0 auto 24px;max-width:480px;}' +
      '.acv-welcome-video-wrap iframe{width:100%;border-radius:12px;aspect-ratio:16/9;}' +
      '.acv-welcome-message{text-align:left;color:#c9d1d9;font-size:14px;line-height:1.6;margin-bottom:20px;padding:0 8px;}' +
      '.acv-welcome-message p{margin:0 0 14px;}' +
      '.acv-welcome-cert-item{display:flex;align-items:flex-start;gap:12px;background:#0d1117;border:1px solid #1f2937;border-radius:12px;padding:14px;margin-bottom:10px;}' +
      '.acv-welcome-cert-icon{font-size:28px;flex-shrink:0;width:36px;text-align:center;padding-top:2px;}' +
      '.acv-welcome-cert-text{font-size:13px;line-height:1.5;color:#c9d1d9;}' +
      '.acv-welcome-cert-text strong{font-size:14px;display:inline-block;margin-bottom:3px;}' +
      '.acv-welcome-btn{display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0d1117;font-size:17px;font-weight:700;border:none;border-radius:12px;padding:16px 40px;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 16px rgba(245,158,11,.3);}' +
      '.acv-welcome-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(245,158,11,.45);}' +
      '.acv-welcome-btn:active{transform:translateY(0);}' +
      '.acv-welcome-skip{color:#586069;font-size:13px;text-decoration:none;transition:color .2s;}' +
      '.acv-welcome-skip:hover{color:#94a3b8;text-decoration:underline;}' +
      '@media(max-width:480px){.acv-welcome-card{padding:24px 16px;}.acv-welcome-title{font-size:20px;}.acv-welcome-message{font-size:14px;}}';
    document.head.appendChild(style);
  }

  document.getElementById('acvWelcomeBtn').addEventListener('click', function() {
    _acvMarkWelcomeSeen();
    onContinue();
  });
  document.getElementById('acvWelcomeSkip').addEventListener('click', function(e) {
    e.preventDefault();
    _acvMarkWelcomeSeen();
    onContinue();
  });
}

// ============================================
// INIT — called by navigation.js
// ============================================
function initAcvoltCert(screenId) {
  var _loadEl = document.getElementById(screenId || 'acvoltCertScreen');

  // Show welcome screen on first visit (only for course list screen)
  if ((!screenId || screenId === 'acvoltCertScreen') && !_acvHasSeenWelcome()) {
    if (_loadEl) {
      _acvRenderWelcome(_loadEl, function() {
        initAcvoltCert(screenId);
      });
    }
    return;
  }

  // Show loading indicator immediately so screen is never blank
  if (_loadEl && !_loadEl.innerHTML.trim()) {
    _loadEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:60vh;flex-direction:column;"><div style="width:56px;height:56px;border-radius:50%;background:#fff;overflow:hidden;margin-bottom:16px;display:flex;align-items:center;justify-content:center;border:1px solid #E7E5DE;"><img src="maestro-hvacr-logo.png" style="width:100%;height:100%;object-fit:contain;"></div><p style="color:#6B6B66;font-size:14px;font-weight:500;">' + (typeof _t === 'function' ? _t('acvolt_loading_courses') : 'Cargando cursos...') + '</p></div>';
  }
  _acvoltLoadData().then(function() {
    if (screenId === 'acvoltCertScreen') {
      _acvoltRenderCourseList();
    } else if (screenId === 'acvoltCourseScreen' && _acvoltCurrentCourse) {
      _acvoltRenderCourseDetail();
    } else if (screenId === 'acvoltLessonScreen' && _acvoltCurrentLesson) {
      _acvoltRenderLesson();
    } else {
      _acvoltRenderCourseList();
      if (typeof showScreen === 'function') showScreen('acvoltCertScreen');
    }
  }).catch(function(err) {
    console.error('ACVOLT Cert load error:', err);
    var el = document.getElementById(screenId || 'acvoltCertScreen');
    if (el) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:60vh;flex-direction:column;text-align:center;padding:20px;"><div style="width:56px;height:56px;border-radius:50%;background:#fff;overflow:hidden;margin-bottom:16px;display:flex;align-items:center;justify-content:center;border:1px solid #E7E5DE;"><img src="maestro-hvacr-logo.png" style="width:100%;height:100%;object-fit:contain;"></div><p style="color:#DC2626;font-size:14px;margin-bottom:12px;font-weight:600;">Error cargando los cursos</p><button onclick="showScreen(\'dashboardScreen\')" style="padding:10px 20px;background:#E8591C;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;">\u2190 Volver al inicio</button></div>';
    }
  });
}

// ============================================
// AI-GENERATED VIDEO QUIZ
// ============================================
function _acvGetCachedAiQuiz(lessonId) {
  try {
    var d = JSON.parse(localStorage.getItem('acvolt_ai_quiz_' + lessonId) || 'null');
    if (d && Array.isArray(d.questions) && d.questions.length > 0) return d;
  } catch(e) { /* ignore */ }
  return null;
}

function _acvCacheAiQuiz(lessonId, questions) {
  try { localStorage.setItem('acvolt_ai_quiz_' + lessonId, JSON.stringify({ questions: questions, ts: Date.now() })); } catch(e) { /* ignore */ }
}

var _acvAiQuizAnswers = {};

function _acvoltStartAiQuiz(lessonId) {
  var btn = document.getElementById('acvoltAiQuizBtn');
  var area = document.getElementById('acvoltAiQuizArea');
  if (!area) return;

  // Reset answers
  _acvAiQuizAnswers = {};

  // Check cache first
  var cached = _acvGetCachedAiQuiz(lessonId);
  if (cached) {
    if (btn) btn.style.display = 'none';
    _acvRenderAiQuiz(area, cached.questions, lessonId);
    return;
  }

  // Show loading
  if (btn) { btn.disabled = true; btn.textContent = '🔄 Generando quiz con AI...'; }

  var lesson = _acvoltCurrentLesson;
  var courseName = '';
  if (_acvoltCurrentCourse) courseName = _acvoltCurrentCourse.title || '';

  var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';

  fetch(sbUrl + '/functions/v1/generate-video-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sbKey },
    body: JSON.stringify({
      title: lesson.title || '',
      description: lesson.description || '',
      courseName: courseName
    })
  }).then(function(r) { return r.json(); }).then(function(data) {
    if (data.error || !data.questions || data.questions.length === 0) {
      if (btn) { btn.disabled = false; btn.textContent = '🧠 Quiz de Comprensión (5 preguntas)'; }
      area.innerHTML = '<div style="color:#DC2626;text-align:center;padding:16px;font-size:13px;font-weight:600;">Error generando quiz. Intenta de nuevo.</div>';
      return;
    }
    // Cache for future use
    _acvCacheAiQuiz(lessonId, data.questions);
    if (btn) btn.style.display = 'none';
    _acvRenderAiQuiz(area, data.questions, lessonId);
  }).catch(function(err) {
    console.error('[AcvoltAiQuiz]', err);
    if (btn) { btn.disabled = false; btn.textContent = '🧠 Quiz de Comprensión (5 preguntas)'; }
    area.innerHTML = '<div style="color:#DC2626;text-align:center;padding:16px;font-size:13px;font-weight:600;">Error de conexi\u00F3n. Intenta de nuevo.</div>';
  });
}

function _acvRenderAiQuiz(container, questions, lessonId) {
  var html = '';
  html += '<div style="margin-top:16px;">';
  html += '<div style="color:#E8591C;font-size:13px;font-weight:700;margin-bottom:16px;letter-spacing:0.5px;">\uD83E\uDDE0 QUIZ DE COMPRENSI\u00D3N — ' + questions.length + ' PREGUNTAS</div>';

  questions.forEach(function(q, idx) {
    html += '<div class="acvolt-aiq" id="acvAiQ' + idx + '" style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
    html += '<div style="color:#0F0F0F;font-size:14px;font-weight:600;margin-bottom:12px;">' + (idx + 1) + '. ' + _acvEsc(q.q) + '</div>';

    (q.opts || []).forEach(function(opt, oIdx) {
      html += '<button onclick="_acvAiQuizSelect(this,' + idx + ',' + oIdx + ')" ';
      html += 'style="display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;background:#FAFAF7;border:1.5px solid #E7E5DE;border-radius:8px;color:#0F0F0F;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s;min-height:44px;-webkit-tap-highlight-color:transparent;line-height:1.4;">';
      html += _acvEsc(opt);
      html += '</button>';
    });
    html += '</div>';
  });

  html += '<div id="acvAiQuizResult" style="display:none;"></div>';
  html += '<button id="acvAiQuizSubmit" onclick="_acvAiQuizSubmit(' + lessonId + ')" style="width:100%;padding:14px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;margin-top:12px;min-height:48px;-webkit-tap-highlight-color:transparent;">Enviar Respuestas</button>';
  html += '<button onclick="_acvAiQuizRegen(' + lessonId + ')" style="width:100%;padding:10px;background:transparent;color:#6B6B66;border:1px solid #E7E5DE;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;margin-top:8px;">\uD83D\uDD04 Generar nuevas preguntas</button>';
  html += '</div>';

  container.innerHTML = html;
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _acvAiQuizSelect(btn, qIdx, optIdx) {
  if (_acvAiQuizAnswers[qIdx] !== undefined) return; // already answered
  _acvAiQuizAnswers[qIdx] = optIdx;

  var card = document.getElementById('acvAiQ' + qIdx);
  if (!card) return;
  var allBtns = card.querySelectorAll('button');
  allBtns.forEach(function(b) { b.style.pointerEvents = 'none'; b.style.opacity = '0.6'; });

  // Get correct answer from cache
  var cached = _acvGetCachedAiQuiz(_acvoltCurrentLesson.id);
  if (!cached) return;
  var correct = cached.questions[qIdx].ans;
  var isCorrect = optIdx === correct;

  // Show feedback
  btn.style.opacity = '1';
  if (isCorrect) {
    btn.style.borderColor = '#10b981';
    btn.style.background = '#10b98122';
    btn.style.color = '#6ee7b7';
  } else {
    btn.style.borderColor = '#ef4444';
    btn.style.background = '#ef444422';
    btn.style.color = '#fca5a5';
    // Highlight correct answer
    if (allBtns[correct]) {
      allBtns[correct].style.opacity = '1';
      allBtns[correct].style.borderColor = '#10b981';
      allBtns[correct].style.background = '#10b98122';
      allBtns[correct].style.color = '#6ee7b7';
    }
  }

  // Show explanation
  var exp = cached.questions[qIdx].exp;
  if (exp) {
    var expDiv = document.createElement('div');
    expDiv.style.cssText = 'margin-top:8px;padding:10px 12px;background:#FAFAF7;border-radius:8px;border-left:3px solid ' + (isCorrect ? '#059669' : '#E8591C') + ';';
    expDiv.innerHTML = '<div style="color:#3D3D3A;font-size:12px;line-height:1.5;font-weight:500;">' + (isCorrect ? '\u2705 ' : '\uD83D\uDCA1 ') + _acvEsc(exp) + '</div>';
    card.appendChild(expDiv);
  }
}

function _acvAiQuizSubmit(lessonId) {
  var cached = _acvGetCachedAiQuiz(lessonId);
  if (!cached) return;
  var total = cached.questions.length;
  var correct = 0;

  cached.questions.forEach(function(q, idx) {
    if (_acvAiQuizAnswers[idx] === q.ans) correct++;
  });

  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 80;

  var resultEl = document.getElementById('acvAiQuizResult');
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = '<div style="text-align:center;padding:20px;background:' + (passed ? '#052e1622' : '#450a0a22') + ';border:1px solid ' + (passed ? '#10b981' : '#ef4444') + '33;border-radius:12px;margin-top:16px;">' +
      '<div style="font-size:32px;margin-bottom:8px;">' + (passed ? '🎉' : '📚') + '</div>' +
      '<div style="color:' + (passed ? '#10b981' : '#ef4444') + ';font-size:18px;font-weight:800;">' + correct + ' / ' + total + ' (' + pct + '%)</div>' +
      '<div style="color:#3D3D3A;font-size:13px;margin-top:4px;">' + (passed ? '¡Excelente! Entendiste bien el tema.' : 'Revisa el video y las explicaciones para mejorar.') + '</div>' +
      '</div>';
  }

  var submitBtn = document.getElementById('acvAiQuizSubmit');
  if (submitBtn) submitBtn.style.display = 'none';

  // Save result
  try {
    var results = JSON.parse(localStorage.getItem('acvolt_ai_quiz_results') || '{}');
    results[lessonId] = { score: pct, correct: correct, total: total, passed: passed, date: new Date().toISOString() };
    localStorage.setItem('acvolt_ai_quiz_results', JSON.stringify(results));
  } catch(e) { /* ignore */ }
}

function _acvAiQuizRegen(lessonId) {
  // Clear cache and regenerate
  try { localStorage.removeItem('acvolt_ai_quiz_' + lessonId); } catch(e) { /* ignore */ }
  _acvAiQuizAnswers = {};
  var area = document.getElementById('acvoltAiQuizArea');
  if (area) area.innerHTML = '';
  var btn = document.getElementById('acvoltAiQuizBtn');
  if (btn) { btn.style.display = ''; btn.disabled = false; btn.textContent = '🧠 Quiz de Comprensión (5 preguntas)'; }
  _acvoltStartAiQuiz(lessonId);
}
