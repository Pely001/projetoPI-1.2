const CHATBOT_LOGO = '/data/img/iconchat.png';
const CHATBOT_AVATAR = '/data/img/icon.png';
const CHAT_ENTRIES = [
    {
        question: 'Como registrar meu estabelecimento?',
        answer: 'Abra o menu “Entrar” e siga para “Criar conta Empresarial”. Preencha todos os campos obrigatórios e aguarde o e-mail de confirmação.',
    },
    {
        question: 'Como encontrar um estabelecimento?',
        answer: 'Basta acessar no menu lateral -> Pesquisa e ativar a localização do seu dispositivo e fazer uma busca por exemplo "Drogasil" e mostramos a lista de estabelecimentos próximos a você.',
    },
    {
        question: 'Posso salvar meus locais favoritos?',
        answer: 'Sim, acesse sua conta, clique na estrela em qualquer card de local para salvar e revisite a aba de favoritos no menu.',
    },
    {
        question: 'Como posso entrar em contato com o suporte?',
        answer: 'Você pode entrar em contato com o suporte através do menu "Ajuda" ou enviando um e-mail para suporte@bgt.com.br.',
    },
];
const normalizeText = (text = '') => text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const PREPARED_CHAT_ENTRIES = CHAT_ENTRIES.map((entry) => ({
    ...entry,
    normalizedQuestion: normalizeText(entry.question),
}));

const calculateLevenshtein = (a = '', b = '') => {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i += 1) {
        matrix[i][0] = i;
    }
    for (let j = 0; j < cols; j += 1) {
        matrix[0][j] = j;
    }
    for (let i = 1; i < rows; i += 1) {
        for (let j = 1; j < cols; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost,
            );
        }
    }
    return matrix[rows - 1][cols - 1];
};

const getDistanceThreshold = (messageLength = 0, entryLength = 0) => {
    const base = Math.floor(Math.max(messageLength, entryLength, 4) * 0.25);
    return Math.max(2, Math.min(6, base + 1));
};

const findClosestEntry = (message) => {
    let best = { entry: null, distance: Infinity };
    PREPARED_CHAT_ENTRIES.forEach((entry) => {
        const distance = calculateLevenshtein(message, entry.normalizedQuestion);
        const threshold = getDistanceThreshold(message.length, entry.normalizedQuestion.length);
        if (distance < best.distance && distance <= threshold) {
            best = { entry, distance };
        }
    });
    return best.entry;
};

function renderChatbot() {
    if (document.querySelector('#project-chatbot')) {
        return;
    }

    const root = document.createElement('div');
    root.id = 'project-chatbot';
    root.className = 'project-chatbot';
    root.innerHTML = `
        <button class="chat-toggle" type="button" aria-label="Abrir assistente">
            <img src="${CHATBOT_LOGO}" alt="Logo do assistente PI">
        </button>
        <div class="chat-window" aria-hidden="true">
            <header class="chat-window__header">
                <span class="chat-back" aria-label="Voltar">←</span>
                <div class="chat-header__info">
                    <strong class="chat-window__title">Assistente Virtual</strong>
                    <span class="chat-window__subtitle">BGT</span>
                </div>
                <button class="chat-close" type="button" aria-label="Fechar conversa">✕</button>
            </header>
            <div class="chat-window__body">
                <div class="chat-messages" role="log" aria-live="polite"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Escreva sua mensagem..." aria-label="Mensagem para o assistente">
                </div>
                <button class="chat-end" type="button" hidden>Encerrar conversa</button>
            </div>
        </div>
    `;

    document.body.appendChild(root);

    const toggle = root.querySelector('.chat-toggle');
    const panel = root.querySelector('.chat-window');
    const closeButton = root.querySelector('.chat-close');
    const messages = root.querySelector('.chat-messages');
    const input = root.querySelector('.chat-input input');
    const chatEndButton = root.querySelector('.chat-end');

    const appendMessage = (text, sender, { autoOpen = true } = {}) => {
        const message = document.createElement('div');
        message.className = `chat-message chat-message--${sender}`;
        if (sender === 'bot') {
            const avatar = document.createElement('img');
            avatar.className = 'chat-message__avatar';
            avatar.src = CHATBOT_AVATAR;
            avatar.alt = 'Assistente Virtual';
            message.appendChild(avatar);
        }
        const bubble = document.createElement('div');
        bubble.className = 'chat-message__bubble';
        bubble.textContent = text;
        message.appendChild(bubble);
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        if (autoOpen) {
            root.classList.add('is-open');
            panel.setAttribute('aria-hidden', 'false');
        }
    };

    let firstMessageSent = false;

    const resetChatHistory = () => {
        messages.innerHTML = '';
        firstMessageSent = false;
        chatEndButton.hidden = true;
        appendMessage('Olá! 😊 Como posso ajudar você hoje?', 'bot', { autoOpen: false });
    };

    resetChatHistory();

    const openPanel = () => {
        root.classList.toggle('is-open');
        const isOpen = root.classList.contains('is-open');
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    const closePanel = () => {
        root.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        chatEndButton.hidden = true;
        firstMessageSent = false;
    };

    const getAnswerFor = (message) => {
        const normalizedMessage = normalizeText(message);
        if (!normalizedMessage) {
            return { answer: null };
        }
        const exactMatch = PREPARED_CHAT_ENTRIES.find((entry) => entry.normalizedQuestion === normalizedMessage);
        if (exactMatch) {
            return { answer: exactMatch.answer };
        }
        const containsMatch = PREPARED_CHAT_ENTRIES.find((entry) => entry.normalizedQuestion.includes(normalizedMessage));
        if (containsMatch) {
            return { answer: containsMatch.answer };
        }
        const reverseMatch = PREPARED_CHAT_ENTRIES.find((entry) => normalizedMessage.includes(entry.normalizedQuestion));
        if (reverseMatch) {
            return { answer: reverseMatch.answer };
        }
        const closestEntry = findClosestEntry(normalizedMessage);
        if (closestEntry) {
            return { answer: closestEntry.answer };
        }
        return { answer: null };
    };

    const handleSend = () => {
        const message = input.value.trim();
        if (!message) {
            return;
        }
        appendMessage(message, 'user');
        if (!firstMessageSent) {
            firstMessageSent = true;
            chatEndButton.hidden = false;
        }
        const { answer } = getAnswerFor(message);
        setTimeout(() => {
            if (answer) {
                appendMessage(answer, 'bot');
                return;
            }
            appendMessage('Não entendi sua mensagem, pergunte novamente.', 'bot');
        }, 220);
        input.value = '';
    };

    toggle.addEventListener('click', openPanel);
    closeButton.addEventListener('click', closePanel);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });

    chatEndButton.addEventListener('click', () => {
        resetChatHistory();
        closePanel();
    });

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            closePanel();
        }
    });
}

document.addEventListener('DOMContentLoaded', renderChatbot);
if (document.readyState !== 'loading') {
    renderChatbot();
}
