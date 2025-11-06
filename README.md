# 🌍 Projeto PI 1.2

Aplicação web desenvolvida como parte da disciplina **Projeto Integrador**, utilizando **Node.js** como servidor para gerenciamento das páginas e recursos.

O sistema permite **visualizar, pesquisar e consultar pontos no mapa**, além de contar com páginas de **login**, **cadastro**, **feed** e **pesquisa**.

---

## ✨ Funcionalidades

- Página de **Login** e **Cadastro** de usuários  
- **Feed** com informações e atualizações
- **Pesquisa** de locais registrados
- **Mapa Interativo** usando arquitetura **MVC** (`mapa/`)
- Exibição detalhada de pontos localizados

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Função |
|-----------|--------|
| **Node.js + Express** | Servidor e roteamento |
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização e layout |
| **JavaScript (ES6)** | Lógica de interface e funcionalidades |
| **MVC (Model-View-Controller)** | Organização do módulo de mapa |

---

## 📁 Estrutura do Projeto

```
projetoPI-1.2/
│
├── server.js              # Ponto de entrada do servidor Node
├── package.json           # Scripts e dependências
│
├── css/                   # Estilos
├── js/                    # Scripts gerais
├── components/            # Componentes reutilizáveis
│
└── mapa/                  # Módulo do mapa em MVC
    ├── app.js
    ├── location.model.js
    ├── location.view.js
    └── location.controller.js
```

---

## ▶️ Como Executar o Projeto

Certifique-se de ter o **Node.js** instalado.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```

3. Acesse no navegador:
   ```
   http://localhost:3000
   ```

> Caso o projeto esteja configurado para outra porta, verifique dentro do arquivo `server.js`.

---

## 🚀 Melhorias Futuras

- Banco de dados para autenticação real
- Painel administrativo
- API para armazenamento e consulta externa
- Tema escuro / UI moderna

---

## 👨‍💻 Autores

Projeto desenvolvido por estudantes da disciplina **Projeto Integrador**.

---

### ⭐ Se este projeto for útil, não esqueça de deixar uma estrela!
