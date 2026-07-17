// Interacciones y animaciones ligeras sin librerías externas
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const scrollProgress = document.getElementById('scrollProgress');
const contactForm = document.getElementById('contactForm');
const particlesCanvas = document.getElementById('particles');
const ctx = particlesCanvas.getContext('2d');

const theme = {
  particles: [],
  particleCount: 45,
  width: 0,
  height: 0,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// Actualiza el estado del nav al hacer scroll
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

// Calcula el progreso de scroll y pinta la barra superior
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${width}%`;
}

// Abre o cierra el menú móvil
function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Observador para revelar elementos en scroll
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
  });

  items.forEach((item) => observer.observe(item));
}

// Crea partículas de fondo simples
function createParticles() {
  const { innerWidth: width, innerHeight: height } = window;
  theme.width = width;
  theme.height = height;
  particlesCanvas.width = width * window.devicePixelRatio;
  particlesCanvas.height = height * window.devicePixelRatio;
  particlesCanvas.style.width = `${width}px`;
  particlesCanvas.style.height = `${height}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  theme.particles = Array.from({ length: theme.particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1 + Math.random() * 2,
    speed: 0.15 + Math.random() * 0.35,
    angle: Math.random() * Math.PI * 2,
    alpha: 0.18 + Math.random() * 0.25,
  }));
}

// Dibuja las partículas en canvas
function drawParticles() {
  if (theme.prefersReducedMotion) {
    ctx.clearRect(0, 0, theme.width, theme.height);
    return;
  }

  ctx.clearRect(0, 0, theme.width, theme.height);
  theme.particles.forEach((particle) => {
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;
    particle.angle += 0.002;

    if (particle.x > theme.width + 20) particle.x = -20;
    if (particle.x < -20) particle.x = theme.width + 20;
    if (particle.y > theme.height + 20) particle.y = -20;
    if (particle.y < -20) particle.y = theme.height + 20;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99, 102, 241, ${particle.alpha})`;
    ctx.fill();
  });
}

function animateParticles() {
  drawParticles();
  window.requestAnimationFrame(animateParticles);
}

// Anima la entrada del registro de pipeline
function initPipelineLog() {
  const logItems = document.querySelectorAll('.pipeline-card__log span');
  logItems.forEach((item, index) => {
    setTimeout(() => item.classList.add('visible'), 650 + index * 320);
  });
}

// Abre un mailto con datos del formulario
function handleContactSubmit(event) {
  event.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    alert('Por favor completa todos los campos antes de enviar.');
    return;
  }

  const subject = encodeURIComponent(`Contacto desde portfolio: ${name}`);
  const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
  window.location.href = `mailto:jogregorio297@gmail.com?subject=${subject}&body=${body}`;
}

function init() {
  updateNav();
  updateScrollProgress();
  initReveal();
  initPipelineLog();
  createParticles();
  animateParticles();

  window.addEventListener('scroll', () => {
    updateNav();
    updateScrollProgress();
  });

  window.addEventListener('resize', () => {
    createParticles();
  });

  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  contactForm.addEventListener('submit', handleContactSubmit);
}

document.addEventListener('DOMContentLoaded', init);
