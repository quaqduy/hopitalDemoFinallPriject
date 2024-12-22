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

const renderDoctor = (serviceId)=>{
  const doctorsRender = [];
  if(doctorsData && doctorsData.length > 0){
    doctorsData.forEach((item)=>{
      if(item.service == serviceId){
        doctorsRender.push({
          fullname : item.user.fullname,
          id : item._id
        })
      }
    })
  }

  const htmls = doctorsRender.map((item)=>{
    return `
      <option value="${item.id}">${item.fullname}</option>
    `
  });
  document.querySelector('#doctorOrDepartment').innerHTML = ' <option value="" disabled selected>Select a doctor</option> ' + htmls.join(' ');
}
