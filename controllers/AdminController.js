const Doctor = require('../models/DoctorModel');
const Nurse = require('../models/NurseModel');
const Receptionist = require('../models/ReceptionistModel');
const Pharmacist = require('../models/PharmacistModel');
const MedicalService = require('../models/MedicalServiceModel');
const User = require('../models/UserModel');

module.exports = {
    async Dashboard(req, res) {
        try {
          console.log(req.session.user);
          
          const doctors = await Doctor.find()
          .populate('user', 'username fullname role')  
          .populate('service', 'name description price');     

          const nurses = await Nurse.find()
          .populate('user', 'username fullname role');  

          const pharmacists = await Pharmacist.find()
          .populate('user', 'username fullname role');  

          const receptionists = await Receptionist.find()
          .populate('user', 'username fullname role');  

          const patients = await User.find({ role: 'patient' });

          const medicalServices = await MedicalService.find();

          console.log(doctors)

          res.render('adminViews/admin.ejs', { 
            medicalServices,
            doctors,
            nurses,
            pharmacists,
            receptionists,
            patients
          });
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
    },
    async AddDoctor(req,res){
      const {fullname , specialization, service, email} = req.body;

      const newUser = new User({
        username: fullname.split(' ').join('_'),
        fullname,
        email,
        password: '123456',
        role: 'doctor'
      })

      await newUser.save();

       // Tạo một bác sĩ liên kết với người dùng
       const newDoctor = new Doctor({
          user: newUser._id, // Liên kết với user đã tạo
          specialization,
          service // Có thể đổi thành "medical service" nếu cần
      });

      // Lưu bác sĩ vào cơ sở dữ liệu
      await newDoctor.save();-
      res.redirect('/admin');
    },
    async ViewDoctor(req,res){
       // Lấy thông tin bác sĩ từ database
        const doctor = await Doctor.findById(req.params.id)
        .populate('user')  // Lấy thông tin từ bảng User
        .populate('service');  // Lấy thông tin từ bảng MedicalService

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }

      // Render EJS và truyền dữ liệu bác sĩ vào
      res.render('adminViews/viewDoctor', {
        doctor: doctor,
        user: doctor.user,
        service: doctor.service
      });
    },
    async AddNurse(req,res){

      const {fullname , department, shift , email} = req.body;

      const newUser = new User({
        username: fullname.split(' ').join('_'),
        fullname,
        email,
        password: '123456',
        role: 'nurse'   
      })

      await newUser.save();

       const newNurse = new Nurse({
          user: newUser._id, // Liên kết với user đã tạo
          department,
          shift 
      });

      await newNurse.save();
      res.redirect('/admin');
    },
    async ViewNurse(req, res){
      const nurse = await Nurse.findById(req.params.id)
      .populate('user')  // Kết nối thông tin user từ schema User
      .exec();

      if (!nurse) {
        return res.status(404).send('Nurse not found');
      }

      res.render('adminViews/viewNurse', { nurse }); // Gửi dữ liệu y tá vào view
    },
    // Controller to handle the edit nurse logic
    async EditNurse(req, res) {
      try {
        const { newDepartment, newShift } = req.body;
        const nurseId = req.params.id;

        // Tìm y tá theo nurseId và cập nhật thông tin department và shift
        const nurse = await Nurse.findById(nurseId);

        if (!nurse) {
          return res.status(404).send('Nurse not found');
        }

        // Cập nhật department và shift mới
        nurse.department = newDepartment;
        nurse.shift = newShift;

        // Lưu thông tin đã thay đổi
        await nurse.save();

        // Sau khi lưu, chuyển hướng về trang thông tin y tá hoặc gửi phản hồi thành công
        res.redirect(`/admin/nurse/view/${nurseId}`);  // Hoặc bạn có thể gửi một thông báo thành công
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    },
    async AddPharmacist(req, res){
      const {fullname , email, licenseNumber} = req.body;

      const newUser = new User({
        username: fullname.split(' ').join('_'),
        fullname,
        email,
        password: '123456',
        role: 'pharmacist'   
      })

      await newUser.save();

       const newPharmacist = new Pharmacist({
          user: newUser._id, // Liên kết với user đã tạo
          licenseNumber
      });

      await newPharmacist.save();
      res.redirect('/admin');
    },
    async ViewPharmacist(req,res){
      const pharmacistId = req.params.id;
      const pharmacist = await Pharmacist.findById(pharmacistId).populate('user');  
      if (!pharmacist) {
        return res.status(404).send('Pharmacist not found');
      }
      res.render('adminViews/viewPharmacist', { pharmacist });  
    },
    async AddReceptionist(req,res){
      
      const {fullname , department, shift , email} = req.body;

      const newUser = new User({
        username: fullname.split(' ').join('_'),
        fullname,
        email,
        password: '123456',
        role: 'receptionist'   
      })

      await newUser.save();

       const newReceptionist = new Receptionist({
          user: newUser._id, // Liên kết với user đã tạo
          department,
          shift 
      });

      await newReceptionist.save();
      res.redirect('/admin');
    },
    async ViewReceptionist(req, res){
      const receptionist = await Receptionist.findById(req.params.id)
      .populate('user')  // Kết nối thông tin user từ schema User
      .exec();

      if (!receptionist) {
        return res.status(404).send('Nurse not found');
      }

      res.render('adminViews/ViewReceptionist', { receptionist }); 
    },
    async EditReceptionist(req, res){
      try {
        const { newDepartment, newShift } = req.body;
        const receptionistId = req.params.id;

        // Tìm y tá theo nurseId và cập nhật thông tin department và shift
        const receptionist = await Receptionist.findById(receptionistId);

        if (!receptionist) {
          return res.status(404).send('receptionist not found');
        }

        // Cập nhật department và shift mới
        receptionist.department = newDepartment;
        receptionist.shift = newShift;

        // Lưu thông tin đã thay đổi
        await receptionist.save();

        // Sau khi lưu, chuyển hướng về trang thông tin y tá hoặc gửi phản hồi thành công
        res.redirect(`/admin/receptionist/view/${receptionistId}`);  // Hoặc bạn có thể gửi một thông báo thành công
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    }
}