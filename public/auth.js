// /public/auth.js
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        // usar caminho relativo
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Falha no login');
        }
        
        // SUCESSO!
        // Salva o token no navegador
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redireciona para a página inicial (o feed)
        window.location.href = '/'; 
        

    } catch (error) {
        errorMessage.textContent = error.message;
    }

});