
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const oldPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    // Prepare request body
    const requestBody = {
        oldPassword: oldPassword,
        newPassword: newPassword
    };

    try {
        const response = await fetch('http://localhost:3000/api/v1/user/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Password changed successfully!');
            // Optionally clear inputs
            document.getElementById('changePasswordForm').reset();
        } else {
            alert(result.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
