// /public/forgot-password.js - Recuperação de Senha

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgot-password-form');
    const messageBox = document.getElementById('message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            
            // Validação de email
            if (!email) {
                showMessage('⚠️ Por favor, insira seu email.', 'error');
                return;
            }

            // Validação de formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('⚠️ Por favor, insira um email válido.', 'error');
                return;
            }

            // Desabilitar botão durante o envio
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            try {
                const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('✅ ' + (data.message || 'Link de recuperação enviado! Verifique seu email.'), 'success');
                    
                    // Limpar o formulário
                    form.reset();
                    
                    // Opcional: redirecionar após alguns segundos
                    setTimeout(() => {
                        showMessage('ℹ️ Redirecionando para o login...', 'info');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    }, 3000);
                } else {
                    showMessage('⚠️ ' + (data.message || 'Erro ao enviar email de recuperação.'), 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showMessage('⚠️ Erro ao conectar com o servidor. Tente novamente.', 'error');
            } finally {
                // Reabilitar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Função para exibir mensagens
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = 'message-box ' + type;
        
        // Scroll suave até a mensagem
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Limpar mensagem ao digitar
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (messageBox.textContent) {
                messageBox.textContent = '';
                messageBox.className = 'message-box';
            }
        });
    }
});
