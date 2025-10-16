// Popup login function
function loginWithGooglePopup() {
    const width = 500;
    const height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    // Open Google login in popup
    const popup = window.open(
        'https://tithr-5767d289.base44.app/auth/google', 
        'googleLogin', 
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    // Listen for postMessage from popup
    window.addEventListener('message', function receiveToken(event) {
        if (event.origin !== 'https://tithr-5767d289.base44.app') return;
        const { token } = event.data;

        if (token) {
            localStorage.setItem('authToken', token);
            console.log('Google login successful!', token);
            alert('Login successful! You can now use the app.');
        }

        window.removeEventListener('message', receiveToken);
        popup.close();
    });
}

// Attach to button
document.getElementById('googleLoginBtn').addEventListener('click', loginWithGooglePopup);
