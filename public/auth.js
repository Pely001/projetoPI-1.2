// /public/auth.js - Login
document.addEventListener('DOMContentLoaded', function() {
    // Botão para ir para o registro
    const signUpButton = document.getElementById('signUp');
    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            window.location.href = 'registro.html';
        });
    }

    // Formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                errorMessage.textContent = '⚠️ ' + error.message;
            }
        });
    }
});