// /public/components/navbar.js
// Define um novo "componente" HTML <main-navbar>

class MainNavbar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <aside class="sidebar-main-nav">
        
          <img src="/data/img/icon.png" alt="BGT" class="nav-logo-image" style="width: 64px; align-self: center">
        
        <nav class="nav-links">
          <a href="/" class="nav-item ${this.isActive('/')}">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Página Inicial</span>
          </a>
          <a href="#" class="nav-item">
            <span class="nav-icon">🔍</span>
            <span class="nav-text">Pesquisar</span>
          </a>
          <a href="#" class="nav-item">
            <span class="nav-icon">ℹ️</span>
            <span class="nav-text">Informações</span>
          </a>
          <a href="/localizacao" class="nav-item ${this.isActive('/localizacao')}">
            <span class="nav-icon">📍</span>
            <span class="nav-text">Localização</span>
          </a>
        </nav>
        <div class="nav-profile">
            <a href="/login" id="login-link">Login</a>
        </div>
      </aside>
    `;
  }
  
  // Função para destacar o link ativo
  isActive(path) {
    return window.location.pathname === path ? 'active' : '';
  }
  
  // Roda quando o componente é adicionado na página
  connectedCallback() {
      const user = localStorage.getItem('user');
      const loginLink = this.querySelector('#login-link');
      
      if(user) {
          const userData = JSON.parse(user);
          loginLink.textContent = `Olá, ${userData.username}`;
          loginLink.href = '#'; // (link para perfil?)
      }
  }
}

// Registra o componente para que o HTML o entenda
customElements.define('main-navbar', MainNavbar);