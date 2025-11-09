// /public/register.js - Registro
document.addEventListener('DOMContentLoaded', function() {
    let tipoRegistro = 'usuario'; // Padrão: usuário

    // Botão para ir para o login
    const signInButton = document.getElementById('signIn');
    if (signInButton) {
        signInButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Controle das abas (Usuário / Empresa)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Ativa o selecionado
            button.classList.add('active');
            tipoRegistro = button.getAttribute('data-tab');
            
            const targetContent = document.getElementById(`form-${tipoRegistro}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Limpa mensagem de erro ao trocar de aba
            const mensagem = document.getElementById('mensagem');
            if (mensagem) {
                mensagem.textContent = '';
            }
        });
    });

    // Máscara para CNPJ
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    // Máscara para Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    // Formulário de registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mensagem = document.getElementById('mensagem');
            let dadosRegistro = {};

            // Validação para USUÁRIO
            if (tipoRegistro === 'usuario') {
                const nome = document.getElementById('nome').value.trim();
                const email = document.getElementById('email').value.trim();
                const senha = document.getElementById('senha').value;
                const confirmarSenha = document.getElementById('confirmarSenha').value;
                
                if (!nome || !email || !senha || !confirmarSenha) {
                    mensagem.textContent = '⚠️ Preencha todos os campos';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                if (senha !== confirmarSenha) {
                    mensagem.textContent = '⚠️ As senhas não coincidem';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                if (senha.length < 6) {
                    mensagem.textContent = '⚠️ A senha deve ter no mínimo 6 caracteres';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                dadosRegistro = {
                    tipo: 'usuario',
                    username: nome,
                    email: email,
                    password: senha
                };
            }
            // Validação para EMPRESA
            else if (tipoRegistro === 'empresa') {
                const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
                const cnpj = document.getElementById('cnpj').value.trim();
                const emailEmpresa = document.getElementById('emailEmpresa').value.trim();
                const telefone = document.getElementById('telefone').value.trim();
                const senhaEmpresa = document.getElementById('senhaEmpresa').value;
                const confirmarSenhaEmpresa = document.getElementById('confirmarSenhaEmpresa').value;
                
                if (!nomeEmpresa || !cnpj || !emailEmpresa || !telefone || !senhaEmpresa || !confirmarSenhaEmpresa) {
                    mensagem.textContent = '⚠️ Preencha todos os campos';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                if (senhaEmpresa !== confirmarSenhaEmpresa) {
                    mensagem.textContent = '⚠️ As senhas não coincidem';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                if (senhaEmpresa.length < 6) {
                    mensagem.textContent = '⚠️ A senha deve ter no mínimo 6 caracteres';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                // Validar CNPJ (14 dígitos)
                const cnpjLimpo = cnpj.replace(/\D/g, '');
                if (cnpjLimpo.length !== 14) {
                    mensagem.textContent = '⚠️ CNPJ inválido';
                    mensagem.style.color = '#ff6b6b';
                    return;
                }

                dadosRegistro = {
                    tipo: 'empresa',
                    username: nomeEmpresa,
                    cnpj: cnpjLimpo,
                    email: emailEmpresa,
                    telefone: telefone,
                    password: senhaEmpresa
                };
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosRegistro)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Falha no registro');
                }
                
                // SUCESSO!
                mensagem.textContent = '✅ Cadastro realizado com sucesso!';
                mensagem.style.color = '#4caf50';
                
                // Redirecionar após 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } catch (error) {
                mensagem.textContent = '⚠️ ' + error.message;
                mensagem.style.color = '#ff6b6b';
            }
        });
    }
});