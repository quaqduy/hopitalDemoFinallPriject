const MedicalService = require('../models/MedicalServiceModel');
const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentModel');
const User = require('../models/UserModel');
const TestResult = require('../models/TestResultModel');
const Drug = require('../models/DrugModel');
const PatientDrugs = require('../models/PatientDrugsModel');
const SurgeryRegistration = require('../models/SurgeryRegistrationModel');
const Bill = require('../models/BillModel');
const mongoose = require('mongoose');

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
        const appointment = await Appointment.findById(id)
        .populate('patient')
        .populate('service');

        appointment.status = 'Completed';
        appointment.save();

        const newBill = new Bill({
            patient: appointment.patient._id,
            appointmentId: appointment._id,
            totalPrice: appointment.service.price,
            status: 'Paid'
        })

        await newBill.save();

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
        
        req.session.patient = appointment.patient;

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
    
        try {
            // Kiểm tra xem cuộc hẹn đã có thuốc kê chưa
            const existingPatientDrugs = await PatientDrugs.findOne({ appointmentId: apmId });
    
            let currentDrugs = existingPatientDrugs;
            // Nếu đã có thông tin thuốc cho cuộc hẹn này, thực hiện update
            if (existingPatientDrugs) {
                // Cập nhật danh sách thuốc
                existingPatientDrugs.drugs = req.body.drugIds; // Cập nhật danh sách thuốc
                currentDrugs = existingPatientDrugs;
                await existingPatientDrugs.save(); // Lưu thay đổi vào cơ sở dữ liệu
                console.log('Updated patient drugs successfully!');
            } else {
                // Nếu chưa có, tạo mới thông tin thuốc
                const newPatientDrugs = new PatientDrugs({
                    appointmentId: apmId,
                    drugs: req.body.drugIds,
                });
                await newPatientDrugs.save(); // Lưu vào cơ sở dữ liệu
                currentDrugs = newPatientDrugs;
                console.log('Saved new patient drugs successfully!');
            }
    
            let drugsTotalPrice = 0;
            if(typeof req.body.drugIds == 'string'){
                const drugInf = await Drug.findById(req.body.drugIds);
                drugsTotalPrice += drugInf?.price || 0;
            }else{
                for (const dr of req.body.drugIds) {
                    const drugId = dr; 
                    const drugInf = await Drug.findById(drugId);
                    drugsTotalPrice += drugInf?.price || 0;
                }
            }

            // Tìm bill theo điều kiện
            let bill = await Bill.findOne({
                patient: req.session.patient._id,
                patientDrugsId: currentDrugs._id
            });

            if (bill) {
                // Nếu bill tồn tại, cập nhật totalPrice
                bill.totalPrice = drugsTotalPrice;
                await bill.save();
            } else {
                // Nếu chưa tồn tại, tạo mới bill
                bill = new Bill({
                    patient: req.session.patient._id,
                    patientDrugsId: currentDrugs._id,
                    totalPrice: drugsTotalPrice
                });
                await bill.save();
            }

            req.session.patient = null;

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
  
        const surgeryRegistration = await SurgeryRegistration.findById(id)
        .populate('patient')
        .populate('surgeryService');
        surgeryRegistration.status = status;
        surgeryRegistration.save(); 

        if (status == 'Completed') {
            // Kiểm tra xem hóa đơn đã tồn tại chưa
            const existingBill = await Bill.findOne({
                patient: surgeryRegistration.patient,
                surgeryRegistrationId: surgeryRegistration._id
            });
        
            // Nếu hóa đơn đã tồn tại, không tạo mới
            if (!existingBill) {
                const newBill = new Bill({
                    patient: surgeryRegistration.patient,
                    surgeryRegistrationId: surgeryRegistration._id,
                    totalPrice: surgeryRegistration.surgeryService.price
                });
        
                // Lưu hóa đơn mới vào cơ sở dữ liệu
                await newBill.save();
            }
        }
      
        res.redirect('/doctor/Dashboard');
      },
}