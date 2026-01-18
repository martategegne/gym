document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME MANAGEMENT (Dark Mode Sync) 
    const themeBtn = document.createElement('button');
    themeBtn.id = 'dynamic-theme-toggle';
    themeBtn.innerHTML = '🌙';
    themeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    
    Object.assign(themeBtn.style, {
        position: 'fixed', top: '15px', right: '15px', zIndex: '10000',
        padding: '10px', cursor: 'pointer', borderRadius: '50%',
        border: 'none', backgroundColor: '#ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        fontSize: '1.4rem', width: '45px', height: '45px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease'
    });

    document.body.prepend(themeBtn);
    const body = document.body;

    const applyDarkMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark');
            themeBtn.innerHTML = '☀️';
            themeBtn.style.backgroundColor = '#333';
            themeBtn.style.color = '#fff';
        } else {
            body.classList.remove('dark');
            themeBtn.innerHTML = '🌙';
            themeBtn.style.backgroundColor = '#fff';
            themeBtn.style.color = '#333';
        }
    };

    // Load saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') applyDarkMode(true);

    themeBtn.addEventListener('click', () => {
        const isNowDark = body.classList.toggle('dark');
        applyDarkMode(isNowDark);
        localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    });

    //LIVE SESSION FEED & CHAT LOGIC 
    const updateBox = document.getElementById('session-updates');
    const chatInput = document.getElementById('live-chat-msg');

    // Master function to render messages to the UI
    const addMessageToLive = (msg, isUser = false) => {
        const p = document.createElement('p');
        p.style.cssText = `
            padding: 10px; 
            border-left: 4px solid ${isUser ? '#22c55e' : '#ffc107'};
            background: ${isUser ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 193, 7, 0.1)'}; 
            margin-bottom: 8px;
            border-radius: 0 8px 8px 0;
            font-size: 0.9rem;
            animation: slideIn 0.3s ease-out;
        `;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        p.innerHTML = `
            <small style="color:gray;">[${timestamp}]</small> 
            <strong>${isUser ? 'YOU' : 'SYSTEM'}:</strong> ${msg}
        `;
        
        updateBox.prepend(p);

        // Limit scrollback to 8 messages
        if (updateBox.children.length > 8) {
            updateBox.removeChild(updateBox.lastChild);
        }
    };

    // Bot Feed: Infinite loop of live updates
    window.startLiveUpdates = () => {
        updateBox.innerHTML = '<p style="color:red; font-weight:bold; margin-bottom:10px;">● LIVE STREAM CONNECTED</p>';
        
        const botMessages = [
            "Sarah Johnson just started a 'Power Yoga' live session!",
            "HIIT Blast with Coach Mike starting in 5 minutes.",
            "Health Tip: Drink 500ml of water before your workout.",
            "Live Alert: 52 people are training with us right now!",
            "New PR: User 'Alex' just finished the 30-day challenge!",
            "Coach Sarah: 'Focus on your core during the planks!'",
"🍎 Snack Idea: Greek yogurt with honey for a quick boost.",

"💧 Stay hydrated! Take a 30-second water break now.",

"🕒 Session update: 15 minutes remaining in the Yoga flow.",

"💪 Quote of the day: 'Action is the foundational key to all success.'",

"🧘 Focus: Keep your spine straight during this movement.",

"🛑 Form Check: Avoid locking your knees during squats.",

"🌟 VIP Member 'Elena' just hit a 100-day workout streak!",

"📉 Heart Rate Tip: Target 140bpm for fat burning.",

"👟 Equipment: Today's HIIT requires a set of light dumbbells.",

"🎵 Music: Today's playlist is curated for high-energy cardio.",

"📊 Poll: Which muscle group are you training today?",

"✅ Session Saved: Your activity has been logged to your profile.",

"❄️ Cooling down: Start lowering your intensity in 3, 2, 1...",

"🌙 Night Tip: 8 hours of sleep is as important as the gym.",


"Coach Sarah: 'Engage your glutes during the bridge.'",

"Coach Mike: 'Explosive power on the way up, control on the way down.'",

"Sarah: 'Think about lengthening your limbs in this pose.'",

"Mike: 'Keep your elbows tucked in during the pushups.'",

"Sarah: 'Imagine a string pulling you toward the ceiling.'",

"Coach Mike: 'Control your breathing: In through the nose, out through the mouth.'",

"Sarah: 'Soft knees on the landing to protect your joints.'",

"Coach Mike: 'Hinge at the hips, don't round the back!'",

"Sarah: 'Find a focal point on the wall for balance.'",

"Coach Mike: 'Maximum effort for these last 30 seconds!'",

"Sarah: 'Relax your shoulders away from your ears.'",

"Coach Mike: 'Tight core, flat back, let's move!'",

"Sarah: 'This stretch targets the psoas and hip flexors.'",

"Coach Mike: 'Keep your chest up during the goblet squat.'",

"Sarah: 'Deep belly breaths during the cool down.'",

"Coach Mike: 'Squeeze the shoulder blades together at the top.'",

"Sarah: 'Listen to your body; take a child's pose if you need to.'",

"Coach Mike: 'Drive through your heels!'",

"Sarah: 'Feel the energy flowing through your fingertips.'",

"Coach Mike: 'Last set, best set!'",

"Sarah: 'Namaste, everyone. Great work today.'",

"Coach Mike: 'High fives all around! See you tomorrow!'",

"SYSTEM: New workout plan 'Summer Shred' is now available.",

"SYSTEM: Connection stable. Enjoy your workout.",

"SYSTEM: End of session. Don't forget to rate your trainer!",



        ];

        let i = 0;
        setInterval(() => {
            addMessageToLive(botMessages[i], false);
            i = (i + 1) % botMessages.length; // Infinite loop logic
        }, 5000); 
    };

    // User Message Functionality
    window.sendUserMessage = () => {
        if (chatInput && chatInput.value.trim() !== "") {
            addMessageToLive(chatInput.value, true);
            chatInput.value = ""; // Reset box
            chatInput.focus();
        }
    };

    // Listen for "Enter" key inside chat box
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.sendUserMessage();
    });

    //TRAINER PHOTO & VIDEO INTERACTIONS 
    const trainerImg = document.querySelector('#trainer-profiles img');
    if (trainerImg) {
        trainerImg.style.transition = "transform 0.4s ease, filter 0.3s ease";
        
        trainerImg.addEventListener('mouseenter', () => {
            trainerImg.style.transform = "scale(1.1) rotate(2deg)";
            trainerImg.style.filter = "brightness(1.1) sepia(0.2)";
        });
        
        trainerImg.addEventListener('mouseleave', () => {
            trainerImg.style.transform = "scale(1) rotate(0deg)";
            trainerImg.style.filter = "none";
        });
    }

    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('play', () => {
            video.style.boxShadow = "0 0 25px rgba(0, 123, 255, 0.5)";
            addMessageToLive("You are now watching: Trainer Demo Video", true);
        });
        
        video.addEventListener('pause', () => {
            video.style.boxShadow = "none";
        });
    }

    // ADVANCED BOOKING & FORM LOGIC
    const bookingForm = document.getElementById('advanced-booking-form');
    const dateInput = document.getElementById('session-date');

    // Auto-set min date to today
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = bookingForm.querySelector('button');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = "Confirmed! ✅";
        submitBtn.style.backgroundColor = "#22c55e";
        
        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.backgroundColor = "";
            bookingForm.reset();
        }, 3000);
    });

    //FOOTER AUTO-DATE 
    const footerP = document.querySelector('footer p');
    if (footerP) {
        footerP.innerHTML = `&copy; Marta Tegegne ${new Date().getFullYear()}. All rights reserved.`;
    }
});