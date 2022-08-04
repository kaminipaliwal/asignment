const mongoose = require('mongoose');

const employeesSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    date_of_birth: {
        type:String,
        required:true
    },
    home_address: {
        type:String,
        required:true
    },
},{
    timestemps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model('Employees', employeesSchema);