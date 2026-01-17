document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Dark Mode Persistence ---
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark');
    if (toggle) toggle.textContent = '☀️';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      toggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // --- 2. Free Trial Form (Local Storage with Success/Failure Popups) ---
  const form = document.getElementById('trial-form');
  const emailField = document.getElementById('email');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const emailValue = emailField.value.trim();

      if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
        alert('❌ Submission Failed: Please enter a valid email address.');
        emailField.focus();
        return;
      }

      try {
        const newSignup = {
          email: emailValue,
          date: new Date().toLocaleString()
        };

        const existingSignups = JSON.parse(localStorage.getItem('trialSignups')) || [];
        existingSignups.push(newSignup);
        localStorage.setItem('trialSignups', JSON.stringify(existingSignups));

        alert(`✅ Success! Your spot is reserved. We've saved ${emailValue} to our list. 🎉`);
        form.reset();

      } catch (error) {
        console.error('Storage Error:', error);
        alert('⚠️ Oops! Something went wrong while saving your request.');
      }
    });
  }

  // --- 3. Gallery Lightbox ---
  const images = document.querySelectorAll('.gallery img');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.getElementById('modal-close');

  if (modal && images.length > 0) {
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Gym workout photo';
        modal.classList.remove('hidden');
        modal.style.display = 'flex'; 
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      });
    }

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    });
  }

  
  
  //  Smooth Scroll for Footer Links
  // This makes clicking "home" or "contacts" in the footer glide smoothly instead of jumping
  const footerLinks = document.querySelectorAll('footer nav a');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If the link is to home.html or index.html, we can scroll to top smoothly
      if (link.getAttribute('href').includes('home') || link.getAttribute('href').includes('index')) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });

  // Social Icons Interaction
  // When hovering over a social icon, it will slightly dim the others to focus on your choice
  const socialIcons = document.querySelectorAll('.social-icons a');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      socialIcons.forEach(other => {
        if (other !== icon) other.style.opacity = '0.5';
      });
      icon.style.transform = 'scale(1.1)';
      icon.style.transition = '0.3s';
    });

    icon.addEventListener('mouseleave', () => {
      socialIcons.forEach(other => other.style.opacity = '1');
      icon.style.transform = 'scale(1)';
    });
  });

  // Dynamic Copyright Year
  // here I made sure the year in my footer is always current
  const copyrightText = document.querySelector('footer p');
  if (copyrightText) {
    const currentYear = new Date().getFullYear();
    copyrightText.innerHTML = `&copy; Marta Tegegne ${currentYear}. All rights reserved.`;
  }
});