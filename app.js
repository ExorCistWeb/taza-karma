const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const toast = document.querySelector('.toast');

document.querySelector('#year').textContent = new Date().getFullYear();

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 18);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('span').textContent = isOpen ? 'menu' : 'close';
  mobileMenu.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = 'menu';
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const getScrollAmount = slider => {
  const first = slider.firstElementChild;
  if (!first) return slider.clientWidth * .8;
  const gap = Number.parseFloat(getComputedStyle(slider).gap) || 0;
  return first.getBoundingClientRect().width + gap;
};

document.querySelectorAll('[data-slider]').forEach(slider => {
  const name = slider.dataset.slider;
  const previous = document.querySelector(`[data-slider-prev="${name}"]`);
  const next = document.querySelector(`[data-slider-next="${name}"]`);
  previous?.addEventListener('click', () => slider.scrollBy({ left: -getScrollAmount(slider), behavior: 'smooth' }));
  next?.addEventListener('click', () => slider.scrollBy({ left: getScrollAmount(slider), behavior: 'smooth' }));

  const updateControls = () => {
    if (previous) previous.disabled = slider.scrollLeft < 4;
    if (next) next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 4;
  };
  slider.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});

document.querySelector('.copy-address')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const value = button.dataset.copy;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
  button.querySelector('.copy-icon').textContent = 'check';
  toast.classList.add('show');
  window.setTimeout(() => {
    button.querySelector('.copy-icon').textContent = 'content_copy';
    toast.classList.remove('show');
  }, 1800);
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -35px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}
