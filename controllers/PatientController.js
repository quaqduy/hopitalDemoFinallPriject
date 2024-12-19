const MedicalService = require('../models/MedicalServiceModel');
const Doctor = require('../models/DoctorModel');

module.exports = {
    async Dashboard(req, res) {
        try {
          console.log(req.session.user);
          // Lấy tất cả các dịch vụ từ MongoDB
          const medicalServices = await MedicalService.find();
          const doctors = await Doctor.find();

          console.log(doctors)
      
          // Render trang patientDashboard và truyền medicalServices vào
          res.render('patientDashboard', { medicalServices });
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
    }
}