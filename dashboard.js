/* ============================================================
   js/dashboard.js  –  User dashboard rendering
   ============================================================ */

'use strict';

function updateDashboard() {
  if (!currentUser) return;

  /* -- Header greeting -- */
  const usernameEl = document.getElementById('dashboard-username');
  if (usernameEl) usernameEl.textContent = currentUser.username;

  const userEnrollments = enrollments.filter(e => e.user_id === currentUser.user_id);

  /* -- Stats -- */
  document.getElementById('enrolled-count').textContent = userEnrollments.length;

  const completed  = userEnrollments.filter(e => e.progress === 100).length;
  document.getElementById('completed-count').textContent = completed;

  const avgProgress = userEnrollments.length > 0
    ? Math.round(userEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / userEnrollments.length)
    : 0;
  document.getElementById('overall-progress').textContent = avgProgress + '%';

  /* -- Course List -- */
  const container = document.getElementById('enrolled-courses');
  if (!container) return;

  if (userEnrollments.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center">
        <p class="text-white/50">You haven't enrolled in any courses yet.</p>
        <button onclick="navigateTo('courses')" class="glow-btn px-6 py-3 rounded-full text-white font-medium mt-4">
          Browse Courses
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.course_id);
    if (!course) return '';

    return `
      <div class="glass-card rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50"
           onclick="showCourseDetail('${course.id}')">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0">
            <span class="text-3xl">${course.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-display text-xl font-bold truncate">${course.title}</h3>
            <p class="text-white/50 text-sm">${course.modules.length} modules</p>
          </div>
          <div class="text-right">
            <div class="font-display text-2xl font-bold gradient-text">${enrollment.progress || 0}%</div>
            <div class="text-white/40 text-sm">Progress</div>
          </div>
        </div>
        <div class="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all"
               style="width: ${enrollment.progress || 0}%"></div>
        </div>
      </div>
    `;
  }).join('');
}
