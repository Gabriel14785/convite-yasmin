/* ============================================
   CONVITE YASMIN 15 ANOS — Lógica Principal
   ============================================ */

// === CONFIGURAÇÃO ===
// Coloque aqui a URL do seu Google Apps Script (terminal Google Sheets)
// Deixe vazio pra testar sem backend (localStorage só)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrAJhX6t5bLKNoIU9XxclolfRQ48BMBsbINxV4aaFum8s5sUJqN5t2GNelM5I_sfoU/exec';

const CONFIG = {
  eventDate: new Date('2026-10-04T18:00:00'),
  pixKey: '44792995809',
  scriptUrl: SCRIPT_URL || localStorage.getItem('scriptUrl') || ''
};

// === ESTRELAS DE FUNDO (3 camadas + cadentes) ===
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  // Detecta dispositivo fraco pra reduzir estrelas
  const isLowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                   (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  const factor = isLowEnd ? 0.5 : 1;

  const frag = document.createDocumentFragment();

  // Camada 1: distantes (pequenas, animação lenta)
  for (let i = 0; i < Math.round(350 * factor); i++) {
    const star = document.createElement('div');
    star.className = 'star star-far';
    const size = Math.random() * 1.5 + 0.5;
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*5}s;animation-duration:${4+Math.random()*3}s`;
    frag.appendChild(star);
  }

  // Camada 2: médias
  for (let i = 0; i < Math.round(200 * factor); i++) {
    const star = document.createElement('div');
    star.className = 'star star-mid';
    const size = Math.random() * 2 + 1;
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*4}s;animation-duration:${3+Math.random()*2}s`;
    frag.appendChild(star);
  }

  // Camada 3: grandes/próximas (com halo)
  for (let i = 0; i < Math.round(100 * factor); i++) {
    const star = document.createElement('div');
    star.className = 'star star-near';
    const size = Math.random() * 2 + 2;
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*2}s`;
    frag.appendChild(star);
  }

  // Estrelas brilhantes extras (sempre acesas)
  for (let i = 0; i < Math.round(50 * factor); i++) {
    const star = document.createElement('div');
    star.className = 'star star-bright';
    const size = Math.random() * 1.5 + 1.5;
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%`;
    frag.appendChild(star);
  }

  container.appendChild(frag);

  // Estrelas cadentes
  for (let i = 0; i < 6; i++) {
    const shooting = document.createElement('div');
    shooting.className = 'shooting-star';
    shooting.style.cssText = `top:${Math.random()*40}%;left:${Math.random()*60}%;animation-delay:${i*4+Math.random()*3}s;animation-duration:${3+Math.random()*2}s`;
    container.appendChild(shooting);
  }
}

// === ONDA DE BRILHO NAS ESTRELAS (CSS-only, sem loop JS) ===
function triggerStarWave() {
  const container = document.getElementById('stars');
  if (!container) return;

  container.classList.add('wave-active');

  setTimeout(() => {
    container.classList.remove('wave-active');
  }, 800);
}

// === NAVEGAÇÃO ENTRE TELAS ===
let currentScreen = 0;
const totalScreens = 6;

let isTransitioning = false;

