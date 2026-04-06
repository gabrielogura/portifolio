// ── Navbar shrink ao rolar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Fade-up ao entrar na viewport ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-title, .about-text, .about-cards, .project-card, .skills-grid, .contact-desc, .contact-links').forEach((el, i) => {
  el.classList.add('fade-up');
  if (i % 3 === 1) el.classList.add('delay-1');
  if (i % 3 === 2) el.classList.add('delay-2');
  observer.observe(el);
});

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Active link no scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : ''; });
});

// ── Tooltip das skill icons ──
const skillData = {
  'HTML5':      'Linguagem de marcação que estrutura o conteúdo das páginas web.',
  'CSS3':       'Responsável pela aparência visual: cores, layout e animações.',
  'JavaScript': 'Adiciona interatividade e lógica dinâmica no navegador.',
  'React':      'Biblioteca JS para construir interfaces de usuário componentizadas.',
  'Python':     'Linguagem principal do backend. Legível, poderosa e versátil.',
  'Django':     'Framework web Python para construir APIs e backends robustos.',
  'SQLite':     'Banco de dados leve, ideal para desenvolvimento e testes locais.',
  'Flask':      'Micro-framework Python para APIs simples e rápidas.',
  'Docker':     'Empacota aplicações em containers para rodar em qualquer ambiente.',
  'PostgreSQL': 'Banco de dados relacional robusto, usado em produção.',
  'Git':        'Controla o histórico de versões do código.',
  'GitHub':     'Plataforma para hospedar e colaborar em repositórios Git.',
  'VS Code':    'Editor de código leve e altamente extensível.',
  'Vercel':     'Plataforma de deploy com CI/CD automático para o frontend.',
  'Postman':    'Ferramenta para testar e documentar APIs REST.',
  'Axios':      'Cliente HTTP para requisições à API a partir do frontend.',
};

// Card flutuante
const card = document.createElement('div');
card.className = 'skill-card';
card.innerHTML = `<div class="skill-card-icon"><i></i></div><div class="skill-card-body"><strong></strong><p></p></div>`;
document.body.appendChild(card);

let activeIcon = null;
let hideTimer = null;

document.querySelectorAll('.stag-icon').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const name = el.querySelector('span')?.textContent.trim();
    const desc = skillData[name];
    const iconClass = el.querySelector('i')?.className;

    if (activeIcon === el) {
      el.classList.remove('active');
      card.classList.remove('show');
      activeIcon = null;
      clearTimeout(hideTimer);
      return;
    }

    if (activeIcon) activeIcon.classList.remove('active');
    activeIcon = el;
    el.classList.add('active');

    const cardIcon = card.querySelector('.skill-card-icon i');
    cardIcon.className = iconClass || '';
    card.querySelector('strong').textContent = name;
    card.querySelector('p').textContent = desc;

    card.className = 'skill-card';
    if (el.classList.contains('stag-purple')) card.classList.add('card-purple');
    else if (el.classList.contains('stag-teal')) card.classList.add('card-teal');
    else if (el.classList.contains('stag-amber')) card.classList.add('card-amber');

    const rect = el.getBoundingClientRect();
    const cardWidth = Math.min(380, window.innerWidth - 24);
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));
    card.style.width = cardWidth + 'px';
    card.style.left = left + 'px';
    card.style.top = (rect.bottom + window.scrollY + 12) + 'px';
    card.classList.add('show');

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      card.classList.remove('show');
      if (activeIcon) activeIcon.classList.remove('active');
      activeIcon = null;
    }, 4000);
  });
});

document.addEventListener('click', () => {
  card.classList.remove('show');
  if (activeIcon) { activeIcon.classList.remove('active'); activeIcon = null; }
  clearTimeout(hideTimer);
});

// ── NEURAL NETWORK ANIMATION ──
(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes, edges;
  const NODE_COUNT = window.innerWidth < 768 ? 12 : 38;
  const EDGE_DIST  = window.innerWidth < 768 ? 45 : 180;
  const PULSE_SPEED = 0.012;

  const ACCENT  = { r: 124, g: 106, b: 245 }; // roxo
  const ACCENT2 = { r:  79, g: 209, b: 197 }; // ciano

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function init() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1.5,
      pulse: Math.random(),           // fase atual do pulso
      pulseSpeed: PULSE_SPEED * (0.3 + Math.random() * 0.3),
    }));

    // Pulsos viajando pelas arestas
    edges = [];
  }

  function buildEdges() {
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < EDGE_DIST) {
          // chance de ter um pulso viajando
          if (Math.random() < 0.08) {
            edges.push({ i, j, dist, t: Math.random(), speed: PULSE_SPEED * (0.2 + Math.random() * 0.3) });
          } else {
            edges.push({ i, j, dist, t: null });
          }
        }
      }
    }
  }

  function colorStr(c, alpha) {
    return `rgba(${c.r},${c.g},${c.b},${alpha})`;
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.pulse = (n.pulse + n.pulseSpeed) % 1;
    });

    buildEdges();

    // Draw edges + pulses
    edges.forEach(e => {
      const a = nodes[e.i], b = nodes[e.j];
      const alpha = (1 - e.dist / EDGE_DIST) * 0.25;

      // Linha base
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = colorStr(ACCENT, alpha * 2.5);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Pulso viajando
      if (e.t !== null) {
        e.t = (e.t + e.speed) % 1;
        const px = lerp(a.x, b.x, e.t);
        const py = lerp(a.y, b.y, e.t);
        const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
        g.addColorStop(0, colorStr(ACCENT2, 0.95));
        g.addColorStop(1, colorStr(ACCENT2, 0));
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(n => {
      const glow = 0.5 + 0.5 * Math.sin(n.pulse * Math.PI * 2);
      const radius = n.r + glow * 1.5;

      // Halo
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
      g.addColorStop(0, colorStr(ACCENT, 0.04 * glow));
      g.addColorStop(1, colorStr(ACCENT, 0));
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Núcleo
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colorStr(ACCENT2, 0.7 + 0.3 * glow);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
