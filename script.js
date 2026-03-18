/* ======================================================
   SEVEN CROSS - ACADEMIA PREMIUM
   JavaScript Principal - Animações, Chatbot, Interações
   ====================================================== */

'use strict';

// ========== LOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

// ========== AOS INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  initCursor();
  initNavbar();
  initHamburger();
  initParticleCanvas();
  initWaveCanvas();
  initDepoimentosSlider();
  initChatbot();
  initScrollReveal();
  initTiltCards();
  initNavLinks();
});

// ========== CUSTOM CURSOR ==========
function initCursor() {
  if (window.innerWidth <= 768) return;

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects on interactive elements
  const interactives = document.querySelectorAll('a, button, .plano-card, .galeria-item, .depoimento-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.opacity = '0.5';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// ========== NAVBAR SCROLL ==========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scroll;
  }, { passive: true });
}

// ========== NAV ACTIVE LINKS ==========
function initNavLinks() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ========== HAMBURGER MENU ==========
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

// ========== PARTICLE CANVAS ==========
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#FF4500' : '#FF8C00';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    const count = Math.min(120, Math.floor(canvas.width * canvas.height / 8000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.1;
          ctx.strokeStyle = '#FF4500';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  const resizeObs = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  resizeObs.observe(canvas.parentElement);
}

// ========== WAVE CANVAS ==========
function initWaveCanvas() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let time = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const waves = [
      { amplitude: 20, frequency: 0.008, speed: 0.02, color: 'rgba(255,69,0,0.15)', yOffset: 0.5 },
      { amplitude: 15, frequency: 0.012, speed: -0.015, color: 'rgba(255,140,0,0.1)', yOffset: 0.45 },
      { amplitude: 25, frequency: 0.006, speed: 0.025, color: 'rgba(255,69,0,0.08)', yOffset: 0.55 },
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height * wave.yOffset +
          Math.sin(x * wave.frequency + time * wave.speed * 100) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    time++;
    requestAnimationFrame(drawWaves);
  }

  resize();
  drawWaves();

  const resizeObs = new ResizeObserver(resize);
  resizeObs.observe(canvas.parentElement);
}

// ========== DEPOIMENTOS SLIDER ==========
function initDepoimentosSlider() {
  const track = document.getElementById('depoimentosTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track) return;

  const cards = track.querySelectorAll('.depoimento-card');
  let current = 0;
  let autoplay;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  resetAutoplay();
}

// ========== SCROLL REVEAL (extra) ==========
function initScrollReveal() {
  const elements = document.querySelectorAll('.plano-card, .feature-item, .info-card, .galeria-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.replace('translateY(20px)', 'translateY(0)');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ========== 3D TILT EFFECT ==========
function initTiltCards() {
  if (window.innerWidth <= 768) return;

  const tiltEls = document.querySelectorAll('.plano-card, .depoimento-card');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = -dy * 5;
      const tiltY = dx * 5;
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s ease';
      setTimeout(() => el.style.transition = '', 400);
    });
  });
}

