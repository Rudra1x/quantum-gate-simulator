// Quantum Portfolio - Advanced Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactions
    initializeLoadingScreen();
    initializeNavigation();
    initializeTypingAnimation();
    initializeCounters();
    initializeSkillBars();
    initializeParticleBackground();
    initializeScrollAnimations();
    initializeQuantumEffects();
    initializeContactForm();
    initializeModal();
    initializeQuantumRipples();
    initializeGlitchEffects();
});

// Loading Screen Animation
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.querySelector('.loading-text');
    
    const loadingSteps = [
        'Initializing Quantum State...',
        'Entangling Qubits...',
        'Calibrating Bloch Sphere...',
        'Loading Quantum Gates...',
        'Preparing Superposition...',
        'Portfolio Ready!'
    ];
    
    let currentStep = 0;
    
    const updateLoadingText = () => {
        if (currentStep < loadingSteps.length - 1) {
            loadingText.textContent = loadingSteps[currentStep];
            currentStep++;
            setTimeout(updateLoadingText, 800);
        } else {
            loadingText.textContent = loadingSteps[currentStep];
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'visible';
                }, 500);
            }, 1000);
        }
    };
    
    updateLoadingText();
}

// Navigation System
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scrolling and section switching
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            navigateToSection(targetSection);
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Section Navigation
function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section with animation
    setTimeout(() => {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Typing Animation
function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    const phrases = [
        'Quantum Algorithm Developer',
        'Qubit Manipulator',
        'Superposition Engineer',
        'Entanglement Specialist',
        'Quantum Circuit Designer',
        'Future Technology Pioneer'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBar = (skillBar) => {
        const width = skillBar.getAttribute('data-width');
        skillBar.style.width = width;
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateSkillBar(entry.target);
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    });
    
    skillBars.forEach(skillBar => observer.observe(skillBar));
}

// Particle Background Animation
function initializeParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsl(${190 + Math.random() * 60}, 70%, 60%)`,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = particle.color;
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .research-paper, .concept-item, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => observer.observe(element));
}

// Quantum Effects
function initializeQuantumEffects() {
    // Quantum state animation for Bloch sphere
    const quantumState = document.querySelector('.quantum-state');
    if (quantumState) {
        setInterval(() => {
            const randomX = Math.random() * 80 + 10;
            const randomY = Math.random() * 80 + 10;
            quantumState.style.left = randomX + '%';
            quantumState.style.top = randomY + '%';
        }, 3000);
    }
    
    // Project preview animations
    const circuitDemo = document.querySelector('.quantum-circuit-demo');
    if (circuitDemo) {
        setInterval(() => {
            circuitDemo.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }, 2000);
    }
    
    // Quantum aura rotation
    const quantumAura = document.querySelector('.quantum-aura');
    if (quantumAura) {
        let rotation = 0;
        setInterval(() => {
            rotation += 1;
            quantumAura.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('quantum-contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Enhanced form interactions
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add submission animation
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;
        
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Message Sent!';
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
                
                // Remove form classes
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused', 'has-value');
                });
            }, 2000);
        }, 2000);
    });
}

// Modal System
function initializeModal() {
    const modal = document.getElementById('simulator-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Launch Simulator
function launchSimulator() {
    const modal = document.getElementById('simulator-modal');
    const iframe = document.getElementById('simulator-frame');
    
    // In a real implementation, this would load your Streamlit app
    iframe.src = 'about:blank'; // Placeholder
    modal.style.display = 'block';
    
    // Add some demo content to the iframe
    setTimeout(() => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <html>
                <head>
                    <title>Quantum Simulator Demo</title>
                    <style>
                        body {
                            font-family: 'Inter', sans-serif;
                            background: #0a0a0a;
                            color: white;
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        .demo-circuit {
                            width: 400px;
                            height: 200px;
                            border: 2px solid #00d4ff;
                            border-radius: 10px;
                            background: rgba(0, 212, 255, 0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 20px 0;
                            position: relative;
                        }
                        .qubit-line {
                            width: 80%;
                            height: 2px;
                            background: #00d4ff;
                            position: relative;
                        }
                        .gate {
                            position: absolute;
                            left: 30%;
                            top: -15px;
                            width: 30px;
                            height: 30px;
                            background: #ff006e;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                        }
                        .info {
                            text-align: center;
                            color: #b3b3b3;
                        }
                        h2 {
                            color: #00d4ff;
                            font-family: 'Orbitron', monospace;
                        }
                    </style>
                </head>
                <body>
                    <h2>Quantum Gate Simulator Demo</h2>
                    <div class="demo-circuit">
                        <div class="qubit-line">
                            <div class="gate">H</div>
                        </div>
                    </div>
                    <div class="info">
                        <p>This is a demo of the quantum circuit simulator.</p>
                        <p>The actual simulator would run your Streamlit application.</p>
                        <p>Circuit shown: |0⟩ → H → |+⟩</p>
                    </div>
                </body>
            </html>
        `);
        iframeDoc.close();
    }, 100);
}

