// script.js
const SUPABASE_URL = "__SUPABASE_URL__";
const SUPABASE_ANON_KEY = "__SUPABASE_ANON_KEY__";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let adminUser = null;

// DOM
const loginModal = document.getElementById('login-modal');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const addUserForm = document.getElementById('add-user-form');
const newUserEmail = document.getElementById('new-user-email');
const addUserMsg = document.getElementById('add-user-msg');
const userList = document.getElementById('user-list');

// Login
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message;
    loginError.classList.remove('hidden');
    return;
  }

  adminUser = data.user;
  loginModal.classList.add('hidden');
  dashboard.classList.remove('hidden');
  loginError.classList.add('hidden');
  loadUsers();
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  adminUser = null;
  dashboard.classList.add('hidden');
  loginModal.classList.remove('hidden');
  document.getElementById('admin-email').value = '';
  document.getElementById('admin-password').value = '';
});

// Add user
addUserForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = newUserEmail.value.trim();
  if (!email) return;

  const { error } = await supabase.from('allowed_users').insert({ email });
  if (error) {
    addUserMsg.textContent = 'Error adding user.';
    addUserMsg.classList.remove('hidden');
    addUserMsg.style.color = 'red';
    console.error(error);
    return;
  }

  addUserMsg.textContent = `User ${email} added successfully!`;
  addUserMsg.style.color = 'green';
  addUserMsg.classList.remove('hidden');
  newUserEmail.value = '';
  loadUsers();
});

// Load users
async function loadUsers() {
  const { data: users, error } = await supabase.from('allowed_users').select('email');
  if (error) return;

  userList.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u.email;
    userList.appendChild(li);
  });
}