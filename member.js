document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const memberForm = document.getElementById('memberForm');
    const membersTableBody = document.getElementById('membersTableBody');
    const memberSearch = document.getElementById('memberSearch');
    
    // Sample data - in a real app, this would come from an API/database
    let members = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "(555) 123-4567",
            role: "Senior Patrol Leader",
            patrol: "Eagle Patrol",
            joinDate: "2022-03-15",
            avatar: "JD"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "(555) 987-6543",
            role: "Scoutmaster",
            patrol: "Troop 101",
            joinDate: "2020-05-10",
            avatar: "JS"
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "(555) 456-7890",
            role: "Patrol Leader",
            patrol: "Wolf Patrol",
            joinDate: "2023-01-20",
            avatar: "MJ"
        }
    ];
    
    // Initialize the page
    function init() {
        renderMembersTable();
        
        // Form submission
        memberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewMember();
        });
        
        // Search functionality
        memberSearch.addEventListener('input', function() {
            filterMembers(this.value);
        });
    }
    
    // Render members table
    function renderMembersTable(filteredMembers = null) {
        const membersToRender = filteredMembers || members;
        
        if (membersToRender.length === 0) {
            membersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-members">No members found</td>
                </tr>
            `;
            return;
        }
        
        membersTableBody.innerHTML = membersToRender.map(member => `
            <tr data-id="${member.id}">
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="member-avatar">${member.avatar}</div>
                        <div>
                            <div style="font-weight: 500;">${member.name}</div>
                            <div style="font-size: 0.8rem; color: #718096;">${member.email}</div>
                        </div>
                    </div>
                </td>
                <td>${member.role}</td>
                <td>${member.patrol}</td>
                <td>${formatDate(member.joinDate)}</td>
                <td>
                    <div class="member-actions">
                        <button class="action-btn edit-btn" data-id="${member.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${member.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = parseInt(this.getAttribute('data-id'));
                editMember(memberId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = parseInt(this.getAttribute('data-id'));
                deleteMember(memberId);
            });
        });
    }
    
    // Add new member
    function addNewMember() {
        const newMember = {
            id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
            name: document.getElementById('memberName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value,
            role: document.getElementById('memberRole').value,
            patrol: document.getElementById('memberPatrol').value,
            joinDate: document.getElementById('memberJoinDate').value,
            avatar: getInitials(document.getElementById('memberName').value)
        };
        
        members.unshift(newMember); // Add to beginning of array
        renderMembersTable();
        memberForm.reset();
        
        // Show success message (you could implement a toast/notification)
        alert('Member added successfully!');
    }
    
    // Edit member
    function editMember(memberId) {
        const member = members.find(m => m.id === memberId);
        if (!member) return;
        
        // Fill form with member data
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberEmail').value = member.email;
        document.getElementById('memberPhone').value = member.phone;
        document.getElementById('memberRole').value = member.role;
        document.getElementById('memberPatrol').value = member.patrol;
        document.getElementById('memberJoinDate').value = member.joinDate;
        
        // Change form to update mode
        const submitBtn = memberForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Member';
        
        // Remove previous submit event and add update handler
        memberForm.replaceWith(memberForm.cloneNode(true));
        const newForm = document.getElementById('memberForm');
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateMember(memberId);
        });
    }
    
    // Update member
    function updateMember(memberId) {
        const memberIndex = members.findIndex(m => m.id === memberId);
        if (memberIndex === -1) return;
        
        members[memberIndex] = {
            ...members[memberIndex],
            name: document.getElementById('memberName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value,
            role: document.getElementById('memberRole').value,
            patrol: document.getElementById('memberPatrol').value,
            joinDate: document.getElementById('memberJoinDate').value,
            avatar: getInitials(document.getElementById('memberName').value)
        };
        
        renderMembersTable();
        memberForm.reset();
        
        // Reset form to add mode
        const submitBtn = memberForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Member';
        
        // Show success message
        alert('Member updated successfully!');
    }
    
    // Delete member
    function deleteMember(memberId) {
        if (confirm('Are you sure you want to delete this member?')) {
            members = members.filter(m => m.id !== memberId);
            renderMembersTable();
            alert('Member deleted successfully!');
        }
    }
    
    // Filter members by search term
    function filterMembers(searchTerm) {
        const term = searchTerm.toLowerCase();
        const filtered = members.filter(member => 
            member.name.toLowerCase().includes(term) ||
            member.role.toLowerCase().includes(term) ||
            member.patrol.toLowerCase().includes(term) ||
            member.email.toLowerCase().includes(term)
        );
        renderMembersTable(filtered);
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Helper function to get initials
    function getInitials(name) {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    }
    
    // Initialize the page
    init();
});