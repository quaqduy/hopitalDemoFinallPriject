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
        if(req.session.user && req.session.user.role == 'pharmacist'){
            return next();
        }else{
            res.redirect('/');
        }
    },
    async Dashboard(req, res) {
        const drugs = await Drug.find().populate('medicalService', 'name');
        const medicalServices = await MedicalService.find();

        const patientDrugs = await PatientDrugs.find()
        .populate('appointmentId');

        const patientDrugsInf = [];

        for (const item of patientDrugs) {
            const patientInf = await User.findById(item.appointmentId.patient);
            const doctorInf = await Doctor.findById(item.appointmentId.doctor).populate('user');
            const drugIds = item.drugs;
            const drugsRender = [];

            for(var drugId of drugIds){
                for(var drug of drugs){
                    if(drug._id.toString() == drugId.toString()){
                        drugsRender.push(drug);
                    }
                }
            }

            patientDrugsInf.push({
                _id: item._id,
                appointmentId: item.appointmentId._id,
                patientInf,
                doctorInf: doctorInf.user,
                drugs: drugsRender,
                status: item.status
            });
        }

        res.render('pharmacistViews/dashboard', {drugs, medicalServices, patientDrugsInf, userInf: req.session.user});       
    },
    async createDrug(req, res) {
        try {
          const { id, ...newDrugInf } = req.body; // Bỏ qua `id` nếu có
          const drug = new Drug(newDrugInf);
          await drug.save();
          res.redirect('/pharmacist/dashboard');
        } catch (err) {
          res.status(400).json({ message: 'Error creating drug', error: err.message });
        }
      },
    async updateDrug(req, res) {
    try {
        const { id } = req.params;
        const { ...updatedDrugInf } = req.body;

        const drug = await Drug.findByIdAndUpdate(id, updatedDrugInf, { new: true, runValidators: true });
        if (!drug) {
        return res.status(404).json({ message: 'Drug not found' });
        }
        res.redirect('/pharmacist/dashboard');
    } catch (err) {
        res.status(400).json({ message: 'Error updating drug', error: err.message });
    }
    },

    async deleteDrug(req, res) {
    try {
        const { id } = req.params;
        const drug = await Drug.findByIdAndDelete(id);

        if (!drug) {
        return res.status(404).json({ message: 'Drug not found' });
        }
        res.redirect('/pharmacist/dashboard');
    } catch (err) {
        res.status(500).json({ message: 'Error deleting drug', error: err.message });
    }
    },
    async statusDrug(req,res){
        const id = req.params.id;
        const patientDrugs = await PatientDrugs.findById(id);
        patientDrugs.status = 'Dispensed';

        const drugIds = patientDrugs.drugs;
        const updatePromises = drugIds.map(async (idDrug) => {
            const drug = await Drug.findById(idDrug); // Directly find the drug by its ID
            console.log(idDrug)
            if (drug) {
                drug.quantity -= 1; // Decrease the quantity
                await drug.save(); // Save the updated drug
            }
        });

        await Promise.all(updatePromises); // Wait for all updates to complete

        patientDrugs.save();

        res.redirect('/pharmacist/dashboard');
    }
}