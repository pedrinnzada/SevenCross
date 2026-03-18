/* ═══════════════════════════════════════════════════════════
   SEVEN CROSS — main.js
   Animations, Three.js, GSAP, Chatbot, Interactions
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Wait for DOM ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupLoader();
    setupCustomCursor();
    setupNav();
    setupHeroCanvas();
    setupWaveCanvas();
    setupLetterSplit();
    setupScrollAnimations();
    setupCounters();
    setupTiltCards();
    setupPlanosReveal();
    setupDepoimentos();
    setupChatbot();
    setupWhatsAppFloat();
    setupHamburger();
    setupCtaCanvas();
  }

  /* ─── 1. LOADER ─────────────────────────────────────────── */
  function setupLoader() {
    const loader   = document.getElementById('loader');
    const fill     = document.getElementById('loaderFill');
    const textEl   = document.getElementById('loaderText');
    const messages = ['Iniciando motores...', 'Carregando potência...', 'Preparando ambiente...', 'Pronto para treinar!'];
    let progress   = 0;
    let msgIdx     = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress > 100) progress = 100;
      fill.style.width = progress + '%';

      const newMsgIdx = Math.min(Math.floor(progress / 25), messages.length - 1);
      if (newMsgIdx !== msgIdx) {
        msgIdx = newMsgIdx;
        textEl.textContent = messages[msgIdx];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          startHeroEntrance();
        }, 400);
      }
    }, 80);
  }

  /* ─── 2. HERO ENTRANCE ──────────────────────────────────── */
  function startHeroEntrance() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-tag',     { opacity: 0, y: 20, duration: 0.8 })
      .from('.title-word',   { opacity: 0, y: 60, stagger: 0.15, duration: 1 }, '-=0.4')
      .from('.hero-tagline', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
      .from('.hero-sub',     { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
      .from('.hero-ctas',    { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
      .from('.hero-stats',   { opacity: 0, y: 20, duration: 0.7 }, '-=0.3');
  }

  /* ─── 3. CUSTOM CURSOR ──────────────────────────────────── */
  function setupCustomCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Interactive cursor on hoverable elements
    document.querySelectorAll('a, button, .plano-card, .dep-card, .galeria-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width   = '20px';
        cursor.style.height  = '20px';
        follower.style.width  = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'rgba(123,44,255,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width   = '10px';
        cursor.style.height  = '10px';
        follower.style.width  = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'rgba(123,44,255,0.6)';
      });
    });
  }

  /* ─── 4. NAVIGATION ─────────────────────────────────────── */
  function setupNav() {
    const nav = document.getElementById('nav');
    const threshold = 60;

    window.addEventListener('scroll', () => {
      if (window.scrollY > threshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ─── 5. HAMBURGER ──────────────────────────────────────── */
  function setupHamburger() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── 6. HERO CANVAS (Three.js particle field) ──────────── */
  function setupHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Particle system
    const particleCount = 1800;
    const positions  = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const r = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x7b2cff,
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Inner glow sphere
    const sphereGeo  = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMat  = new THREE.MeshBasicMaterial({
      color: 0x7b2cff,
      transparent: true,
      opacity: 0.04,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Mouse interaction
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    document.addEventListener('mousemove', (e) => {
      targetRotY = (e.clientX / window.innerWidth  - 0.5) * 0.4;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.2;
    });

    // Clock
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);
      time += 0.005;

      // Smooth rotation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      particles.rotation.x = currentRotX + Math.sin(time * 0.3) * 0.05;
      particles.rotation.y = currentRotY + time * 0.05;

      sphere.rotation.y = time * 0.3;
      sphere.scale.setScalar(1 + Math.sin(time * 0.8) * 0.05);

      // Update particle positions (gentle drift)
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3]     += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        const dist = Math.sqrt(
          pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2
        );

        if (dist > 10) {
          pos[i * 3]     *= 0.95;
          pos[i * 3 + 1] *= 0.95;
          pos[i * 3 + 2] *= 0.95;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  /* ─── 7. WAVE CANVAS (fluid waves) ──────────────────────── */
  function setupWaveCanvas() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    let time = 0;

    function drawWaves() {
      ctx.clearRect(0, 0, W, H);

      const waves = [
        { amp: 40, freq: 0.008, speed: 0.02, opacity: 0.25, color: '123,44,255' },
        { amp: 28, freq: 0.012, speed: 0.03, opacity: 0.18, color: '159,92,255' },
        { amp: 18, freq: 0.018, speed: 0.04, opacity: 0.12, color: '200,150,255' },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, H / 2);

        for (let x = 0; x <= W; x++) {
          const y = H / 2
            + Math.sin(x * wave.freq + time * wave.speed) * wave.amp
            + Math.sin(x * wave.freq * 2.1 + time * wave.speed * 1.4) * (wave.amp * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,   `rgba(${wave.color},0)`);
        grad.addColorStop(0.2, `rgba(${wave.color},${wave.opacity})`);
        grad.addColorStop(0.8, `rgba(${wave.color},${wave.opacity})`);
        grad.addColorStop(1,   `rgba(${wave.color},0)`);

        ctx.fillStyle = grad;
        ctx.fill();
      });

      time += 1;
      requestAnimationFrame(drawWaves);
    }

    drawWaves();

    window.addEventListener('resize', () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    });
  }

  /* ─── 8. CTA CANVAS (subtle animated bg) ────────────────── */
  function setupCtaCanvas() {
    const canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    let time = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Dark gradient bg
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.8);
      bg.addColorStop(0, 'rgba(123,44,255,0.15)');
      bg.addColorStop(1, 'rgba(10,10,10,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Animated rings
      for (let i = 0; i < 4; i++) {
        const r = 80 + i * 80 + Math.sin(time * 0.02 + i) * 20;
        const alpha = 0.08 - i * 0.015;
        ctx.beginPath();
        ctx.arc(W/2, H/2, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123,44,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      time++;
      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    });
  }

  /* ─── 9. LETTER SPLIT (interactive typography) ──────────── */
  function setupLetterSplit() {
    const titleWords = document.querySelectorAll('.title-word');

    titleWords.forEach(word => {
      const text = word.getAttribute('data-word') || word.textContent;
      word.innerHTML = '';

      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.style.transitionDelay = `${i * 0.03}s`;
        word.appendChild(span);
      });
    });

    // Mouse interaction on hero title
    const heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) return;

    heroTitle.addEventListener('mousemove', (e) => {
      const letters = heroTitle.querySelectorAll('.letter');
      const rect    = heroTitle.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      letters.forEach(letter => {
        const lr   = letter.getBoundingClientRect();
        const lx   = lr.left + lr.width  / 2 - rect.left;
        const ly   = lr.top  + lr.height / 2 - rect.top;
        const dist = Math.hypot(mx - lx, my - ly);
        const force= Math.max(0, 1 - dist / 160);

        const angle = Math.atan2(ly - my, lx - mx);
        const push  = force * 30;

        letter.style.transform = `translate(${Math.cos(angle) * push}px, ${Math.sin(angle) * push}px) scale(${1 + force * 0.3})`;
        letter.style.color     = force > 0.3 ? '#9f5cff' : '';
        letter.style.textShadow= force > 0.3 ? `0 0 ${30 * force}px rgba(123,44,255,0.8)` : '';
      });
    });

    heroTitle.addEventListener('mouseleave', () => {
      heroTitle.querySelectorAll('.letter').forEach(letter => {
        letter.style.transform  = '';
        letter.style.color      = '';
        letter.style.textShadow = '';
      });
    });
  }

  /* ─── 10. SCROLL ANIMATIONS ─────────────────────────────── */
  function setupScrollAnimations() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseFloat(delay) * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── 11. COUNTERS ──────────────────────────────────────── */
  function setupCounters() {
    const counters = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          let current  = 0;
          const step   = target / 60;
          const timer  = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString('pt-BR');
          }, 24);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ─── 12. TILT CARDS (3D effect) ────────────────────────── */
  function setupTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX *  8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = `${rotateY * -2}px ${rotateX * 2}px 30px rgba(123,44,255,0.2)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ─── 13. PLANOS DELAY REVEAL ───────────────────────────── */
  function setupPlanosReveal() {
    const cards = document.querySelectorAll('.plano-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity  = '1';
            entry.target.style.transform = entry.target.classList.contains('plano-featured')
              ? 'scale(1.04)'
              : 'translateY(0)';
            entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          }, idx * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(30px)';
      observer.observe(card);
    });
  }

  /* ─── 14. DEPOIMENTOS SLIDER ────────────────────────────── */
  function setupDepoimentos() {
    const track  = document.getElementById('depTrack');
    const dotsEl = document.getElementById('depDots');
    const prev   = document.getElementById('depPrev');
    const next   = document.getElementById('depNext');

    if (!track || !dotsEl) return;

    const cards    = track.querySelectorAll('.dep-card');
    const total    = cards.length;
    let current    = 0;
    let perView    = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
    const maxIndex = total - perView;

    // Create dots
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.className = 'dep-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardW    = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW}px)`;

      dotsEl.querySelectorAll('.dep-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    // Auto-slide
    let autoPlay = setInterval(() => goTo(current + 1 > maxIndex ? 0 : current + 1), 4500);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goTo(current + 1 > maxIndex ? 0 : current + 1), 4500);
    });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    window.addEventListener('resize', () => {
      perView = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
      goTo(0);
    });
  }

  /* ─── 15. WHATSAPP FLOAT ────────────────────────────────── */
  function setupWhatsAppFloat() {
    const waFloat = document.getElementById('waFloat');
    if (!waFloat) return;

    // Show after 3s
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'translateY(20px) scale(0.8)';
    waFloat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      waFloat.style.opacity   = '1';
      waFloat.style.transform = 'translateY(0) scale(1)';
    }, 3000);
  }

  /* ─── 16. CHATBOT ───────────────────────────────────────── */
  function setupChatbot() {
    const btn     = document.getElementById('chatbotBtn');
    const win     = document.getElementById('chatbotWindow');
    const close   = document.getElementById('chatClose');
    const input   = document.getElementById('chatInput');
    const send    = document.getElementById('chatSend');
    const msgs    = document.getElementById('chatMessages');
    const qrEl    = document.getElementById('quickReplies');

    if (!btn || !win) return;

    // Toggle
    btn.addEventListener('click', () => {
      win.classList.toggle('open');
      const notif = btn.querySelector('.chat-notif');
      if (notif) notif.style.display = 'none';
      if (win.classList.contains('open') && input) input.focus();
    });

    close.addEventListener('click', () => win.classList.remove('open'));

    // Quick replies
    if (qrEl) {
      qrEl.querySelectorAll('.quick-btn').forEach(qBtn => {
        qBtn.addEventListener('click', () => {
          const key = qBtn.dataset.msg;
          addUserMsg(qBtn.textContent.trim());
          qrEl.remove();
          typingThenRespond(getBotResponse(key));
        });
      });
    }

    // Send
    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addUserMsg(text);
      input.value = '';
      typingThenRespond(getBotResponse(text.toLowerCase()));
    }

    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    function addUserMsg(text) {
      const div = document.createElement('div');
      div.className = 'chat-msg user';
      div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function addBotMsg(text) {
      const div = document.createElement('div');
      div.className = 'chat-msg bot';
      div.innerHTML = `<div class="msg-bubble">${text}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function typingThenRespond(response) {
      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'chat-msg bot typing-indicator';
      typing.innerHTML = `<div class="msg-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(() => {
        typing.remove();
        addBotMsg(response);
      }, 900 + Math.random() * 500);
    }

    function getBotResponse(key) {
      const kb = {
        planos: `🏷️ <strong>Nossos Planos:</strong><br><br>🌱 <strong>Mensal</strong> – R$149/mês<br>🔥 <strong>Premium</strong> – R$229/mês (aulas + personal)<br>💎 <strong>Anual</strong> – R$179/mês (sem matrícula!)<br><br>Quer saber mais? <a href="https://wa.me/5531988077126" target="_blank" style="color:#9f5cff">Fale conosco no WhatsApp</a>`,
        horario: `🕐 <strong>Horário de Funcionamento:</strong><br><br>📅 Seg a Sex: 05h às 23h<br>📅 Sábado: 06h às 20h<br>📅 Domingo: 08h às 14h<br><br>Plano anual inclui acesso 24h! 🚀`,
        localizacao: `📍 <strong>Localização:</strong><br><br>Rua das Flores, 777 – Centro<br>Sete Lagoas, MG – 35701-000<br><br>Ótimo estacionamento e próximo ao centro! 🏋️`,
        contato: `📱 <strong>Fale com a gente:</strong><br><br>WhatsApp: <a href="https://wa.me/5531988077126" target="_blank" style="color:#9f5cff">(31) 98807-7126</a><br><br>Nossa equipe responde em até 5 minutos! ⚡`,
      };

      // Keyword matching
      if (key.includes('plano') || key.includes('preço') || key.includes('valor') || key.includes('mensal') || key.includes('anual') || key.includes('premium') || key.includes('💰')) return kb.planos;
      if (key.includes('horário') || key.includes('horario') || key.includes('hora') || key.includes('funciona') || key.includes('abre') || key.includes('🕐')) return kb.horario;
      if (key.includes('localiz') || key.includes('endereço') || key.includes('onde') || key.includes('📍')) return kb.localizacao;
      if (key.includes('contato') || key.includes('whatsapp') || key.includes('falar') || key.includes('consultor') || key.includes('📱')) return kb.contato;

      return `Olá! 😊 Posso te ajudar com informações sobre <strong>planos</strong>, <strong>horários</strong>, <strong>localização</strong> ou falar com um consultor. O que prefere?`;
    }

    function escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
  }

  /* ─── 17. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── 18. PARALLAX on scroll ────────────────────────────── */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - scrollY / 600) + '';
    }
  }, { passive: true });

})();
