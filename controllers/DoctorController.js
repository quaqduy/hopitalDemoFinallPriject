const MedicalService = require('../models/MedicalServiceModel');
const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentModel');
const User = require('../models/UserModel');
const TestResult = require('../models/TestResultModel');
const Drug = require('../models/DrugModel');
const PatientDrugs = require('../models/PatientDrugsModel');
const SurgeryRegistration = require('../models/SurgeryRegistrationModel');

module.exports = {
    checkRole(req, res, next){
        if(req.session.user && req.session.user.role == 'doctor'){
            return next();
        }else{
            res.redirect('/');
        }
    },
    async Dashboard(req, res) {
        const doctor = await Doctor.find({user:req.session.user._id});
        const appointments = await Appointment.find({doctor : doctor[0]._id}).populate('patient');

        let SurgeryRegistrationLS = await SurgeryRegistration.find().populate('patient').populate('surgeryService');
        let docOwnSurgeryRegistLs = [];
        SurgeryRegistrationLS.forEach((i)=>{
            for(var docId of i.surgeons){
                if(docId.toString() == doctor[0]._id.toString()){
                    docOwnSurgeryRegistLs.push(i);
                }
            }
        })

        res.render('doctorViews/doctorDashboard', {appointments, docOwnSurgeryRegistLs,userInf: req.session.user});       
    },
    async acceptAppointment(req,res){
        const id = req.params.id;
        const appointment = await Appointment.findById(id);

        appointment.status = 'Scheduled';
        appointment.save();
        res.redirect('/doctor/dashboard');
    },
    async cancelAppointment(req,res){
        const id = req.params.id;
        const appointment = await Appointment.findById(id);

        appointment.status = 'Cancelled';
        appointment.save();
        res.redirect('/doctor/dashboard');
    },
    async completeAppointment(req, res){
        const id = req.params.id;
        const appointment = await Appointment.findById(id);

        appointment.status = 'Completed';
        appointment.save();
        res.redirect('/doctor/dashboard');
    },
    async viewResult(req,res){
        const id = req.params.id;

        const appointment = await Appointment.findById(id)
        .populate('patient')
        .populate('service');
        const testResult = await TestResult.find({appointment:id});

        const drugs = await Drug.find();

        const patientDrugsIdls = await PatientDrugs.find({appointmentId:id})
        

        res.render('doctorViews/resultView',{appointment, testResult:testResult[0], drugs , patientDrugsId: patientDrugsIdls[0].drugs});
    },
    async saveResult(req, res) {
        const id = req.params.id;
        const {
            appointment,
            serviceType,
            resultDetails,
            testType
        } = req.body;
    
        console.log(req.body);
    
        try {
            // Tìm và cập nhật hoặc tạo mới
            const updatedResult = await TestResult.findOneAndUpdate(
                { appointment }, // Điều kiện tìm kiếm
                {
                    appointment,
                    serviceType,
                    resultDetails: resultDetails.trim(),
                    testType: serviceType === 'Test' ? testType : ""
                },
                {
                    new: true, // Trả về tài liệu đã cập nhật
                    upsert: true, // Nếu không tìm thấy, tạo mới
                }
            );
    
            console.log("Saved or updated result:", updatedResult);
    
            // Chuyển hướng về trang hiển thị kết quả
            res.redirect(`/doctor/viewResultPage/${id}`);
        } catch (error) {
            console.error("Error saving or updating test result:", error);
            res.status(500).send("An error occurred while saving or updating the test result.");
        }
    },
    async saveDrug(req, res) {
        const apmId = req.params.id; // Lấy id cuộc hẹn từ URL
        console.log(req.body);
    
        try {
            // Kiểm tra xem cuộc hẹn đã có thuốc kê chưa
            const existingPatientDrugs = await PatientDrugs.findOne({ appointmentId: apmId });
    
            // Nếu đã có thông tin thuốc cho cuộc hẹn này, thực hiện update
            if (existingPatientDrugs) {
                // Cập nhật danh sách thuốc
                existingPatientDrugs.drugs = req.body.drugIds; // Cập nhật danh sách thuốc
                await existingPatientDrugs.save(); // Lưu thay đổi vào cơ sở dữ liệu
                console.log('Updated patient drugs successfully!');
            } else {
                // Nếu chưa có, tạo mới thông tin thuốc
                const newPatientDrugs = new PatientDrugs({
                    appointmentId: apmId,
                    drugs: req.body.drugIds,
                });
                await newPatientDrugs.save(); // Lưu vào cơ sở dữ liệu
                console.log('Saved new patient drugs successfully!');
            }
    
            // Sau khi cập nhật hoặc lưu thành công, chuyển hướng đến trang kết quả cuộc hẹn
            res.redirect(`/doctor/viewResultPage/${apmId}`);
        } catch (error) {
            console.error('Error saving/updating patient drugs:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async surgeryStatusHandle(req, res){
        const id = req.params.id;
        const status = req.params.value;
  
        const surgeryRegistration = await SurgeryRegistration.findById(id);
        surgeryRegistration.status = status;
        surgeryRegistration.save(); 
        res.redirect('/doctor/Dashboard');
      },
}