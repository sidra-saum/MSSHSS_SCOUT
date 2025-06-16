document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    emailjs.init('YOUR_USER_ID'); // Replace with your actual EmailJS user ID

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                formMessage.textContent = 'Your message has been sent successfully!';
                formMessage.className = 'form-message success';
                
                // Reset form
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                formMessage.textContent = 'There was an error sending your message. Please try again later.';
                formMessage.className = 'form-message error';
            })
            .finally(function() {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 5000);
            });
    });
});