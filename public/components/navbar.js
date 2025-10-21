// /public/components/navbar.js
class MainNavbar extends HTMLElement {
  constructor() {
    super();
    // HTML baseado no seu protótipo .webm (canto superior esquerdo) e .jpg (menu)
    this.innerHTML = `
      <aside class="sidebar-main-nav">
        <a href="/" class="nav-logo">
          BGT 
          </a>
        
        <div class="nav-header">Menu</div>
        <nav class="nav-links">
          <a href="/" class="nav-item ${this.isActive('/')}">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Início</span>
          </a>
          <a href="#" class="nav-item">
            <span class="nav-icon">⭐</span>
            <span class="nav-text">Favoritos</span>
          </a>
          <a href="#" class="nav-item">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Categorias</span>
          </a>
          
          <a href="/localizacao" class="nav-item ${this.isActive('/localizacao')}">
            <span class="nav-icon">📍</span>
            <span class="nav-text">Mapa</span>
          </a>

          <a href="#" class="nav-item">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configurações</span>
          </a>
          <a href="#" class="nav-item">
            <span class="nav-icon">❓</span>
            <span class="nav-text">Ajuda</span>
          </a>
        </nav>

        <div class="nav-profile">
            <a href="/login" id="login-link" class="btn-secondary">Login</a>
        </div>
      </aside>
    `;
  }
  
  isActive(path) {
    return window.location.pathname === path ? 'active' : '';
  }
  
  connectedCallback() {
      const user = localStorage.getItem('user');
      const loginLink = this.querySelector('#login-link');
      
      if(user) {
          const userData = JSON.parse(user);
          loginLink.textContent = `Olá, ${userData.username}`;
          loginLink.href = '#';
          loginLink.classList.remove('btn-secondary');
      }
  }
}

customElements.define('main-navbar', MainNavbar);