const form = document.getElementById('formRegistro');
const messageBox = document.getElementById('mensagem');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    messageBox.textContent = '';

    const name = document.getElementById('nome').value.trim();
    const username = document.getElementById('usuario').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirmarSenha').value;

    if (password !== confirmPassword) {
      messageBox.textContent = 'As senhas precisam ser iguais.';
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, name, password })
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao registrar.');
      }

      window.location.href = '/login';
    } catch (error) {
      messageBox.textContent = error.message;
    }
  });
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return { message: text };
}
