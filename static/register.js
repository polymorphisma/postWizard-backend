

// register.js - Logic for the registration page
import { apiRequest } from './api.js';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('messageContainer');

    try {
        const response = await fetch('http://localhost:3000/api/v1/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Registration failed');
        
        console.log(result)
        messageContainer.style.color = 'green';
        messageContainer.textContent = `Success: ${result.message}`;
        
        setTimeout(() => {
            window.location.href = 'login';
        }, 2000);
    } catch (error) {
        messageContainer.style.color = 'red';
        messageContainer.textContent = `Error: ${error.message}`;
    }
});