// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const popupForm = document.getElementById('popup-form');
    const closeButton = document.getElementById('close-popup');
    const heroCta = document.getElementById('hero-cta');
    const ctaBottom = document.getElementById('cta-bottom');
    
    function showPopup() {
        popup.classList.add('active');
    }
    
    function closePopup() {
        popup.classList.remove('active');
    }
    
    setTimeout(function() {
        showPopup();
    }, 5000);  //5 sekund pokazanie popup
    
    heroCta.addEventListener('click', showPopup);
    ctaBottom.addEventListener('click', showPopup);
    closeButton.addEventListener('click', closePopup);
    
    popupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        const submitButton = popupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Wysyłanie...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'popup-main-page'
                })
            });
            
            if (response.ok) {
                closePopup();
                alert('Dziękujemy za zapisanie się! Skontaktujemy się z Tobą wkrótce.');
                popupForm.reset();
            } else {
                throw new Error('Prosimy spróbować później');
            }
            
        } catch (error) {
            console.error('Błąd wysyłania danych:', error);
            alert('Wystąpił błąd podczas wysyłania danych. Prosimy spróbować później.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});
