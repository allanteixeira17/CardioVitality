// Main JavaScript for CardioVitality - Integrated with NVIDIA Nemotron

// --- Hero Video Logic ---
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            heroVideo.play().catch(error => console.log("Hero autoplay prevented", error));
        }, 1000);
    });
    heroVideo.loop = false;
}

// --- CTA Video Standard Loop Logic ---
const ctaVideo = document.getElementById('cta-video');
const ctaSection = document.getElementById('cta-section');
const ctaStart = 1.0;

if (ctaVideo && ctaSection) {
    ctaVideo.addEventListener('ended', () => {
        ctaVideo.currentTime = ctaStart;
        ctaVideo.play();
    });

    ctaVideo.addEventListener('play', () => {
        if (ctaVideo.currentTime < ctaStart) {
            ctaVideo.currentTime = ctaStart;
        }
    }, { once: false });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ctaVideo.play();
            } else {
                ctaVideo.pause();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(ctaSection);
}

// --- Anatomy Video Interaction Logic ---
const anatomyVideo = document.getElementById('anatomy-video');
const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const anatomyLimit = 6.0;

if (anatomyVideo && rotateLeftBtn && rotateRightBtn) {
    function seekAnatomy(seconds) {
        anatomyVideo.pause(); // Para a rotação automática ao interagir
        let newTime = anatomyVideo.currentTime + seconds;

        // Loop manual do tempo para garantir rotação infinita
        if (newTime >= anatomyLimit) newTime = 0.1;
        if (newTime <= 0) newTime = anatomyLimit - 0.1;

        anatomyVideo.currentTime = newTime;
    }

    rotateLeftBtn.addEventListener('click', () => {
        seekAnatomy(-0.4); // Salto maior para feedback visual claro
    });

    rotateRightBtn.addEventListener('click', () => {
        seekAnatomy(0.4);
    });

    let isDragging = false;
    let startX = 0;
    const anatomyContainer = document.getElementById('anatomy-container');

    if (anatomyContainer) {
        anatomyContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            anatomyVideo.pause();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.pageX - startX;
            if (Math.abs(deltaX) > 5) {
                seekAnatomy(deltaX > 0 ? 0.1 : -0.1);
                startX = e.pageX;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        anatomyContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            anatomyVideo.pause();
        });

        anatomyContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaX = e.touches[0].pageX - startX;
            if (Math.abs(deltaX) > 5) {
                seekAnatomy(deltaX > 0 ? 0.05 : -0.05);
                startX = e.touches[0].pageX;
            }
            e.preventDefault();
        }, { passive: false });

        anatomyContainer.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    window.addEventListener('load', () => {
        anatomyVideo.play().catch(e => console.log("Manual play required", e));
    });
}

// --- Reveal Animations Logic ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// --- Mobile Menu Logic ---
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');

function toggleMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains('translate-x-full')) {
        mobileMenu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);

// --- AI Chat Logic (NVIDIA Nemotron Integration) ---
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const NVIDIA_MODEL = import.meta.env.VITE_NVIDIA_MODEL || "nvidia/nemotron-4-340b-instruct";

const chatToggle = document.getElementById('ai-chat-toggle');
const chatContainer = document.getElementById('ai-chat-container');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('ai-chat-input');
const chatSend = document.getElementById('ai-chat-send');
const chatMessages = document.getElementById('ai-chat-messages');

if (chatToggle && chatContainer) {
    function toggleChat() {
        chatContainer.classList.toggle('open');
        chatToggle.classList.toggle('active');
        if (chatContainer.classList.contains('open')) {
            chatInput.focus();
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', toggleChat);

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot-message typing-container';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    async function getBotResponse(userText) {
        if (!NVIDIA_API_KEY || NVIDIA_API_KEY === "SUA_NVIDIA_API_KEY_AQUI") {
            return "Olá! Para eu usar o poder do Nemotron, configure sua chave da NVIDIA no arquivo .env.";
        }

        const clinicKnowledge = `
        INFORMAÇÕES ESPECÍFICAS DA CLÍNICA (Siga rigorosamente):
        - Contatos: Telefone (11) 3456-7890 | WhatsApp (11) 99876-5432.
        - Convênios Aceitos: SulAmérica Saúde, Care Plus, Bradesco Saúde, Porto Seguro Saúde, Amil Saúde e Unimed.
        - Valor da Consulta Particular: R$ 350,00, aceitamos cartão de crédito e débito, pix e dinheiro.
        - Horários: Segunda a Sexta (08:00 - 19:00) e Sábados (08:00 - 12:00).
        - Local: Edifício Life Health, Brooklin Novo, SP (Av. das Nações Unidas, 12901).
        `;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                    "HTTP-Referer": window.location.origin, // Necessário para OpenRouter
                    "X-Title": "CardioVitality Assistant"    // Necessário para OpenRouter
                },
                body: JSON.stringify({
                    model: NVIDIA_MODEL,
                    messages: [
                        {
                            role: "system",
                            content: `Você é o CardioAssist, o assistente virtual de elite da clínica CardioVitality. 
                            Seu tom é profissional, empático e focado em excelência médica. 
                            
                            ${clinicKnowledge}
                            
                            REGRAS CRÍTICAS: 
                            1. Se o paciente relatar dor forte no peito, falta de ar súbita ou desmaio, diga IMEDIATAMENTE para ele procurar o pronto-socorro ou ligar para o 192.
                            2. Use as informações de convênios e valores acima para responder dúvidas financeiras.
                            3. Seja conciso (máximo 3 frases).
                            4. Responda em Português Brasileiro.`
                        },
                        { role: "user", content: userText }
                    ],
                    temperature: 0.5
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0].message.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error("Resposta inválida da NVIDIA API");
            }
        } catch (error) {
            console.error("Erro na API NVIDIA:", error);
            return "Desculpe, tive um problema na conexão com o cérebro da IA. Tente novamente em instantes.";
        }
    }

    async function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage(text, true);
        chatInput.value = '';
        const indicator = showTypingIndicator();
        try {
            const response = await getBotResponse(text);
            indicator.remove();
            addMessage(response);
        } catch (err) {
            indicator.remove();
            addMessage("Ops, algo deu errado. Tente novamente.");
        }
    }

    if (chatSend) chatSend.addEventListener('click', handleSendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
}

// --- Back to Top Logic ---
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('translate-y-24');
        } else {
            backToTopBtn.classList.add('translate-y-24');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Active Link Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const scrollSections = document.querySelectorAll('section[id]');
function updateNav() {
    let current = "";
    const scrollPos = window.scrollY + 100;
    scrollSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });
    if (window.scrollY < 200) current = "";
    navLinks.forEach((link) => {
        link.classList.remove('active-link', 'text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-1');
        link.classList.add('text-on-surface-variant');
        const href = link.getAttribute('href');
        if ((href === '#' && current === "") || (href === '#' + current)) {
            link.classList.add('active-link');
            link.classList.remove('text-on-surface-variant');
        }
    });
}
window.addEventListener('scroll', updateNav);
window.addEventListener('load', updateNav);
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(l => l.classList.remove('active-link'));
        this.classList.add('active-link');
    });
});
