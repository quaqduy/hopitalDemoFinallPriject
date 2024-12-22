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


const handleSurgeonModel = (id, surgeons, status) => {
    const selectDoctorForm = document.querySelector('#selectDoctorForm');

    // Reset tất cả checkbox trước khi áp dụng
    selectDoctorForm.querySelectorAll('input[name="Surgeon"]').forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Đánh dấu các bác sĩ đã được chọn
    surgeons.split(',').forEach((surgeonId) => {
        const doctorCheckbox = selectDoctorForm.querySelector(`input[value="${surgeonId}"]`);
        if (doctorCheckbox) {
            doctorCheckbox.checked = true;
        }
    });
    if(status === 'Completed'){
        document.querySelector('#saveSelectedDoctors').disabled = true;
    }

    // Cập nhật action cho form
    selectDoctorForm.setAttribute('action', `/admin/surgery/surgeons/${id}`);
};
