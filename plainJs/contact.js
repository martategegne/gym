document.addEventListener('DOMContentLoaded', () => {

    
    // This creates the button and places it above my header automatically.
    const themeBtn = document.createElement('button');
    themeBtn.id = 'dynamic-theme-toggle';
    themeBtn.innerHTML = '🌙'; 
    themeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    
    // Positioned 'fixed' so it stays in the corner even when scrolling
    Object.assign(themeBtn.style, {
        position: 'fixed',
        top: '15px',
        right: '15px',
        zIndex: '9999',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        fontSize: '1.4rem',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    });

    document.body.prepend(themeBtn);

    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    // Theme initialization
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        applyDarkMode(true);
    }

    function applyDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark');
            themeBtn.innerHTML = '☀️';
            themeBtn.style.backgroundColor = '#333';
        } else {
            body.classList.remove('dark');
            themeBtn.innerHTML = '🌙';
            themeBtn.style.backgroundColor = '#fff';
        }
    }

    themeBtn.addEventListener('click', () => {
        const isNowDark = body.classList.toggle('dark');
        applyDarkMode(isNowDark);
        localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    });

    // Character Counter 
    const messageArea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    if (messageArea && charCount) {
        messageArea.addEventListener('input', () => {
            const remaining = 1000 - messageArea.value.length;
            charCount.textContent = `${remaining} characters remaining`;
            charCount.style.color = remaining < 50 ? '#ff4d4d' : 'green';
        });
    }

    //  Form Submission & Storage 
    const contactForm = document.getElementById('enhanced-contact-form');
    const attachmentsInput = document.getElementById('attachments');
    const formStatus = document.getElementById('form-status');

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // CAPTCHA check
            const humanCheck = document.getElementById('human-check').value;
            if (humanCheck !== "10") {
                showStatus("❌ Incorrect math answer (7+3=10).", "error");
                return;
            }

            showStatus("⏳ Saving your message locally...", "success");

            try {
                const filePromises = Array.from(attachmentsInput.files).map(file => fileToBase64(file));
                const convertedFiles = await Promise.all(filePromises);

                const submissionData = {
                    id: Date.now(),
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    files: convertedFiles, 
                    timestamp: new Date().toLocaleString()
                };

                const existingData = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
                existingData.push(submissionData);
                localStorage.setItem('contactSubmissions', JSON.stringify(existingData));

                showStatus("✅ Success! Your information is saved.", "success");
                contactForm.reset();
                charCount.textContent = "1000 characters remaining";

            } catch (error) {
                showStatus("⚠️ Storage Full: Files are too large for this browser.", "error");
            }
        });
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.style.padding = "10px";
        formStatus.style.borderRadius = "8px";
        formStatus.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
        formStatus.style.color = type === "success" ? "#155724" : "#721c24";
    }

    //  Interactive Footer Effects 
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            socialIcons.forEach(other => { if (other !== icon) other.style.opacity = '0.3'; });
            icon.style.transform = 'scale(1.2) translateY(-5px)';
        });
        icon.addEventListener('mouseleave', () => {
            socialIcons.forEach(other => other.style.opacity = '1');
            icon.style.transform = 'scale(1)';
        });
    });

    // Footer Copyright update
    const footerP = document.querySelector('footer p');
    if (footerP) {
        footerP.innerHTML = `© Marta Tegegne ${new Date().getFullYear()}. All rights reserved.`;
    }
});

//  Global Chat Functions with Storage ---
window.openChat = () => {
    const chat = document.getElementById('chat-window');
    if (chat) {
        chat.hidden = !chat.hidden;
        // Load history when chat opens
        if (!chat.hidden) {
            renderChatHistory();
        }
    }
};

window.sendChatMessage = () => {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim()) {
        const messageText = input.value.trim();
        
        //  Save to Local Storage
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const newMessage = {
            sender: 'You',
            text: messageText,
            time: new Date().toLocaleTimeString()
        };
        chatHistory.push(newMessage);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        // Clear input and refresh display
        input.value = '';
        renderChatHistory();

        //  Fake Bot Response
        setTimeout(() => {
            const botReply = {
                sender: 'Bot',
                text: "Thanks for reaching out! Marta will get back to you soon.",
                time: new Date().toLocaleTimeString()
            };
            const updatedHistory = JSON.parse(localStorage.getItem('chatHistory'));
            updatedHistory.push(botReply);
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
            renderChatHistory();
        }, 1000);
    }
};

// Helper function to show messages on the screen
function renderChatHistory() {
    const display = document.getElementById('chat-messages');
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    display.innerHTML = history.map(msg => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            <small style="color: #888;">${msg.time}</small><br>
            <strong>${msg.sender}:</strong> ${msg.text}
        </div>
    `).join('');
    
    display.scrollTop = display.scrollHeight;
}