// ========== CHATBOT ==========
function initChatbot() {
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatbotBox = document.getElementById('chatbotBox');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const quickReplies = document.getElementById('quickReplies');
  const chatBadge = document.getElementById('chatBadge');

  if (!chatbotBtn) return;

  const responses = {
    planos: {
      user: '💰 Ver Planos',
      bot: `💎 <strong>Nossos Planos:</strong><br><br>
🥈 <strong>Mensal Básico — R$ 89/mês</strong><br>
Musculação + avaliação física + Wi-Fi<br><br>
🥇 <strong>Premium — R$ 159/mês</strong><br>
Tudo do básico + todas as aulas coletivas<br><br>
💎 <strong>Anual — R$ 99/mês</strong><br>
Tudo do premium + 2x personal/mês<br><br>
Quer saber mais? <a href="https://wa.me/5531988077126?text=Olá!%20Quero%20saber%20sobre%20os%20planos%20💪" target="_blank" style="color:#FF4500">Fale no WhatsApp 📲</a>`
    },
    horario: {
      user: '🕐 Horários',
      bot: `🕐 <strong>Horário de Funcionamento:</strong><br><br>
⏰ <strong>Segunda a Sexta:</strong> 6h às 22h<br>
🗓 <strong>Sábado:</strong> 8h às 18h<br>
☀️ <strong>Domingo:</strong> 8h às 14h<br><br>
Feriados podem ter horário especial. Confirme pelo WhatsApp! 📲`
    },
    localizacao: {
      user: '📍 Localização',
      bot: `📍 <strong>Localização:</strong><br><br>
Estamos em <strong>Belo Horizonte, MG</strong>.<br><br>
Para o endereço exato e como chegar, entre em contato:<br>
<a href="https://wa.me/5531988077126?text=Olá!%20Qual%20é%20o%20endereço%20da%20Seven%20Cross?%20📍" target="_blank" style="color:#FF4500">Ver endereço no WhatsApp 📲</a>`
    },
    contato: {
      user: '📲 Contato',
      bot: `📲 <strong>Entre em Contato:</strong><br><br>
💬 <strong>WhatsApp:</strong> (31) 98807-7126<br>
📍 <strong>Local:</strong> Belo Horizonte, MG<br><br>
<a href="https://wa.me/5531988077126?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Seven%20Cross%20💪" target="_blank" style="color:#FF4500">Chamar no WhatsApp agora! 🚀</a>`
    },
    modalidades: {
      user: '🏋️ Modalidades',
      bot: `🏋️ <strong>Nossas Modalidades:</strong><br><br>
🏋️‍♂️ Musculação<br>
🥊 Boxe<br>
🧘 Yoga & Pilates<br>
🚴 Spinning<br>
🏃 Funcional<br>
💪 CrossFit<br><br>
Aulas disponíveis nos planos Premium e Anual!`
    }
  };

  // Auto keywords
  const keywordMap = {
    plano: 'planos', preço: 'planos', valor: 'planos', custo: 'planos', mensalidade: 'planos',
    horario: 'horario', 'horário': 'horario', horas: 'horario', abre: 'horario', fecha: 'horario',
    endereço: 'localizacao', onde: 'localizacao', localização: 'localizacao', endereco: 'localizacao',
    contato: 'contato', telefone: 'contato', ligar: 'contato', whatsapp: 'contato',
    aula: 'modalidades', modalidade: 'modalidades', esporte: 'modalidades', atividade: 'modalidades',
  };

  function openChat() {
    chatbotBox.classList.add('open');
    chatBadge.style.display = 'none';
  }

  function closeChat() {
    chatbotBox.classList.remove('open');
  }

  chatbotBtn.addEventListener('click', openChat);
  chatClose.addEventListener('click', closeChat);

  function addMsg(content, isUser = false) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', isUser ? 'user' : 'bot');
    const p = document.createElement('p');
    p.innerHTML = content;
    msg.appendChild(p);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function botTyping(callback) {
    const typing = document.createElement('div');
    typing.classList.add('chat-msg', 'bot');
    typing.id = 'typing';
    typing.innerHTML = '<p style="opacity:0.5; font-style:italic">Seven Bot está digitando...</p>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      const t = document.getElementById('typing');
      if (t) t.remove();
      callback();
    }, 1000);
  }

  function handleReply(key) {
    if (!responses[key]) return;
    addMsg(responses[key].user, true);
    if (quickReplies) quickReplies.style.display = 'none';
    botTyping(() => addMsg(responses[key].bot));
  }

  // Quick reply buttons
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => handleReply(btn.dataset.reply));
  });

  function processInput(text) {
    if (!text.trim()) return;
    addMsg(text, true);
    if (quickReplies) quickReplies.style.display = 'none';
    chatInput.value = '';

    const lower = text.toLowerCase();
    let matched = null;

    for (const [keyword, key] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) { matched = key; break; }
    }

    if (matched) {
      botTyping(() => addMsg(responses[matched].bot));
    } else {
      botTyping(() => addMsg(`Olá! 😊 Não entendi muito bem. Tente perguntar sobre:<br><br>
💰 Planos e preços<br>
🕐 Horário de funcionamento<br>
📍 Localização<br>
📲 Contato<br>
🏋️ Modalidades<br><br>
Ou entre em contato diretamente: <a href="https://wa.me/5531988077126" target="_blank" style="color:#FF4500">WhatsApp 📲</a>`));
    }
  }

  chatSend.addEventListener('click', () => processInput(chatInput.value));
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') processInput(chatInput.value); });
}

// ========== SMOOTH ANCHOR SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========== COUNTER ANIMATION ==========
function animateCounter(el) {
  const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
  if (isNaN(target) || target === 0) return;
  const prefix = el.textContent.includes('+') ? '+' : '';
  const suffix = el.textContent.includes('%') ? '%' : '';
  let start = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = prefix + start.toLocaleString('pt-BR') + suffix;
    if (start >= target) clearInterval(timer);
  }, 20);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat strong').forEach(animateCounter);
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// ========== BUTTON RIPPLE EFFECT ==========
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plano, .btn-whatsapp').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; width:4px; height:4px;
      background:rgba(255,255,255,0.4); border-radius:50%;
      transform:translate(-50%,-50%) scale(0);
      left:${x}px; top:${y}px;
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim { to { transform: translate(-50%,-50%) scale(80); opacity: 0; } }`;
    document.head.appendChild(style);
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ========== NAV ACTIVE STYLE ==========
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--primary) !important; }`;
document.head.appendChild(navStyle);

console.log('%c🔥 SEVEN CROSS - Academia Premium', 'color:#FF4500; font-size:18px; font-weight:bold;');
console.log('%cDesenvolvido por Pedro Nascimento 🚀', 'color:#FF8C00; font-size:12px;');
