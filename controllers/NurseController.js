const MedicalService = require('../models/MedicalServiceModel');
const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentModel');
const User = require('../models/UserModel');
const TestResult = require('../models/TestResultModel');
const Drug = require('../models/DrugModel');
const PatientDrugs = require('../models/PatientDrugsModel');
const SurgeryRegistration = require('../models/SurgeryRegistrationModel');
const Room = require('../models/RoomModel');
const Nurse = require('../models/NurseModel');
const RoomRegister = require('../models/RoomRegisterModel');
const PatientCondition = require('../models/PatientConditionModel');

module.exports = {
    checkRole(req, res, next){
        if(req.session.user && req.session.user.role == 'nurse'){
            return next();
        }else{
            res.redirect('/');
        }
    },
    async Dashboard(req, res) {
        const currentNurse = await Nurse.find({user: req.session.user._id});
        const rooms = await Room.find({nurseId : currentNurse[0]._id});
        const roomRegisters = await RoomRegister.find()
        .populate('userId')
        .populate('roomId');

        const ownRoomRegisters = roomRegisters.filter((item) => {
            return item.roomId.nurseId.toString() == currentNurse[0]._id.toString();
        });
       
        const patientConditions = await PatientCondition.find({nurseId: currentNurse[0]._id})
        .populate('nurseId')
        .populate('patientId')
        .populate('roomId');

        res.render('nurseViews/dashboard', {rooms, ownRoomRegisters, patientConditions, userInf: req.session.user});       
    },
    async acceptRequest(req,res){
        const id = req.params.id;
        const roomRegister = await RoomRegister.findById(id);
        roomRegister.status = "Accepted";
        roomRegister.save();
        const roomId = roomRegister.roomId;
        const currentRoom = await Room.findById(roomId);
        currentRoom.emptyBeds -= 1;
        currentRoom.save();

        const newPatientCondition = new PatientCondition({
            patientId: roomRegister.userId,
            nurseId: currentRoom.nurseId,
            roomId: roomRegister.roomId
        })

        newPatientCondition.save();

        res.redirect('/nurse/dashboard');
    },
    async cancelRequest(req, res){
        const id = req.params.id;
        const roomRegister = await RoomRegister.findById(id);
        roomRegister.status = "Cancelled";
        roomRegister.save();
        res.redirect('/nurse/dashboard'); 
    },
    async updateDescription(req, res){

        const {
            idRecord,
            description
        } = req.body;

        const updateItem =  await PatientCondition.findById(idRecord);
        updateItem.description = description.trim();
        updateItem.save();
        res.redirect('/nurse/dashboard');
    },
    async updateStatus(req,res){
        const idRecord = req.params.id;
        const updateItem =  await PatientCondition.findById(idRecord);
        updateItem.status = 'Discharged';
        updateItem.save();

        const roomUpdate = await Room.findById(updateItem.roomId);
        roomUpdate.emptyBeds += 1;
        roomUpdate.save();
        res.redirect('/nurse/dashboard');
    }
}