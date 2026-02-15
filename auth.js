/* ============================================================
   js/auth.js  –  Authentication (login / signup / logout)
   ============================================================ */

'use strict';

let authMode = 'login';

/* ---------- Show / Hide Modal ---------- */
function showAuthModal(mode) {
  authMode = mode;

  const modal     = document.getElementById('auth-modal');
  const title     = document.getElementById('auth-title');
  const subtitle  = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const nameField = document.getElementById('signup-name-field');
  const switchBtn = document.getElementById('auth-switch');

  if (mode === 'login') {
    title.textContent      = 'Welcome Back';
    subtitle.textContent   = 'Sign in to continue your journey';
    submitBtn.textContent  = 'Sign In';
    nameField.classList.add('hidden');
    switchBtn.innerHTML    = `Don't have an account? <span class="text-indigo-400">Sign up</span>`;
  } else {
    title.textContent      = 'Create Account';
    subtitle.textContent   = 'Start your learning adventure';
    submitBtn.textContent  = 'Create Account';
    nameField.classList.remove('hidden');
    switchBtn.innerHTML    = `Already have an account? <span class="text-indigo-400">Sign in</span>`;
  }

  modal.classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('auth-form').reset();
}

function switchAuthMode() {
  showAuthModal(authMode === 'login' ? 'signup' : 'login');
}

/* ---------- Handle Form Submit ---------- */
async function handleAuth(e) {
  e.preventDefault();

  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const name     = document.getElementById('auth-name').value.trim();

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (authMode === 'signup') {
    if (!name) {
      showToast('Please enter your name', 'error');
      return;
    }

    // Guard: duplicate email
    const existingUser = allData.find(d => d.type === 'user' && d.email === email);
    if (existingUser) {
      showToast('Email already registered', 'error');
      return;
    }

    // Create user record via Data SDK
    const userId = 'user_' + Date.now();
    const result = await window.dataSdk.create({
      type:     'user',
      user_id:  userId,
      username: name,
      email:    email
    });

    if (result.isOk) {
      currentUser = { user_id: userId, username: name, email };
      updateAuthUI();
      closeAuthModal();
      showToast('Account created successfully!', 'success');
    } else {
      showToast('Failed to create account', 'error');
    }

  } else {
    // Login: find user by email (no real password check in demo)
    const user = allData.find(d => d.type === 'user' && d.email === email);
    if (user) {
      currentUser = { user_id: user.user_id, username: user.username, email: user.email };
      updateAuthUI();
      closeAuthModal();
      showToast('Welcome back!', 'success');
    } else {
      showToast('Account not found. Please sign up.', 'error');
    }
  }
}

/* ---------- Update Nav UI after Auth Change ---------- */
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu    = document.getElementById('user-menu');

  if (currentUser) {
    authButtons.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    document.getElementById('user-name').textContent   = currentUser.username;
    document.getElementById('user-avatar').textContent = currentUser.username.charAt(0).toUpperCase();
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');
    userMenu.classList.remove('flex');
  }

  renderCourseGrid();
}

/* ---------- Logout ---------- */
function logout() {
  currentUser = null;
  updateAuthUI();
  navigateTo('home');
  showToast('Logged out successfully', 'info');
}
