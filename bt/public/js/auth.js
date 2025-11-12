import { authAPI, setToken, removeToken } from './api.js';

let currentUser = null;

// Initialize auth
export const initAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal();
    return false;
  }

  try {
    const response = await authAPI.getCurrentUser();
    if (response && response.user) {
      currentUser = response.user;
      hideAuthModal();
      return true;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    removeToken();
    showAuthModal();
    return false;
  }
};

// Show auth modal
const showAuthModal = () => {
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
};

// Hide auth modal
const hideAuthModal = () => {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
};

// Setup auth tabs
const setupAuthTabs = () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const authForms = document.querySelectorAll('.auth-form');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Update active tab
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show corresponding form
      authForms.forEach(form => form.classList.remove('active'));
      document.getElementById(`${tab}-form`).classList.add('active');
    });
  });
};

// Setup login form
const setupLoginForm = () => {
  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await authAPI.login(username, password);
      if (response && response.token) {
        setToken(response.token);
        currentUser = response.user;
        hideAuthModal();
        window.location.reload();
      }
    } catch (error) {
      errorMsg.textContent = error.message || 'Login failed. Please check your credentials.';
    }
  });
};

// Setup signup form
const setupSignupForm = () => {
  const form = document.getElementById('signup-form');
  const errorMsg = document.getElementById('signup-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (password.length < 6) {
      errorMsg.textContent = 'Password must be at least 6 characters';
      return;
    }

    try {
      const response = await authAPI.signup(username, password, email);
      if (response && response.token) {
        setToken(response.token);
        currentUser = response.user;
        hideAuthModal();
        window.location.reload();
      }
    } catch (error) {
      errorMsg.textContent = error.message || 'Signup failed. Username may already exist.';
    }
  });
};

// Setup logout
const setupLogout = () => {
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    removeToken();
    currentUser = null;
    window.location.reload();
  });
};

// Initialize auth module
export const setupAuth = () => {
  setupAuthTabs();
  setupLoginForm();
  setupSignupForm();
  setupLogout();
};

export const getCurrentUser = () => currentUser;