// Quantum Ripple Effects
function initializeQuantumRipples() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.quantum-btn')) {
            const button = e.target.closest('.quantum-btn');
            const ripple = button.querySelector('.quantum-ripple');
            
            if (ripple) {
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1';
                
                // Trigger animation
                setTimeout(() => {
                    ripple.style.transform = 'scale(4)';
                    ripple.style.opacity = '0';
                }, 10);
            }
        }
    });
}

// Glitch Effects
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        setInterval(() => {
            element.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff006e,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00d4ff
            `;
            
            setTimeout(() => {
                element.style.textShadow = 'none';
            }, 100);
        }, 3000 + Math.random() * 2000);
    });
}

// Mouse tracking for quantum effects
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Update quantum background based on mouse position
    const quantumBg = document.getElementById('quantum-bg');
    if (quantumBg) {
        quantumBg.style.background = `
            radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, rgba(0, 212, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at ${(1-mouseX) * 100}% ${(1-mouseY) * 100}%, rgba(255, 0, 110, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(131, 56, 236, 0.1) 0%, transparent 50%)
        `;
    }
    
    // Parallax effect for Bloch sphere
    const blochSphere = document.querySelector('.bloch-sphere');
    if (blochSphere) {
        const xRotation = (mouseY - 0.5) * 20;
        const yRotation = (mouseX - 0.5) * 20;
        blochSphere.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    switch(key) {
        case '1':
            navigateToSection('home');
            break;
        case '2':
            navigateToSection('about');
            break;
        case '3':
            navigateToSection('projects');
            break;
        case '4':
            navigateToSection('skills');
            break;
        case '5':
            navigateToSection('research');
            break;
        case '6':
            navigateToSection('contact');
            break;
        case 'escape':
            const modal = document.getElementById('simulator-modal');
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
            break;
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
const handleResize = debounce(() => {
    // Recalculate any size-dependent animations
    console.log('Window resized, recalculating animations...');
}, 250);

window.addEventListener('resize', handleResize);

// Intersection Observer for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

// Theme toggle (bonus feature)
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// Export functions for global access
window.navigateToSection = navigateToSection;
window.launchSimulator = launchSimulator;
window.toggleTheme = toggleTheme;

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Activate quantum mode!
        document.body.classList.add('quantum-mode');
        alert('🚀 Quantum Mode Activated! Welcome to the quantum realm!');
        konamiCode = [];
    }
});

// Console message for developers
console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                          🌌 QUANTUM PORTFOLIO 🌌                           ║
║                                                                              ║
║  Built with cutting-edge web technologies and quantum-inspired design       ║
║  Features: Advanced animations, particle systems, interactive effects       ║
║                                                                              ║
║  Press 1-6 to navigate sections • Try the Konami code for a surprise!      ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);