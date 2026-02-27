# BRX Bet - Cassino Online

Site de cassino online completo com roleta de bônus, cadastro de usuários, sistema de depósitos via PIX e saques.

## 🌐 Site Online

Acesse: [https://seu-link-aqui.com](https://seu-link-aqui.com)

---

## 📁 Estrutura do Projeto

```
cassino-brx/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos do site
├── js/
│   └── main.js         # Lógica e funcionalidades
├── images/             # Imagens dos jogos e roleta
│   ├── roleta-bg.jpg
│   ├── game-fortune-tiger.jpg
│   ├── game-fortune-rabbit.jpg
│   ├── game-fortune-ox.jpg
│   ├── game-fortune-mouse.jpg
│   ├── game-fortune-dragon.jpg
│   ├── game-gates-olympus.jpg
│   ├── game-sweet-bonanza.jpg
│   ├── game-starlight-princess.jpg
│   ├── game-big-bass.jpg
│   ├── game-wolf-gold.jpg
│   └── game-book-dead.jpg
└── README.md           # Este arquivo
```

---

## 🚀 Funcionalidades

### 1. Verificação de Idade
- Tela inicial solicitando confirmação de idade (+18)
- Armazenamento no localStorage para não repetir

### 2. Cadastro Simples
- Apenas: Nome de usuário, E-mail, Senha
- Validação de campos
- Armazenamento local

### 3. Roleta de Bônus
- 10 fatias coloridas (estilo pizza)
- **SEMPRE cai em "MIL REAIS" (R$ 10.000)**
- Animação suave com desaceleração
- Efeito de confetes ao ganhar

### 4. Cassino Principal
- Header com saldo e botão de depósito
- Grid de 12 jogos populares
- Navegação por categorias

### 5. Sistema de Depósito (PIX)
- Valores pré-definidos: R$ 20, 50, 75, 100, 200, 400
- Campo para valor personalizado
- Tela de QR Code PIX
- Simulação de processamento

### 6. Bloqueio de Jogos
- **Se não depositou**: Popup pedindo depósito ao clicar em qualquer jogo
- **Se tem saque pendente**: Popup informando para aguardar

### 7. Sistema de Saque
- Saldo precisa ser > R$ 10.100 para sacar
- Se saldo ≤ R$ 10.100: pede depósito de R$ 100
- Formulário: Nome, CPF, Chave PIX, Valor
- Processamento simulado

---

## ⚙️ Configuração do Gateway PIX

### Passo 1: Editar o arquivo `js/main.js`

Localize a linha:
```javascript
const PIX_GATEWAY_URL = 'https://seu-gateway-pix.com/pagamento?valor=';
```

Substitua pelo seu link de gateway:
```javascript
const PIX_GATEWAY_URL = 'https://seu-site.com/pix?amount=';
```

### Passo 2: Descomentar o redirecionamento

Na função `confirmDeposit()`, substitua:
```javascript
// Simula redirecionamento para gateway PIX
setTimeout(() => {
    ...
}, 3000);
```

Por:
```javascript
// Redireciona para gateway PIX
window.location.href = PIX_GATEWAY_URL + amount;
```

---

## 🎨 Personalização

### Cores Principais
Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --primary: #FFD700;        /* Dourado */
    --primary-dark: #FFA500;   /* Laranja */
    --secondary: #FF6B00;      /* Laranja escuro */
    --dark: #0a0a0a;           /* Preto */
    --success: #00C851;        /* Verde */
    --danger: #ff4444;         /* Vermelho */
}
```

### Imagens dos Jogos
Substitua as imagens na pasta `images/` mantendo os mesmos nomes de arquivo.

### Prêmios da Roleta
Edite o array em `js/main.js`:

```javascript
const wheelSlices = [
    { label: 'R$ 1 MILHÃO', sublabel: 'EM SALDO REAL', color: '#1a5f1a', textColor: '#FFD700' },
    { label: 'iPhone 17', sublabel: 'PRO MAX + 5 MIL', color: '#c9a227', textColor: '#000' },
    // ... adicione mais fatias
];
```

### Onde a Roleta Para
Edite a constante:
```javascript
const winningIndex = 3; // 0 a 9 (3 = MIL REAIS)
```

---

## 🌐 Hospedagem no GitHub Pages

### Passo 1: Criar Repositório
1. Acesse [github.com](https://github.com)
2. Crie um novo repositório (ex: `cassino-brx`)
3. Deixe público

### Passo 2: Fazer Upload
1. Baixe este projeto como ZIP
2. Extraia os arquivos
3. No GitHub, clique em "Add file" > "Upload files"
4. Arraste todos os arquivos para a área indicada
5. Clique em "Commit changes"

### Passo 3: Ativar GitHub Pages
1. Vá em **Settings** (configurações do repositório)
2. No menu lateral, clique em **Pages**
3. Em "Source", selecione **Deploy from a branch**
4. Selecione a branch **main** e pasta **/(root)**
5. Clique em **Save**
6. Aguarde alguns minutos e acesse o link gerado

---

## 💻 Edição no Sublime Text

### Abrir Projeto
1. Abra o Sublime Text
2. File > Open Folder...
3. Selecione a pasta `cassino-brx`

### Atalhos Úteis
- `Ctrl+P` - Navegar entre arquivos
- `Ctrl+D` - Selecionar próxima ocorrência
- `Ctrl+Shift+L` - Selecionar todas as ocorrências
- `Ctrl+/` - Comentar/descomentar linha
- `Ctrl+S` - Salvar arquivo
- `Ctrl+Shift+P` - Command Palette

### Editar e Testar
1. Faça as alterações no código
2. Salve com `Ctrl+S`
3. Atualize o navegador (F5)

---

## 📱 Responsivo

O site é totalmente responsivo e funciona em:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (iOS e Android)

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este é um projeto de demonstração. Para uso em produção:

1. ✅ Adicione HTTPS (GitHub Pages já tem)
2. ✅ Implemente backend para autenticação real
3. ✅ Valide todos os inputs no servidor
4. ✅ Use variáveis de ambiente para dados sensíveis
5. ✅ Implemente rate limiting
6. ✅ Adicione proteção contra CSRF/XSS
7. ✅ Use banco de dados real (Firebase, MongoDB, etc.)

---

## 📝 Fluxo do Usuário

```
1. Acessa site
   ↓
2. Confirma idade (+18)
   ↓
3. Cadastra (nome, email, senha)
   ↓
4. Gira roleta → Ganha R$ 10.000
   ↓
5. Vai para cassino
   ↓
6. Tenta jogar → Popup: "Precisa depositar"
   ↓
7. Faz depósito via PIX
   ↓
8. Jogos liberados!
   ↓
9. Quer sacar → Se saldo > 10.100, libera saque
   ↓
10. Saque processado em 24h
```

---

## 🎮 Jogos Incluídos

| Jogo | Provedor |
|------|----------|
| Fortune Tiger | PG Soft |
| Fortune Rabbit | PG Soft |
| Fortune Ox | PG Soft |
| Fortune Mouse | PG Soft |
| Fortune Dragon | PG Soft |
| Gates of Olympus | Pragmatic |
| Sweet Bonanza | Pragmatic |
| Starlight Princess | Pragmatic |
| Big Bass Bonanza | Pragmatic |
| Wolf Gold | Pragmatic |
| Book of Dead | Play'n GO |
| Legacy of Dead | Play'n GO |

---

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato.

---

**Aviso**: Este site é destinado apenas para maiores de 18 anos. Jogue com responsabilidade.

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais.
