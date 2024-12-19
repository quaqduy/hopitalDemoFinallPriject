function showSection(sectionId) {
  // Hide all sections
  var sections = document.querySelectorAll('section');
  sections.forEach(function(section) {
    section.classList.remove('active');
  });

  // Show the selected section
  var section = document.getElementById(sectionId);
  section.classList.add('active');
}