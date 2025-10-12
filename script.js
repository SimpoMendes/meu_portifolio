/* ===================================== */
/*        EFEITOS E INTERAÇÕES JS        */
/* ===================================== */

/* Header transparente ao rolar */
document.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  header.classList.toggle("active", window.scrollY > 50);
});

/* Rolagem suave para as seções */
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

/* ===================================== */
/*   ENVIO DO FORMULÁRIO VIA FORMCARRY   */
/* ===================================== */
const form = document.getElementById("formcarry");
const msg = document.getElementById("msg-retorno");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  msg.textContent = "Enviando mensagem...";
  msg.style.color = "#fff";

  try {
    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: formData
    });

    // Debug opcional para verificar o status
    console.log("Status:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Resposta:", data);

    if (response.ok) {
      msg.textContent = "✅ Mensagem enviada com sucesso!";
      msg.style.color = "#ff6a00";
      form.reset();
    } else if (response.status === 422) {
      msg.textContent = "⚠️ Verifique se todos os campos estão preenchidos corretamente.";
      msg.style.color = "yellow";
    } else if (response.status === 403) {
      msg.textContent = "🚫 Acesso negado. Verifique se o endpoint está correto.";
      msg.style.color = "red";
    } else {
      msg.textContent = "❌ Ocorreu um erro. Tente novamente mais tarde.";
      msg.style.color = "red";
    }

  } catch (error) {
    console.error("Erro de conexão:", error);
    msg.textContent = "❌ Falha na conexão. Verifique sua internet.";
    msg.style.color = "red";
  }
});

/* ===================================== */
/*   SLIDE ROTATIVO AUTOMÁTICO + BOTÕES  */
/* ===================================== */
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;

const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

function updateSlidePosition() {
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlidePosition();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Troca automática a cada 5 segundos
setInterval(nextSlide, 5000);
