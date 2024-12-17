// JavaScript to show/hide sections
document.querySelectorAll('.sidebar a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Hide all sections
        document.querySelectorAll('.main-content > div').forEach((section) => {
            section.style.display = 'none';
        });
        
        // Show the clicked section
        const target = e.target.getAttribute('href').substring(1);
        document.getElementById(target).style.display = 'block';
    });
});
