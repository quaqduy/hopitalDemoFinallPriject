const MedicalService = require('../models/MedicalServiceModel');
const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentModel');
const User = require('../models/UserModel');
const TestResult = require('../models/TestResultModel');
const PatientDrugs = require('../models/PatientDrugsModel');
const Drug = require('../models/DrugModel');
const SurgeryService = require('../models/SurgeryServiceModel');
const SurgeryRegistration = require('../models/SurgeryRegistrationModel');
const Room = require('../models/RoomModel');
const RoomRegister = require('../models/RoomRegisterModel');

module.exports = {
    checkRole(req, res, next){
        if(req.session.user && req.session.user.role == 'patient'){
            return next();
        }else{
            res.redirect('/');
        }
    },
    async Dashboard(req, res) {
        try {
          // Lấy tất cả các dịch vụ từ MongoDB
          const medicalServices = await MedicalService.find();
          const doctors = await Doctor.find().populate('user', 'username fullname role');

          const appointments = await Appointment.find({ user: req.session.user._id })
            .populate('doctor') 
            .populate('patient', 'username fullname role')
            .populate('service');

            const medicationLs = [];
            const drugResultLs = await PatientDrugs.find();
            
            for (let drugResult of drugResultLs) {
              for (let apm of appointments) {
                // So sánh ID của cuộc hẹn và drugResult
                if (drugResult.appointmentId.toString() === apm._id.toString()) {
                  medicationLs.push({
                    drugResult,
                    appointment: apm
                  });
                }
              }
            }
            
            const drugsInf = await Drug.find();

            const surgeryServices = await SurgeryService.find();

            const surgeryRegistrations = await SurgeryRegistration.find({patient : req.session.user._id})
            .populate('surgeryService')
            .populate('patient');

            const rooms = await Room.find(); 

            const roomRegisters = await RoomRegister.find({user: req.session.user._id}).populate('roomId');
      
          // Render trang patientDashboard và truyền medicalServices vào
          res.render('patientViews/patientDashboard', { userInf: req.session.user , medicalServices , 
            doctors , appointments, medicationLs,drugsInf,
            surgeryServices, surgeryRegistrations, rooms,
            roomRegisters});
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
    },
    async makeAppointment(req, res){
      const {service, doctorId, appointmentDate, appointmentTime} = req.body;

      const newAppointment = new Appointment({
        patient: req.session.user._id,
        doctor: doctorId,
        service: service,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime
      });

      const newTestResult = new TestResult({
        appointment: newAppointment._id,
        serviceType: 'Check-up',
        resultDetails: ''
      });

      await newAppointment.save();
      await newTestResult.save();
      res.redirect('/patient/dashboard');
    },
    async updateUserInfor(req, res) {
      const {
        fullname,
        username,
        email,
        address,
        phoneNumber
      } = req.body;
    
      // Tìm người dùng theo ID từ session
      const currentUser = await User.findById(req.session.user._id);
    
      // Kiểm tra nếu người dùng không tồn tại
      if (!currentUser) {
        return res.status(404).send('User not found');
      }
    
      // Cập nhật thông tin người dùng
      currentUser.fullname = fullname;
      currentUser.username = username;
      currentUser.email = email;
      currentUser.address = address;
      currentUser.phoneNumber = phoneNumber;
    
      // Lưu thông tin đã cập nhật vào cơ sở dữ liệu
      await currentUser.save();

      req.session.user = currentUser;
    
      // Chuyển hướng đến trang dashboard của bệnh nhân
      res.redirect('/patient/dashboard');
    },
    async viewResult(req,res){
      const id = req.params.id;
      
      const appointment = await Appointment.findById(id)
      .populate('patient')
      .populate('service');
      const testResult = await TestResult.find({appointment:id});

      res.render('patientViews/resultView',{appointment, testResult:testResult[0]});
    },
    async makeSurgery(req, res){
      const {
        surgeryService,
        surgeryDate,
        surgeryTime
      } = req.body;

      const newSurgeryRegistration = new SurgeryRegistration({
        patient: req.session.user._id,
        surgeryService,
        surgeryDate,
        surgeryTime
      })

      await newSurgeryRegistration.save();
      res.redirect('/patient/dashboard');
    },
    async roomRegister(req, res){
      const {
        roomId,
        startDate,
        endDate
      } = req.body;
      const newRoomRegister = new RoomRegister({
        userId: req.session.user._id,
        roomId,
        startDate,
        endDate
      })

      await newRoomRegister.save();

      res.redirect('/patient/dashboard');
    }
}