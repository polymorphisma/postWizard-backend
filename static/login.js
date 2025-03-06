document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('messageContainer');

    try {
        const response = await fetch('http://localhost:3000/api/v1/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Login failed');
        
        // Assuming the response contains a token or session ID:
        const token = result.token; // Replace `token` with your actual key name from the API response

        // Save the token in cookies (with a 1 day expiration)
        document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;

        messageContainer.style.color = 'green';
        messageContainer.textContent = `Success: ${result.message}`;
        
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    } catch (error) {
        messageContainer.style.color = 'red';
        messageContainer.textContent = `Error: ${error.message}`;
    }
});
