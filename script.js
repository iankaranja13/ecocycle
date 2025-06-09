// Global Variables
let currentSlide = 0;
const totalSlides = 3;
let visitorCount = 0;
let chatbotContext = '';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('themeToggle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const carousel = document.querySelector('.carousel');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const audienceBlocks = document.querySelectorAll('.audience-block');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.getElementById('contactForm');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');
const backToTop = document.getElementById('backToTop');
const visitorCountElement = document.getElementById('visitorCount');
const questionButtons = document.querySelectorAll('.question-btn');
const errorMessageChat = document.getElementById('errorMessage');

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeVisitorCounter();
    initializeTheme();
    initializeCarousel();
    initializeAudienceToggle();
    initializeFAQ();
    initializeContactForm();
    initializeChatbot();
    initializeScrollEffects();
    initializeSmoothScroll();
    initializeMobileMenu();
    loadChatbotContext();
});

// Load chatbot context
async function loadChatbotContext() {
    try {
        const response = await fetch('context.txt');
        if (response.ok) {
            chatbotContext = await response.text();
            console.log('Chatbot context loaded successfully');
        } else {
            throw new Error('Failed to load context file');
        }
    } catch (error) {
        console.error('Error loading chatbot context:', error);
        // Fallback context if file loading fails
        chatbotContext = `You are EcoBot, the AI assistant for EcoCycle. EcoCycle is an environmental startup founded by Ian Wainwright, Jane Mavende, and David Kimbani. We reward people for recycling through our app with QR scanning, points system, and green wallet. Our mission is making sustainability accessible and rewarding. We serve students and families, helping them earn rewards while protecting the environment.`;
    }
}

// Visitor Counter
function initializeVisitorCounter() {
    visitorCount = localStorage.getItem('ecocycle-visitor-count');
    if (!visitorCount) {
        visitorCount = 1;
    } else {
        visitorCount = parseInt(visitorCount) + 1;
    }
    localStorage.setItem('ecocycle-visitor-count', visitorCount);
    visitorCountElement.textContent = visitorCount.toLocaleString();
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('ecocycle-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ecocycle-theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile Menu
function initializeMobileMenu() {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });
}

// Carousel Functionality
function initializeCarousel() {
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Auto-advance carousel
    setInterval(nextSlide, 5000);

    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault();
    });

    carousel.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

// Audience Toggle
function initializeAudienceToggle() {
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetAudience = this.getAttribute('data-audience');
            
            // Update button states
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            audienceBlocks.forEach(block => {
                block.classList.remove('active');
                if (block.id === `${targetAudience}-content`) {
                    block.classList.add('active');
                }
            });
        });
    });
}

// FAQ Accordion
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

// Contact Form Validation
function initializeContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        
        // Validate name
        if (!name) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        // Validate message
        if (!message) {
            document.getElementById('messageError').textContent = 'Message is required';
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Chatbot Functionality
function initializeChatbot() {
    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) {
            showErrorMessage('Please enter a question before sending.');
            return;
        }

        // Clear any previous error messages
        hideErrorMessage();

        // Add user message
        addMessage(message, true);
        chatInput.value = '';

        // Show typing indicator
        const typingIndicator = addTypingIndicator();

        try {
            // Wait for context to be loaded
            if (!chatbotContext) {
                await loadChatbotContext();
            }

            // Make API call to Puter.js
            const response = await puter.ai.chat([
                {
                    role: 'system',
                    content: chatbotContext
                },
                {
                    role: 'user',
                    content: message
                }
            ]);

            // Remove typing indicator
            removeTypingIndicator(typingIndicator);

            // Add bot response
            addMessage(response, false);

        } catch (error) {
            console.error('Chatbot error:', error);
            removeTypingIndicator(typingIndicator);
            addMessage("I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our team directly through the contact form.", false);
            showErrorMessage('Connection error. Please try again.');
        }
    }

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    function showErrorMessage(message) {
        errorMessageChat.textContent = message;
        errorMessageChat.style.display = 'block';
        setTimeout(hideErrorMessage, 5000);
    }

    function hideErrorMessage() {
        errorMessageChat.style.display = 'none';
    }

    // Event listeners
    sendMessage.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Sample question buttons
    questionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatInput.value = question;
            sendChatMessage();
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scroll Navigation
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Console welcome message
console.log('%c🌍 Welcome to EcoCycle! 🌍', 'color: #16a34a; font-size: 20px; font-weight: bold;');
console.log('%cThanks for checking out our code! Join us in making the world more sustainable.', 'color: #4ade80; font-size: 14px;');
