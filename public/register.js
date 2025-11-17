document.getElementById('formRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirmarSenha').value;
    const messageElement = document.getElementById('mensagem');

    if (password !== confirmPassword) {
        messageElement.textContent = 'As senhas não conferem.';
        messageElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Falha no registro.');
        }

        messageElement.textContent = 'Registro bem-sucedido! Redirecionando para o login...';
        messageElement.style.color = 'green';

        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);

    } catch (error) {
        messageElement.textContent = error.message;
        messageElement.style.color = 'red';
    }
});
