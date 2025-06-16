document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Load upcoming events (simulated API call)
    function loadUpcomingEvents() {
        // In a real implementation, this would fetch from your backend
        const events = [
            {
                title: "Summer Camp 2025",
                date: "July 15-20, 2025",
                description: "Annual summer camping trip to Pine Forest. All scouts welcome!"
            },
            {
                title: "Community Service Day",
                date: "August 5, 2025",
                description: "Helping clean up the local park and plant trees."
            },
            {
                title: "Leadership Workshop",
                date: "September 10, 2025",
                description: "Special training for patrol leaders and aspiring leaders."
            }
        ];
        
        const eventList = document.querySelector('.event-list');
        eventList.innerHTML = '';
        
        events.slice(0, 3).forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-date">${event.date}</div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
            `;
            eventList.appendChild(eventCard);
        });
    }
    
    loadUpcomingEvents();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});