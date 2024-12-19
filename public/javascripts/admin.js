function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.style.display = 'block';

    // Remove active class from all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the clicked link
    const activeLink = document.querySelector(`a[onclick="showSection('${sectionId}')"]`);
    activeLink.classList.add('active');
}

// Show the first section by default
document.addEventListener("DOMContentLoaded", function() {
    showSection('manageDoctors');
});