function goToScreen(index) {
  if (index < 0 || index >= totalScreens) return;
  if (isTransitioning) return;
  if (index === currentScreen) return;

  isTransitioning = true;

  const current = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${index}`);

  // Reduz densidade de estrelas em telas internas
  document.body.classList.toggle('inner-screen', index > 0);

  if (current) current.classList.add('leaving');

  // Exit curto (~120ms) - mais fluido
  setTimeout(() => {
    if (current) {
      current.classList.remove('active', 'leaving');
    }
    if (next) {
      next.classList.remove('entering');
      void next.offsetWidth;
      next.classList.add('active', 'entering');
      setTimeout(() => next.classList.remove('entering'), 500);
    }
    currentScreen = index;
    updateDots();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reduz estrelas em telas internas (performance)
    document.body.classList.toggle('inner-screen', index > 0);
    isTransitioning = false;
  }, 120);
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentScreen);
  });
}

// Clique nos dots
document.querySelectorAll('.dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.screen, 10);
    goToScreen(idx);
  });
});

// Botões de próxima tela
document.querySelectorAll('[data-next]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = parseInt(btn.dataset.next, 10);
    goToScreen(next);
  });
});

// Swipe entre telas (mobile)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  // Ignora swipes que começaram dentro do envelope
  const target = e.target;
  if (target && target.closest && target.closest('.envelope-wrapper')) return;

  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;

  if (Math.abs(dx) > 60 && Math.abs(dy) < 50) {
    if (dx < 0) goToScreen(currentScreen + 1);
    else goToScreen(currentScreen - 1);
  }
}, { passive: true });

// === ENVELOPE — sequência de abertura suave ===
const envelope = document.getElementById('envelope');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const tapHint = document.querySelector('.tap-hint');

let isOpening = false;

if (envelopeWrapper) {
  envelopeWrapper.addEventListener('click', () => {
    if (isOpening) return;
    isOpening = true;

    // Etapa 1: shake rápido (0-150ms)
    envelope.classList.add('shaking');
    if (tapHint) tapHint.style.opacity = '0';

    // Mostra o player de música e tenta tocar
    if (musicPlayer) musicPlayer.style.display = 'flex';
    playMusic();

    // Etapa 2: abre o envelope (150ms)
    setTimeout(() => {
      envelope.classList.remove('shaking');
      envelope.classList.add('opened');
    }, 150);

    // Etapa 3: onda de brilho nas estrelas (500ms - mais cedo pra ser mais fluido)
    setTimeout(() => {
      triggerStarWave();
    }, 500);

    // Etapa 4: zoom out do envelope (900ms)
    setTimeout(() => {
      envelopeWrapper.classList.add('zoom-out');
    }, 900);

    // Etapa 5: troca de tela (1100ms)
    setTimeout(() => {
      goToScreen(1);
    }, 1100);

    // Reset completo (1800ms)
    setTimeout(() => {
      envelope.classList.remove('opened', 'shaking');
      envelopeWrapper.classList.remove('zoom-out');
      if (tapHint) tapHint.style.opacity = '';
      isOpening = false;
    }, 1800);
  });
}

// === CONTAGEM REGRESSIVA ===
function updateCountdown() {
  const now = new Date();
  const diff = CONFIG.eventDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-min').textContent = '00';
    document.getElementById('cd-sec').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const sec = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-min').textContent = String(min).padStart(2, '0');
  document.getElementById('cd-sec').textContent = String(sec).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// === COPIAR PIX ===
const copyBtn = document.getElementById('copyPix');
const copyFeedback = document.getElementById('copyFeedback');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.pixKey);
      copyFeedback.classList.add('show');
      setTimeout(() => copyFeedback.classList.remove('show'), 2000);
    } catch (err) {
      // Fallback pra navegadores antigos
      const input = document.createElement('input');
      input.value = CONFIG.pixKey;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      copyFeedback.classList.add('show');
      setTimeout(() => copyFeedback.classList.remove('show'), 2000);
    }
  });
}

// === MÁSCARA DE TELEFONE ===
const telInput = document.getElementById('telefone');
if (telInput) {
  telInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}

// === FORMULÁRIO DE CONFIRMAÇÃO ===
const confirmForm = document.getElementById('confirmForm');
const formMessage = document.getElementById('formMessage');
const thanksArea = document.getElementById('thanksArea');

if (confirmForm) {
  confirmForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !telefone) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Por favor, preencha nome e telefone.';
      return;
    }

    const payload = {
      nome,
      telefone,
      mensagem,
      data: new Date().toISOString()
    };

    // Salva localmente como backup
    saveLocal(payload);

    // Tenta enviar pro backend (Apps Script)
    if (CONFIG.scriptUrl) {
      try {
        const btn = confirmForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        await fetch(CONFIG.scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        showThanks();
      } catch (err) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Erro ao enviar, mas sua confirmação foi salva localmente.';
        setTimeout(showThanks, 2000);
      }
    } else {
      // Sem backend configurado — só mostra agradecimento
      showThanks();
    }
  });
}

function showThanks() {
  confirmForm.style.display = 'none';
  thanksArea.style.display = 'block';
}

function saveLocal(payload) {
  const stored = JSON.parse(localStorage.getItem('yasmin_confirmacoes') || '[]');
  stored.push(payload);
  localStorage.setItem('yasmin_confirmacoes', JSON.stringify(stored));
}

// === TABS DE DRESS CODE ===
const dresscodeTabs = document.querySelectorAll('.dresscode-tab');
const dresscodePanels = document.querySelectorAll('.dresscode-panel');

dresscodeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const gender = tab.dataset.gender;
    dresscodeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    dresscodePanels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel${gender.charAt(0).toUpperCase()}${gender.slice(1)}`);
    if (panel) panel.classList.add('active');
  });
});

// === PLAYER DE MÚSICA ===
const bgMusic = document.getElementById('bgMusic');
const musicPlayer = document.getElementById('musicPlayer');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

let musicStarted = false;

function playMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.35;
  const promise = bgMusic.play();
  if (promise) {
    promise.then(() => {
      musicPlayer.classList.add('playing');
      musicIcon.innerHTML = '&#10073;&#10073;';
    }).catch(() => {
      // Autoplay bloqueado — não mostra erro, só fica no estado de play
      musicIcon.innerHTML = '&#9654;';
      musicPlayer.classList.remove('playing');
    });
  }
}

function pauseMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  musicPlayer.classList.remove('playing');
  musicIcon.innerHTML = '&#9654;';
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });
}

// === INIT ===
createStars();
