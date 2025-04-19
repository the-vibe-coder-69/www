

// Modal functionality
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.querySelector('.hero-buttons .btn-primary').addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.hero-buttons .btn-outline').addEventListener('click', () => {
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
});

function openLegalDoc(type) {
let content = '';
if (type === 'privacy') {
    content = `
        <h2>Privacy Policy</h2>
        <p>Last updated: April 2025</p>
        <div class="legal-content">
            <h3>1. Information We Collect</h3>
            <p>We collect information that you provide directly to us, including name, email, and business details.</p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services.</p>
            
            <h3>3. Information Sharing</h3>
            <p>We do not sell or share your personal information with third parties.</p>
        </div>
    `;
} else if (type === 'terms') {
    content = `
        <h2>Terms of Service</h2>
        <p>Last updated: April 2025</p>
        <div class="legal-content">
            <h3>1. Services</h3>
            <p>We provide AI-powered chatbot and social media management services.</p>
            
            <h3>2. User Responsibilities</h3>
            <p>Users must provide accurate information and maintain security of their account.</p>
            
            <h3>3. Termination</h3>
            <p>We reserve the right to terminate services for violation of these terms.</p>
        </div>
    `;
}
modalContent.innerHTML = content;
modal.style.display = "block";
}


document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to your server
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });


    // // Header scroll effect
    // const header = document.querySelector('.header');
    // let lastScroll = 0;

    // window.addEventListener('scroll', () => {
    //     const currentScroll = window.pageYOffset;
        
    //     if (currentScroll > lastScroll && currentScroll > 100) {
    //         header.style.transform = 'translateY(-100%)';
    //     } else {
    //         header.style.transform = 'translateY(0)';
    //     }
        
    //     lastScroll = currentScroll;
    // });

    
function openSocialMedia(platform) {
    const urls = {
        twitter: 'https://twitter.com/thevibe',
        linkedin: 'https://linkedin.com/company/thevibe',
        instagram: 'https://instagram.com/thevibe'
    };
    window.open(urls[platform], '_blank');
}

});