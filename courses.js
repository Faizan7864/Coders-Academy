/* ============================================================
   js/courses.js  –  Course grid, detail, enroll/drop, modules
   ============================================================ */

'use strict';

/* ---------- Render Course Grid ---------- */
function renderCourseGrid(filter = 'all') {
  const grid = document.getElementById('course-grid');
  if (!grid) return;

  const filteredCourses = filter === 'all'
    ? courses
    : courses.filter(c => c.category === filter);

  grid.innerHTML = filteredCourses.map(course => {
    const enrollment = currentUser
      ? enrollments.find(e => e.course_id === course.id && e.user_id === currentUser.user_id)
      : null;
    const isEnrolled = !!enrollment;

    return `
      <div class="course-card glass-card rounded-2xl overflow-hidden relative group cursor-pointer"
           onclick="showCourseDetail('${course.id}')">
        <div class="h-32 bg-gradient-to-br ${course.color} flex items-center justify-center">
          <span class="text-6xl">${course.icon}</span>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70">${course.level}</span>
            <span class="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70">${course.duration}</span>
          </div>
          <h3 class="font-display text-xl font-bold mb-2">${course.title}</h3>
          <p class="text-white/50 text-sm mb-4 line-clamp-2">${course.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-white/40 text-sm">${course.modules.length} modules</span>
            ${isEnrolled
              ? `<span class="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Enrolled</span>`
              : `<span class="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium
                          group-hover:bg-indigo-500 group-hover:text-white transition">View Course</span>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- Filter Courses ---------- */
function filterCourses(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('bg-indigo-500/30', btn.dataset.filter === filter);
  });
  renderCourseGrid(filter);
}

/* ---------- Course Detail ---------- */
function showCourseDetail(courseId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return;

  const enrollment = currentUser
    ? enrollments.find(e => e.course_id === courseId && e.user_id === currentUser.user_id)
    : null;

  const completedModules = enrollment
    ? (enrollment.completed_modules || '').split(',').filter(Boolean)
    : [];
  const progress = enrollment ? (enrollment.progress || 0) : 0;

  const content = document.getElementById('course-detail-content');
  if (!content) return;

  content.innerHTML = `
    <div class="glass-card rounded-3xl overflow-hidden">
      <div class="h-48 bg-gradient-to-br ${course.color} flex items-center justify-center relative">
        <span class="text-8xl">${course.icon}</span>
        <div class="absolute bottom-4 right-4 flex gap-2">
          <span class="px-4 py-2 rounded-full bg-black/30 backdrop-blur text-white text-sm">${course.level}</span>
          <span class="px-4 py-2 rounded-full bg-black/30 backdrop-blur text-white text-sm">${course.duration}</span>
        </div>
      </div>

      <div class="p-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold mb-4">${course.title}</h1>
        <p class="text-white/60 text-lg mb-8">${course.description}</p>

        ${enrollment ? `
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white/70">Your Progress</span>
              <span class="font-bold text-indigo-400">${progress}%</span>
            </div>
            <div class="h-3 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                   style="width: ${progress}%"></div>
            </div>
          </div>
        ` : ''}

        <div class="mb-8">
          <h2 class="font-display text-xl font-bold mb-4">Course Modules</h2>
          <div class="space-y-3">
            ${course.modules.map((module, idx) => {
              const isCompleted = completedModules.includes(String(idx));
              return `
                <div class="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition
                            ${enrollment ? 'cursor-pointer' : ''}"
                     ${enrollment ? `onclick="toggleModule('${courseId}', ${idx})"` : ''}>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center
                              ${isCompleted ? 'bg-green-500' : 'bg-white/10'}">
                    ${isCompleted
                      ? `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                         </svg>`
                      : `<span class="text-white/50 text-sm">${idx + 1}</span>`
                    }
                  </div>
                  <span class="${isCompleted ? 'text-white' : 'text-white/70'}">${module}</span>
                  ${enrollment
                    ? `<span class="ml-auto text-white/40 text-sm">${isCompleted ? 'Completed' : 'Click to complete'}</span>`
                    : ''
                  }
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="flex gap-4">
          ${enrollment
            ? `<button onclick="dropCourse('${courseId}')"
                       class="flex-1 py-4 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition">
                 Drop Course
               </button>
               <button onclick="navigateTo('dashboard')"
                       class="flex-1 glow-btn py-4 rounded-xl text-white font-semibold">
                 Go to Dashboard
               </button>`
            : `<button onclick="enrollCourse('${courseId}')"
                       class="flex-1 glow-btn py-4 rounded-xl text-white font-semibold">
                 ${currentUser ? 'Enroll Now' : 'Sign In to Enroll'}
               </button>`
          }
        </div>
      </div>
    </div>
  `;

  navigateTo('course-detail');
}

/* ---------- Enroll ---------- */
async function enrollCourse(courseId) {
  if (!currentUser) {
    showAuthModal('login');
    return;
  }

  if (enrollments.length >= 999) {
    showToast('Maximum enrollment limit reached', 'error');
    return;
  }

  const existing = enrollments.find(
    e => e.course_id === courseId && e.user_id === currentUser.user_id
  );
  if (existing) {
    showToast('Already enrolled in this course', 'info');
    return;
  }

  const result = await window.dataSdk.create({
    type:              'enrollment',
    user_id:           currentUser.user_id,
    course_id:         courseId,
    progress:          0,
    completed_modules: '',
    enrolled_at:       new Date().toISOString()
  });

  if (result.isOk) {
    showToast('Successfully enrolled!', 'success');
    setTimeout(() => showCourseDetail(courseId), 500);
  } else {
    showToast('Failed to enroll', 'error');
  }
}

/* ---------- Drop ---------- */
async function dropCourse(courseId) {
  const enrollment = enrollments.find(
    e => e.course_id === courseId && e.user_id === currentUser.user_id
  );
  if (!enrollment) return;

  const result = await window.dataSdk.delete(enrollment);
  if (result.isOk) {
    showToast('Course dropped', 'info');
    navigateTo('courses');
  } else {
    showToast('Failed to drop course', 'error');
  }
}

/* ---------- Toggle Module Completion ---------- */
async function toggleModule(courseId, moduleIdx) {
  const enrollment = enrollments.find(
    e => e.course_id === courseId && e.user_id === currentUser.user_id
  );
  if (!enrollment) return;

  const course = courses.find(c => c.id === courseId);
  if (!course) return;

  let completedModules = (enrollment.completed_modules || '').split(',').filter(Boolean);
  const moduleIdxStr   = String(moduleIdx);

  if (completedModules.includes(moduleIdxStr)) {
    completedModules = completedModules.filter(m => m !== moduleIdxStr);
  } else {
    completedModules.push(moduleIdxStr);
  }

  const progress = Math.round((completedModules.length / course.modules.length) * 100);

  const result = await window.dataSdk.update({
    ...enrollment,
    completed_modules: completedModules.join(','),
    progress
  });

  if (result.isOk) {
    showCourseDetail(courseId);
  }
}
