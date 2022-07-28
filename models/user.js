const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    email: {
        type:String,
        required:true
    },

    phone: {
        type:String,
        required:true
    },
    designation: {
        type: String,
        required: true,
      }
},{
    timestemps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model('Users', usersSchema);