/* ============================================
   DASHBOARD — Confirmações Yasmin
   ============================================ */

const DASHBOARD_PASSWORD = 'yasmin15';

// === CONFIGURAÇÃO DO BACKEND ===
// Coloque aqui a URL do seu Google Apps Script (igual à do app.js)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrAJhX6t5bLKNoIU9XxclolfRQ48BMBsbINxV4aaFum8s5sUJqN5t2GNelM5I_sfoU/exec';

function getScriptUrl() {
  return SCRIPT_URL || localStorage.getItem('scriptUrl') || '';
}

function getAdminToken() {
  return localStorage.getItem('adminToken') || DASHBOARD_PASSWORD;
}

// === ESTRELAS DE FUNDO ===
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const starCount = 60;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    container.appendChild(star);
  }
}

// === LOGIN ===
const loginScreen = document.getElementById('loginScreen');
const dashboardContent = document.getElementById('dashboardContent');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

function checkAuth() {
  if (sessionStorage.getItem('yasmin_authed') === 'true') {
    showDashboard();
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const senha = document.getElementById('senha').value;
  if (senha === DASHBOARD_PASSWORD) {
    sessionStorage.setItem('yasmin_authed', 'true');
    showDashboard();
  } else {
    loginError.classList.add('show');
    setTimeout(() => loginError.classList.remove('show'), 2500);
  }
});

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboardContent.style.display = 'block';
  loadConfirmations();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('yasmin_authed');
  location.reload();
});

// === CARREGAR CONFIRMAÇÕES ===
async function loadConfirmations() {
  const body = document.getElementById('confirmationsBody');
  body.innerHTML = '<tr><td colspan="5" class="empty-state">Carregando...</td></tr>';

  const scriptUrl = getScriptUrl();

  if (!scriptUrl) {
    // Modo local: lê do localStorage
    const stored = JSON.parse(localStorage.getItem('yasmin_confirmacoes') || '[]');
    renderTable(stored);
    return;
  }

  try {
    const token = getAdminToken();
    const url = `${scriptUrl}?action=list&token=${encodeURIComponent(token)}`;
    const res = await fetch(url);
    const data = await res.json();
    renderTable(data.confirmations || []);
  } catch (err) {
    body.innerHTML = `<tr><td colspan="5" class="empty-state">Erro ao carregar. Verifique o scriptUrl configurado.<br><br><button class="btn mt-2" onclick="configScript()">Configurar URL do Script</button></td></tr>`;
  }
}

function configScript() {
  const url = prompt('Cole aqui a URL do seu Google Apps Script:');
  if (url) {
    localStorage.setItem('scriptUrl', url);
    location.reload();
  }
}

function renderTable(items) {
  const body = document.getElementById('confirmationsBody');

  if (!items.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhuma confirmação ainda. ✨</td></tr>';
    updateStats([]);
    return;
  }

  // Ordena por data decrescente
  items.sort((a, b) => new Date(b.data) - new Date(a.data));

  body.innerHTML = items.map((item, idx) => {
    const data = new Date(item.data);
    const dataFmt = data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `
      <tr>
        <td>${items.length - idx}</td>
        <td>${escapeHtml(item.nome)}</td>
        <td>${escapeHtml(item.telefone)}</td>
        <td>${item.mensagem ? escapeHtml(item.mensagem) : '<em style="opacity: 0.5">—</em>'}</td>
        <td>${dataFmt}</td>
      </tr>
    `;
  }).join('');

  updateStats(items);
}

function updateStats(items) {
  const hoje = new Date().toDateString();
  const hojeCount = items.filter(i => new Date(i.data).toDateString() === hoje).length;
  const comMsg = items.filter(i => i.mensagem && i.mensagem.trim()).length;

  document.getElementById('statTotal').textContent = items.length;
  document.getElementById('statHoje').textContent = hojeCount;
  document.getElementById('statComMsg').textContent = comMsg;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// === ATUALIZAR ===
document.getElementById('refreshBtn').addEventListener('click', loadConfirmations);

// === INIT ===
createStars();
checkAuth();
