// Shared site behavior: reveal on scroll + form handling
(function() {
  // Nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.site-header .nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Resources opt-in form
  const form = document.querySelector('.optin-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const optin = form.closest('.optin');
      const success = document.querySelector('.optin-success');
      if (optin && success) {
        const name = form.querySelector('input[name="firstName"]').value || 'Friend';
        const nameSlot = success.querySelector('[data-name]');
        if (nameSlot) nameSlot.textContent = name;
        optin.style.display = 'none';
        success.classList.add('show');
        // Reveal locked resources
        document.querySelectorAll('.lock-resource').forEach(el => el.classList.add('unlocked'));
        window.scrollTo({ top: success.offsetTop - 120, behavior: 'smooth' });
      }
    });
  }

  // MissionBuilder demo: cycle "active" step
  const steps = document.querySelectorAll('.mb-step');
  if (steps.length) {
    let activeIdx = 1;
    setInterval(() => {
      steps.forEach((s, i) => {
        s.classList.remove('active');
        s.classList.toggle('done', i < activeIdx);
      });
      steps[activeIdx].classList.add('active');
      activeIdx = (activeIdx + 1) % steps.length;
    }, 2600);
  }
})();
