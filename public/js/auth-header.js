function getStoredUser() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function getElements() {
  return {
    authButton: document.getElementById('header-auth-btn'),
    authTrigger: document.getElementById('header-auth-trigger'),
    authMenu: document.getElementById('header-auth-menu'),
    authUserBlock: document.getElementById('header-auth-user'),
    logoutButton: document.getElementById('header-logout-btn'),
  };
}

function closeMenu() {
  const { authMenu } = getElements();
  authMenu?.classList.remove('visible');
}

function toggleMenu() {
  const { authMenu } = getElements();
  authMenu?.classList.toggle('visible');
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  closeMenu();
  renderAuthHeader();
  window.location.href = '/';
}

function renderAuthHeader() {
  const { authButton, authTrigger, authUserBlock } = getElements();
  const user = getStoredUser();
  const token = localStorage.getItem('authToken');
  const loggedIn = Boolean(user && token);

  if (authButton) {
    authButton.hidden = loggedIn;
  }

  if (authUserBlock) {
    authUserBlock.hidden = !loggedIn;
  }

    if (authTrigger) {
      if (loggedIn && user) {
        authTrigger.textContent = `Olá, ${user.name || user.username}`;
      } else {
        authTrigger.textContent = '';
        closeMenu();
      }
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const { authButton, authTrigger, logoutButton, authMenu } = getElements();

  if (authButton) {
    authButton.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  if (authTrigger) {
    authTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });
  }

  if (authMenu) {
    authMenu.addEventListener('click', (event) => event.stopPropagation());
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  }

  document.addEventListener('click', () => closeMenu());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  renderAuthHeader();
});

window.addEventListener('storage', (event) => {
  if (['authToken', 'user'].includes(event.key)) {
    renderAuthHeader();
  }
});