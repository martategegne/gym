document.addEventListener('DOMContentLoaded', () => {

    //Dynamic Dark Mode Toggle 
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
    const savedTheme = localStorage.getItem('theme');

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

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        applyDarkMode(true);
    }

    themeBtn.addEventListener('click', () => {
        const isNowDark = body.classList.toggle('dark');
        applyDarkMode(isNowDark);
        localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    });

    //Live Color Preview 
    // This looks for your tier cards and changes their border/shadow based on the color picker
    const colorPicker = document.getElementById('card-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            const selectedColor = e.target.value;
            const activeTier = document.querySelector('input[name="plan"]:checked');
            if (activeTier) {
                const card = document.querySelector(`[data-tier="${activeTier.value}"]`);
                card.style.borderColor = selectedColor;
                card.style.boxShadow = `0 10px 20px ${selectedColor}33`; // 33 adds transparency
            }
        });
    }

    //Calorie Calculator (Keyboard Support) 
    const weightInput = document.getElementById('weight-input');
    window.calculateCalories = () => {
        const weight = weightInput.value;
        const resultDiv = document.getElementById('calorie-result');
        if (weight && weight > 0) {
            const calories = Math.round(weight * 30);
            resultDiv.innerHTML = `<p style="color: #3b82f6; font-weight: bold; margin-top: 10px; animation: fadeIn 0.5s;">
                🔥 Estimated Daily Needs: ${calories} kcal
            </p>`;
        } else {
            resultDiv.innerHTML = "<p style='color: #ef4444;'>Please enter a valid weight.</p>";
        }
    };

    if (weightInput) {
        weightInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.calculateCalories();
        });
    }

    // Custom Modal (Center Window) 
    function showStatusModal(isSuccess, message) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: body.classList.contains('dark') ? '#222' : '#fff',
            color: body.classList.contains('dark') ? '#fff' : '#333',
            padding: '30px', borderRadius: '15px', zIndex: '10001',
            boxShadow: '0 0 50px rgba(0,0,0,0.5)', textAlign: 'center',
            minWidth: '300px', border: `2px solid ${isSuccess ? '#10b981' : '#ef4444'}`
        });

        modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">${isSuccess ? '✅' : '❌'}</div>
            <h3>${isSuccess ? 'Success!' : 'Error'}</h3>
            <p>${message}</p>
            <button id="close-modal" style="margin-top:15px; padding:8px 20px; cursor:pointer;">Close</button>
        `;

        document.body.appendChild(modal);
        document.getElementById('close-modal').onclick = () => modal.remove();
    }

    // Membership Form Submission 
    window.processForm = (event) => {
        event.preventDefault();
        const progressDiv = document.getElementById('form-progress');
        const progressBar = document.getElementById('form-progress-bar');
        
        progressDiv.hidden = false;
        let progress = 0;

        const interval = setInterval(() => {
            progress += 25;
            progressBar.value = progress;

            if (progress >= 100) {
                clearInterval(interval);
                saveMembershipData();
            }
        }, 200);
    };

    function saveMembershipData() {
        try {
            const name = document.getElementById('fullname').value;
            const plan = document.querySelector('input[name="plan"]:checked')?.value;
            
            const formData = {
                id: Date.now(),
                fullname: name,
                email: document.getElementById('email').value,
                plan: plan,
                cardColor: colorPicker.value,
                timestamp: new Date().toLocaleString()
            };

            const members = JSON.parse(localStorage.getItem('gymMemberships')) || [];
            members.push(formData);
            localStorage.setItem('gymMemberships', JSON.stringify(members));

            document.getElementById('form-progress').hidden = true;
            document.getElementById('membership-form').reset();
            
            showStatusModal(true, `Welcome, ${name}! Your ${plan} membership is now active.`);
        } catch (error) {
            showStatusModal(false, "Something went wrong. Please try again.");
        }
    }

    //Geolocation & Plan Selection 
    window.findNearbyGyms = () => {
        const result = document.getElementById('gym-results');
        result.innerHTML = "⏳ Searching coordinates...";
        navigator.geolocation.getCurrentPosition(
            (pos) => result.innerHTML = `📍 Found: Branch near Addis Ababa (Lat: ${pos.coords.latitude.toFixed(2)})`,
            () => result.innerHTML = "❌ Location denied."
        );
    };

    window.selectPlan = (tier) => {
        const radio = document.getElementById(tier);
        if (radio) {
            radio.checked = true;
            radio.scrollIntoView({ behavior: 'smooth' });
            // Immediate color preview update
            colorPicker.dispatchEvent(new Event('input'));
        }
    };

    // Footer Year
    const footerP = document.querySelector('footer p');
    if (footerP) footerP.innerHTML = `© Marta Tegegne ${new Date().getFullYear()}. All rights reserved.`;
});