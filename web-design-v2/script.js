document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const desktopNav = document.querySelector('.desktop-nav');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      desktopNav.style.display = desktopNav.style.display === 'flex' ? 'none' : 'flex';
      desktopNav.classList.toggle('active');
      
      // Simple animation for the hamburger
      const spans = mobileMenuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('open'));
    });
  }

  // Scroll Reveal Animation (Basic)
  const revealItems = document.querySelectorAll('.pricing-card, .addon-item, .gallery-item, .contact-box');
  
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;
    
    revealItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      
      if (itemTop < triggerBottom) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial styles for reveal
  revealItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Navbar background change on scroll
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.backgroundColor = 'var(--header-bg)';
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.padding = '0';
      header.style.boxShadow = 'none';
    }
  });

  // Smooth Scroll for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, this.getAttribute('href'));
        
        // Close mobile menu if open
        if (desktopNav.classList.contains('active')) {
          desktopNav.classList.remove('active');
          desktopNav.style.display = 'none';
        }
      }
    });
  });
});
