// Mobile menu functionality + All Interactive Features
(function() {
    'use strict';
    
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const canvas = document.getElementById('interactive-canvas');
    const mainImage = document.getElementById('main-project-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const phoneInput = document.getElementById('phone');
    
    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // ACTIVE NAV LINK BASED ON SCROLL
    // ============================================
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').replace('#', '');
            if (href === current) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    
    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION LINKS
    // ============================================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // SMOOTH SCROLL FOR SCROLL INDICATOR
    // ============================================
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const target = scrollIndicator.getAttribute('data-target');
            if (target) {
                const targetSection = document.querySelector(target);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // ============================================
    // INTERACTIVE CANVAS BACKGROUND
    // ============================================
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let mouseActive = false;
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = `rgba(201, 160, 61, ${Math.random() * 0.3 + 0.1})`;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 30 + 1;
            }
            
            update() {
                if (mouseActive) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;
                    
                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = dx / distance || 0;
                        const directionY = dy / distance || 0;
                        
                        this.x -= directionX * force * 2;
                        this.y -= directionY * force * 2;
                    } else {
                        this.x += (this.baseX - this.x) * 0.03;
                        this.y += (this.baseY - this.y) * 0.03;
                    }
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    if (this.x < 0) this.x = width;
                    if (this.x > width) this.x = 0;
                    if (this.y < 0) this.y = height;
                    if (this.y > height) this.y = 0;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                if (mouseActive) {
                    particles.forEach(particle => {
                        const dx = this.x - particle.x;
                        const dy = this.y - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(201, 160, 61, ${0.1 * (1 - distance/100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(this.x, this.y);
                            ctx.lineTo(particle.x, particle.y);
                            ctx.stroke();
                        }
                    });
                }
            }
        }
        
        function initParticles() {
            particles = [];
            const particleCount = Math.min(150, Math.floor((width * height) / 5000));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        }
        
        function handleMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            mouseActive = true;
        }
        
        function handleMouseLeave() {
            mouseActive = false;
        }
        
        function handleTouchMove(e) {
            e.preventDefault();
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.touches[0].clientX - rect.left;
                mouseY = e.touches[0].clientY - rect.top;
                mouseActive = true;
            }
        }
        
        function handleTouchEnd() {
            mouseActive = false;
        }
        
        function animate() {
            if (!ctx) return;
            
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            if (mouseActive) {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
                gradient.addColorStop(0, 'rgba(201, 160, 61, 0.2)');
                gradient.addColorStop(0.5, 'rgba(201, 160, 61, 0.05)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.arc(mouseX, mouseY, 200, 0, Math.PI * 2);
                ctx.fill();
            }
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);
        
        resizeCanvas();
        animate();
        
        window.addEventListener('orientationchange', () => {
            setTimeout(resizeCanvas, 100);
        });
    }
    
    // ============================================
    // IMAGE GALLERY FUNCTIONALITY
    // ============================================
    if (mainImage && thumbnails.length) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const imageUrl = thumb.getAttribute('data-image');
                if (imageUrl) {
                    mainImage.src = imageUrl;
                    
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                }
            });
        });
    }
    
    // ============================================
    // FORM SUBMISSION
    // ============================================
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Log form data (for debugging)
            console.log('Form submitted:', {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                purpose: document.getElementById('purpose')?.value || '',
                message: document.getElementById('message')?.value || ''
            });
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
                
                // Reset phone to +91
                if (phoneInput) {
                    phoneInput.value = '+91 ';
                }
            }, 3000);
        });
    }
    
    // ============================================
    // PHONE NUMBER VALIDATION FOR +91 FORMAT
    // ============================================
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value;
            // Remove all non-numeric characters except +
            let numbers = value.replace(/[^0-9+]/g, '');
            
            // Ensure +91 prefix
            if (!numbers.startsWith('+91')) {
                if (numbers.startsWith('91')) {
                    numbers = '+' + numbers;
                } else {
                    // Extract only digits for the number part
                    const digits = numbers.replace(/[^0-9]/g, '');
                    numbers = '+91 ' + digits;
                }
            }
            
            // Format: +91 followed by 10 digits
            if (numbers.length > 4) {
                const countryCode = numbers.substring(0, 3);
                let rest = numbers.substring(3).replace(/\s/g, '');
                rest = rest.replace(/[^0-9]/g, '');
                if (rest.length > 0) {
                    numbers = countryCode + ' ' + rest.substring(0, 10);
                }
            }
            
            e.target.value = numbers;
        });
        
        // Set initial value
        if (!phoneInput.value) {
            phoneInput.value = '+91 ';
        }
    }
    
    // ============================================
    // WHY CHOOSE US CARDS SCROLL ANIMATION
    // ============================================
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.why-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // ============================================
    // RERA BADGE INTERACTION
    // ============================================
    const reraBadge = document.querySelector('.rera-badge');
    if (reraBadge) {
        reraBadge.addEventListener('mouseenter', () => {
            reraBadge.style.transform = 'scale(1.02)';
            reraBadge.style.transition = 'all 0.3s ease';
        });
        
        reraBadge.addEventListener('mouseleave', () => {
            reraBadge.style.transform = 'scale(1)';
        });
    }
    
    // ============================================
    // INITIAL ACTIVE LINK CHECK
    // ============================================
    updateActiveLink();
    
    // ============================================
    // LOG INITIALIZATION
    // ============================================
    console.log('✅ Praanamrit Engicon - All features initialized');
    console.log('📍 Locations: Patna, Danapur, Naubatpur, Bihta');
    console.log('📞 Contact: +91 94304 11147');
})();