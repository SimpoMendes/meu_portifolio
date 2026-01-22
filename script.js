/* ===================================== */
/*        PORTFOLIO MODERNO - JS         */
/* ===================================== */

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

/* ===================================== */
/*        HEADER E NAVEGAÇÃO             */
/* ===================================== */
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// Header scroll effect
const handleScroll = throttle(() => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// Scroll progress indicator
const createScrollIndicator = () => {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<div class="scroll-progress"></div>';
  document.body.appendChild(indicator);
  
  const progress = indicator.querySelector('.scroll-progress');
  
  const updateProgress = throttle(() => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = `${Math.min(scrolled, 100)}%`;
  }, 10);
  
  window.addEventListener('scroll', updateProgress, { passive: true });
};

createScrollIndicator();

// Mobile menu toggle
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = nav.classList.contains('active');
    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Animate hamburger icon
    const icon = menuToggle.querySelector('i');
    if (icon) {
      icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    }
  });
}

// Smooth scroll navigation
document.querySelectorAll('.nav a, .btn-primary[href^="#"], .btn-secondary[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
  });
});

/* ===================================== */
/*   SLIDE ROTATIVO COM ACESSIBILIDADE   */
/* ===================================== */
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
const totalSlides = slides.length;
let slideInterval;

const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

function updateSlidePosition() {
  if (slidesContainer) {
    slidesContainer.style.transform = `translateX(-${currentSlide * (100 / 6)}%)`;
    
    // Atualizar indicadores (apenas para slides reais)
    const realSlide = currentSlide % totalSlides;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === realSlide);
      indicator.setAttribute('aria-selected', index === realSlide);
    });
  }
}

function nextSlide() {
  currentSlide++;
  slidesContainer.style.transition = 'transform 0.5s ease';
  updateSlidePosition();
  
  // Looping infinito
  if (currentSlide >= totalSlides) {
    setTimeout(() => {
      slidesContainer.style.transition = 'none';
      currentSlide = 0;
      updateSlidePosition();
    }, 500);
  }
}

function prevSlide() {
  currentSlide--;
  slidesContainer.style.transition = 'transform 0.5s ease';
  
  if (currentSlide < 0) {
    slidesContainer.style.transition = 'none';
    currentSlide = totalSlides - 1;
    updateSlidePosition();
    setTimeout(() => {
      slidesContainer.style.transition = 'transform 0.5s ease';
    }, 10);
  } else {
    updateSlidePosition();
  }
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlidePosition();
  resetAutoSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Event listeners
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

// Indicadores
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => goToSlide(index));
});

// Pausar autoplay ao hover
const slider = document.querySelector('.slider');
if (slider) {
  slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slider.addEventListener('mouseleave', startAutoSlide);
}

// Inicializar slide
if (slides.length > 0) {
  updateSlidePosition();
  startAutoSlide();
}

/* ===================================== */
/*        SCROLL REVEAL ANIMATIONS       */
/* ===================================== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

/* ===================================== */
/*        TEMA ESCURO/CLARO              */
/* ===================================== */
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Get saved theme or system preference
const currentTheme = localStorage.getItem('theme') || 
  (prefersDarkScheme.matches ? 'dark' : 'light');

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);

// Update theme icon
const updateThemeIcon = (theme) => {
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
};

updateThemeIcon(currentTheme);

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
  }
});

/* ===================================== */
/*        FORMULÁRIO DE CONTATO          */
/* ===================================== */
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

// Form validation
const validateField = (field) => {
  const errorElement = field.parentNode.querySelector('.error-message');
  let isValid = true;
  let errorMessage = '';

  // Remove previous styling
  field.classList.remove('error');
  
  if (!field.value.trim()) {
    isValid = false;
    errorMessage = 'Este campo é obrigatório.';
  } else if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = 'Por favor, insira um e-mail válido.';
    }
  } else if (field.name === 'nome' && field.value.trim().length < 2) {
    isValid = false;
    errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
  } else if (field.name === 'mensagem' && field.value.trim().length < 10) {
    isValid = false;
    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
    field.setAttribute('aria-invalid', !isValid);
    if (!isValid) field.classList.add('error');
  }

  return isValid;
};

// Real-time validation
if (contactForm) {
  const fields = contactForm.querySelectorAll('input, textarea');
  
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', debounce(() => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    }, 300));
  });

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    fields.forEach(field => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      formMessage.textContent = 'Por favor, corrija os erros antes de enviar.';
      formMessage.className = 'form-message error';
      return;
    }

    // Show loading state
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
    }
    contactForm.classList.add('loading');

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      formMessage.textContent = '✅ Mensagem enviada com sucesso! Entrarei em contato em breve.';
      formMessage.className = 'form-message success';
      contactForm.reset();
      
      // Clear validation states
      fields.forEach(field => {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) errorElement.textContent = '';
      });

    } catch (error) {
      formMessage.textContent = '❌ Erro ao enviar mensagem. Tente novamente.';
      formMessage.className = 'form-message error';
    } finally {
      // Reset loading state
      if (btnText && btnLoading) {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
      contactForm.classList.remove('loading');
    }
  });
}

/* ===================================== */
/*        PERFORMANCE OPTIMIZATIONS      */
/* ===================================== */

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    'img/perfil.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/* ===================================== */
/*        KEYBOARD NAVIGATION            */
/* ===================================== */
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape' && nav.classList.contains('active')) {
    nav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  }
});

/* ===================================== */
/*        ANALYTICS & PERFORMANCE        */
/* ===================================== */
// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      console.log(`🚀 Página carregada em: ${loadTime}ms`);
      
      // Log Core Web Vitals if available
      if ('web-vitals' in window) {
        // This would require the web-vitals library
        // getCLS(console.log);
        // getFID(console.log);
        // getLCP(console.log);
      }
    }, 0);
  });
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

/* ===================================== */
/*        INITIALIZATION                 */
/* ===================================== */
document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalResources();
  
  // Add fade-in animation to hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.classList.add('fade-in-up');
  }
  
  // Initialize any other components
  console.log('🎉 Portfolio loaded successfully!');
});

/* ===================================== */
/*        EASTER EGGS & FUN STUFF        */
/* ===================================== */
console.log(`
🚀 Olá, desenvolvedor curioso!
👨‍💻 Gostou do código? Vamos conversar!
📧 Entre em contato: sergio@exemplo.com
🔗 GitHub: github.com/SimpoMendes
`);

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    console.log('🎮 Konami Code ativado! Você é um verdadeiro gamer!');
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = '';
    }, 3000);
    konamiCode = [];
  }
});
/* ===================================== */
/*        MODAL DE CERTIFICADOS          */
/* ===================================== */
function openModal(imageSrc) {
  const modal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('modalImage');
  
  modalImage.src = `img/${imageSrc}`;
  modal.style.display = 'block';
  
  // Prevenir scroll do body
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('certificateModal');
  modal.style.display = 'none';
  
  // Restaurar scroll do body
  document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora da imagem
document.getElementById('certificateModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});