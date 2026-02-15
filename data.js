/* ============================================================
   js/data.js  –  Static course catalog & app configuration
   ============================================================ */

'use strict';

/* ---------- Default Configuration ---------- */
const defaultConfig = {
  academy_name:      'Coders Academy',
  hero_title:        'Master the Art of Coding',
  hero_subtitle:     'Join thousands of developers learning to build the future. Interactive courses, real projects, and expert mentorship.',
  background_color:  '#0a0a0f',
  surface_color:     '#13131a',
  text_color:        '#ffffff',
  primary_color:     '#6366f1',
  secondary_color:   '#22d3ee'
};

/* ---------- Global App State ---------- */
let config      = { ...defaultConfig };
let currentUser = null;
let enrollments = [];
let allData     = [];

/* ---------- Course Catalog (static reference data) ---------- */
const courses = [
  {
    id:          'react-mastery',
    title:       'React.js Mastery',
    description: 'Build modern web applications with React, hooks, and state management',
    category:    'web',
    level:       'Intermediate',
    duration:    '12 weeks',
    modules:     ['React Fundamentals', 'Hooks & State', 'Context API', 'Redux Toolkit', 'Performance', 'Testing'],
    icon:        '⚛️',
    color:       'from-cyan-500 to-blue-500'
  },
  {
    id:          'node-backend',
    title:       'Node.js Backend',
    description: 'Create scalable server-side applications with Node.js and Express',
    category:    'web',
    level:       'Intermediate',
    duration:    '10 weeks',
    modules:     ['Node Basics', 'Express.js', 'REST APIs', 'Authentication', 'MongoDB', 'Deployment'],
    icon:        '🟢',
    color:       'from-green-500 to-emerald-500'
  },
  {
    id:          'python-data',
    title:       'Python for Data Science',
    description: 'Analyze data and build ML models with Python, Pandas, and Scikit-learn',
    category:    'data',
    level:       'Beginner',
    duration:    '14 weeks',
    modules:     ['Python Basics', 'NumPy', 'Pandas', 'Visualization', 'Statistics', 'Machine Learning'],
    icon:        '🐍',
    color:       'from-yellow-500 to-orange-500'
  },
  {
    id:          'flutter-apps',
    title:       'Flutter Mobile Apps',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart',
    category:    'mobile',
    level:       'Beginner',
    duration:    '12 weeks',
    modules:     ['Dart Basics', 'Flutter Widgets', 'State Management', 'Navigation', 'APIs', 'Publishing'],
    icon:        '📱',
    color:       'from-blue-500 to-indigo-500'
  },
  {
    id:          'ai-foundations',
    title:       'AI Foundations',
    description: 'Understand artificial intelligence concepts and build your first AI models',
    category:    'ai',
    level:       'Intermediate',
    duration:    '16 weeks',
    modules:     ['AI Overview', 'Neural Networks', 'Deep Learning', 'NLP Basics', 'Computer Vision', 'Ethics'],
    icon:        '🤖',
    color:       'from-purple-500 to-pink-500'
  },
  {
    id:          'fullstack-js',
    title:       'Full Stack JavaScript',
    description: 'Become a complete developer with MERN stack from scratch',
    category:    'web',
    level:       'Advanced',
    duration:    '20 weeks',
    modules:     ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'DevOps'],
    icon:        '🚀',
    color:       'from-indigo-500 to-purple-500'
  }
];

/* ---------- Data SDK Handler ---------- */
const dataHandler = {
  onDataChanged(data) {
    allData     = data;
    enrollments = data.filter(d => d.type === 'enrollment');

    const users = data.filter(d => d.type === 'user');

    // Keep __backendId in sync for current user
    if (currentUser) {
      const userRecord = users.find(u => u.user_id === currentUser.user_id);
      if (userRecord) {
        currentUser = { ...currentUser, __backendId: userRecord.__backendId };
      }
    }

    // Refresh UI
    updateDashboard();
    renderCourseGrid();
  }
};
