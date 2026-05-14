gsap.registerPlugin(ScrollTrigger);

const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

window.closeMobile = () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};

function splitChars(el) {
  if (!el || el.dataset.split === 'true') return;

  Array.from(el.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();

      node.textContent.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        fragment.appendChild(span);
      });

      node.replaceWith(fragment);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
      splitChars(node);
    }
  });

  el.dataset.split = 'true';
}

splitChars(document.getElementById('heroTitle'));
splitChars(document.querySelector('.cta-section__title'));

const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
gsap.set('.hero .reveal', { y: 28, opacity: 0 });

intro
  .from('#heroTitle .char', {
    yPercent: 115,
    opacity: 0,
    duration: .9,
    stagger: .025,
  })
  .to('.hero .reveal', {
    y: 0,
    opacity: 1,
    duration: .75,
    stagger: .12,
  }, '-=.35')
  .from('.hero__counter', {
    x: 70,
    opacity: 0,
    duration: 1,
  }, '-=.8');

gsap.to('.marquee-track', {
  xPercent: -50,
  ease: 'none',
  repeat: -1,
  duration: 28,
});

gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach((el, index) => {
  gsap.set(el, { y: 38, opacity: 0 });

  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 86%',
      toggleActions: 'play none none none',
    },
    y: 0,
    opacity: 1,
    duration: .75,
    delay: Math.min(index * .015, .08),
    ease: 'power3.out',
  });
});

document.querySelectorAll('[data-count]').forEach(el => {
  const target = Number(el.dataset.count);

  ScrollTrigger.create({
    trigger: el,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.to({ value: 0 }, {
        value: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(this.targets()[0].value);
        },
      });
    },
  });
});

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -6, duration: .25, ease: 'power2.out' });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, duration: .25, ease: 'power2.out' });
  });
});

document.querySelectorAll('.project-card').forEach(card => {
  const image = card.querySelector('.project-card__img');

  gsap.to(image, {
    scrollTrigger: {
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: -24,
    scale: 1.04,
    ease: 'none',
  });
});

gsap.from('.cta-section__title .char', {
  scrollTrigger: {
    trigger: '.cta-section__title',
    start: 'top 82%',
  },
  yPercent: 105,
  opacity: 0,
  duration: .65,
  ease: 'power3.out',
  stagger: .018,
});

gsap.from('.footer__inner > *', {
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 92%',
  },
  y: 20,
  opacity: 0,
  duration: .55,
  ease: 'power2.out',
  stagger: .1,
});

if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', event => {
    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: .14,
      ease: 'power2.out',
    });
  });

  document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}
