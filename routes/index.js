const express = require('express');
const router = express.Router();

const StartRouter = require('./StartRouter');
const AdminRouter = require('./AdminRouter');
const AccountRouter = require('./AccountRouter');
const PatientRouter = require('./PatientRouter');
const DoctorRouter = require('./DoctorRouter');
const PharmacistRouter = require('./PharmacistRouter');
const NurseRouter = require('./NurseRouter');

//Start
router.use('/', StartRouter);
//SignIn_Up
router.use('/', AccountRouter);
//Admin
router.use('/admin', AdminRouter);
//patient
router.use('/patient', PatientRouter);
//doctor
router.use('/doctor', DoctorRouter);

//pharmacist
router.use('/pharmacist',PharmacistRouter);

//nurse
router.use('/nurse',NurseRouter);

//Bill
const Bill = require('../models/BillModel');
const MedicalService = require('../models/MedicalServiceModel');
const Drug = require('../models/DrugModel');
const SurgeryService = require('../models/SurgeryServiceModel');
const RoomRegister = require('../models/RoomRegisterModel');
router.get('/bill/:type/:id', async (req,res)=>{
    if(req.session.user){
        const typeBill = req.params.type; 
        const id = req.params.id; 
        let bill;
        if(typeBill == 'appointment'){
            bill = await Bill.find({patient: req.session.user._id, appointmentId: id})
            .populate('patient')
            .populate('appointmentId');

            const serviceInf = await MedicalService.findById(bill[0].appointmentId.service);

            bill = {...bill[0],serviceInf};
        }else if(typeBill == 'drug'){
            bill = await Bill.find({patient: req.session.user._id, patientDrugsId: id})
            .populate('patient')
            .populate('patientDrugsId');

            bill = bill[0];
            const drugLs =[];
            for(var drugId of bill.patientDrugsId.drugs){
                drugLs.push(await Drug.findById(drugId));
            }

            bill.patientDrugsId.drugs = drugLs;
        }else if(typeBill == 'surgery'){
            bill = await Bill.find({patient: req.session.user._id, surgeryRegistrationId: id})
            .populate('patient')
            .populate('surgeryRegistrationId');

            bill = bill[0];

            const surgeryInf = await SurgeryService.findById(bill.surgeryRegistrationId.surgeryService);

            bill = {...bill, surgeryInf};
        }else if(typeBill == 'room'){
            bill = await Bill.find({patient: req.session.user._id, roomId: id})
            .populate('patient')
            .populate('roomId');

            bill = bill[0];
        }

        let roomRegister = await RoomRegister.find({patient: req.session.user._id, roomId: id});
        roomRegister = roomRegister[0];
        res.render('bill',{typeBill ,bill,roomRegister});
    }else{
        res.redirect('/');
    }
    
});

module.exports = router;