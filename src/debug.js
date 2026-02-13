
// Global error handler to catch and display errors on the screen
window.onerror = function (message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100vh';
    errorDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.overflow = 'auto';
    errorDiv.style.whiteSpace = 'pre-wrap';

    const errorTitle = document.createElement('h2');
    errorTitle.textContent = 'Runtime Error Caught';
    errorTitle.style.borderBottom = '1px solid #ff6b6b';
    errorTitle.style.paddingBottom = '10px';

    const errorMessage = document.createElement('div');
    errorMessage.textContent = `Message: ${message}\n\nLocation: ${source}:${lineno}:${colno}\n\nStack:\n${error ? error.stack : 'No stack trace'}`;

    errorDiv.appendChild(errorTitle);
    errorDiv.appendChild(errorMessage);
    document.body.appendChild(errorDiv);

    // Also log to console
    console.error('Caught global error:', error);
};

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', function (event) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '50vh';
    errorDiv.style.backgroundColor = 'rgba(50,0,0,0.9)';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.overflow = 'auto';
    errorDiv.style.whiteSpace = 'pre-wrap';

    errorDiv.textContent = `Unhandled Promise Rejection:\n${event.reason}`;
    document.body.appendChild(errorDiv);
});
