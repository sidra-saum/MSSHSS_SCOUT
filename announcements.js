document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    const announcementForm = document.getElementById('announcementForm');
    const cancelAnnouncementBtn = document.getElementById('cancelAnnouncementBtn');
    const newAnnouncementForm = document.getElementById('newAnnouncementForm');
    const announcementsList = document.getElementById('announcementsList');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    // State variables
    let announcements = [];
    let filteredAnnouncements = [];
    let currentPage = 1;
    const announcementsPerPage = 5;

    // Sample data - in a real app, this would come from an API
    const sampleAnnouncements = [
        {
            id: 1,
            title: "Summer Camp Registration Now Open",
            content: "Registration for our annual summer camp is now open! The camp will be held from July 10-15 at Pine Forest. Please submit your forms by June 30th.",
            category: "event",
            date: "2025-06-01",
            expiry: "2025-06-30",
            author: "Senior Patrol Leader"
        },
        {
            id: 2,
            title: "Urgent: Parent Meeting Required",
            content: "All parents must attend the safety briefing on June 15th at 6:30 PM in the Scout Hall. This is mandatory for all participants in summer camp.",
            category: "urgent",
            date: "2025-05-28",
            expiry: "2025-06-15",
            author: "Parade Leader"
        },
        {
            id: 3,
            title: "Congratulations to Our New Eagle Scouts",
            content: "We're proud to announce that Michael Johnson, Sarah Williams, and David Chen have earned their Eagle Scout rank. Ceremony will be held on June 20th.",
            category: "achievement",
            date: "2025-05-25",
            expiry: null,
            author: "Parade Leader"
        },
        {
            id: 4,
            title: "Community Service Day This Saturday",
            content: "Join us for park cleanup this Saturday from 9 AM to 12 PM. Bring work gloves and wear your scout uniform. Lunch will be provided.",
            category: "event",
            date: "2025-05-20",
            expiry: "2025-06-03",
            author: " Senior Patrol Leader"
        },
        {
            id: 5,
            title: "New Badge Requirements Update",
            content: "The requirements for the Environmental Science badge have been updated. Please check the new requirements in the handbook.",
            category: "general",
            date: "2025-05-15",
            expiry: null,
            author: "Patrol Leader"
        },
        {
            id: 6,
            title: "Scout Uniform Policy Reminder",
            content: "All scouts must wear complete uniforms to all troop meetings and events unless otherwise specified. This includes the official shirt, pants, and neckerchief.",
            category: "general",
            date: "2025-05-10",
            expiry: null,
            author: "Patrol Leader"
        },
        {
            id: 7,
            title: "First Aid Training Certification",
            content: "Certified first aid training will be offered on June 5th. This is required for all patrol leaders and highly recommended for all scouts.",
            category: "event",
            date: "2025-05-05",
            expiry: "2023-06-05",
            author: "Patrol Leader"
        }
    ];

    // Initialize the page
    function init() {
        announcements = sampleAnnouncements;
        filteredAnnouncements = [...announcements];
        renderAnnouncements();
        renderPagination();
        
        // Check if user is admin (in a real app, this would be proper authentication)
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
            document.querySelector('.admin-controls').style.display = 'block';
        }
    }

    // Toggle announcement form visibility
    addAnnouncementBtn.addEventListener('click', function() {
        announcementForm.style.display = announcementForm.style.display === 'block' ? 'none' : 'block';
    });

    cancelAnnouncementBtn.addEventListener('click', function() {
        announcementForm.style.display = 'none';
        newAnnouncementForm.reset();
    });

    // Handle form submission
    newAnnouncementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAnnouncement = {
            id: announcements.length + 1,
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value,
            category: document.getElementById('announcementCategory').value,
            date: new Date().toISOString().split('T')[0],
            expiry: document.getElementById('announcementExpiry').value || null,
            author: "Admin" // In real app, get from user session
        };
        
        announcements.unshift(newAnnouncement); // Add to beginning
        filterAnnouncements();
        newAnnouncementForm.reset();
        announcementForm.style.display = 'none';
        
        // Scroll to the new announcement
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Filter announcements by category
    categoryFilter.addEventListener('change', function() {
        filterAnnouncements();
        currentPage = 1;
        renderPagination();
    });

    // Search announcements
    searchBtn.addEventListener('click', function() {
        filterAnnouncements();
        currentPage = 1;
        renderPagination();
    });

    // Pagination controls
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderAnnouncements();
            renderPagination();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderAnnouncements();
            renderPagination();
        }
    });

    // Filter announcements based on selected category and search term
    function filterAnnouncements() {
        const category = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        filteredAnnouncements = announcements.filter(announcement => {
            const matchesCategory = category === 'all' || announcement.category === category;
            const matchesSearch = announcement.title.toLowerCase().includes(searchTerm) || 
                                 announcement.content.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        renderAnnouncements();
    }

    // Render announcements to the page
    function renderAnnouncements() {
        const startIdx = (currentPage - 1) * announcementsPerPage;
        const endIdx = startIdx + announcementsPerPage;
        const announcementsToShow = filteredAnnouncements.slice(startIdx, endIdx);
        
        if (announcementsToShow.length === 0) {
            announcementsList.innerHTML = '<div class="no-results">No announcements found matching your criteria.</div>';
            return;
        }
        
        announcementsList.innerHTML = announcementsToShow.map(announcement => `
            <div class="announcement-card" data-id="${announcement.id}">
                <span class="announcement-category category-${announcement.category}">
                    ${announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                </span>
                <h3 class="announcement-title">${announcement.title}</h3>
                <div class="announcement-date">
                    📅 ${formatDate(announcement.date)} ${announcement.author ? `• Posted by: ${announcement.author}` : ''}
                    ${announcement.expiry ? `<span class="expiry">• Expires: ${formatDate(announcement.expiry)}</span>` : ''}
                </div>
                <div class="announcement-content">
                    <p>${announcement.content}</p>
                </div>
                <div class="announcement-actions">
                    ${localStorage.getItem('isAdmin') === 'true' ? `
                        <button class="btn btn-outline edit-btn" data-id="${announcement.id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${announcement.id}">Delete</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editAnnouncement(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteAnnouncement(id);
            });
        });
    }

    // Render pagination controls
    function renderPagination() {
        const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Format date as DD/MM/YYYY
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {day: 'numeric',  month: 'short', year: 'numeric' });
    }

    // Edit announcement (simplified for demo)
    function editAnnouncement(id) {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            document.getElementById('announcementTitle').value = announcement.title;
            document.getElementById('announcementContent').value = announcement.content;
            document.getElementById('announcementCategory').value = announcement.category;
            document.getElementById('announcementExpiry').value = announcement.expiry || '';
            
            announcementForm.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // In a real app, you would update the existing announcement instead of adding new
        }
    }

    // Delete announcement
    function deleteAnnouncement(id) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            announcements = announcements.filter(a => a.id !== id);
            filterAnnouncements();
            renderPagination();
        }
    }

    // Initialize the page
    init();
});