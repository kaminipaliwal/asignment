
const { ObjectId } = require('mongodb');
const Users = require('../models/user');
const validator = require("../helpers/validate")

const UsersController = {
  
    async create(req,res) {
        const validationRule = {
            "name": "required|string",
            "email": 'required|email',
            "phone": 'required|regex:/^([2346789]{1})([0-9]{9})$/',
            "designation": "required|string"
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        try {
            let errors = {};
            let isEmailExists = await Users.countDocuments({
                email: req.body.email.toLowerCase()
            });

            if(isEmailExists > 0) {
                errors = {
                    ...errors,
                    "email": [
                        "Email Must Be Uniqued"
                    ]
                }
            }

            let isPhoneExists = await Users.countDocuments({
                phone: req.body.phone.toString()
            });

            if(isPhoneExists > 0) {
                errors = {
                    ...errors,
                    "mobile" : [
                        "Mobile Must Be Uniqued"
                    ]
                }
            }
           if (Object.keys(errors).length > 0) {
              res.setHeader('Content-Type', 'application/json');
              res.status(422).send({
                success:false,
                message: "Errors",
                data: {
                    "errors": errors
                }
              })
           } else {
            const userData= {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                designation: req.body.designation
            };
            console.log(userData);
            const data = await new Users(userData).save();
            console.log(data);
            res.status(200).send({
                message: "Data Inserted Successfully.",
                data:data
            })
           }
        }catch(err) {
            console.log("err",err);
        res.status(422).send(err)
        }
    },

    async userUpdate(req,res) {
        const validationRule = {
            "name": "required|string",
            "email": 'required|email',
            "phone": 'required|regex:/^([2346789]{1})([0-9]{9})$/',
            "designation": "required|string"
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        try {
            let errors = {};
            let isEmailExists = await Users.countDocuments({
                email: req.body.email.toLowerCase()
            });

            if(isEmailExists > 0) {
                errors = {
                    ...errors,
                    "email": [
                        "Email Must Be Uniqued"
                    ]
                }
            }

            let isPhoneExists = await Users.countDocuments({
                phone: req.body.phone.toString()
            });

            if(isPhoneExists > 0) {
                errors = {
                    ...errors,
                    "mobile" : [
                        "Mobile Must Be Uniqued"
                    ]
                }
            }
           if (Object.keys(errors).length > 0) {
              res.setHeader('Content-Type', 'application/json');
              res.status(422).send({
                success:false,
                message: "Errors",
                data: {
                    "errors": errors
                }
              })
           } else {
            const userData= {
                name: req.body.name ? req.body.name : "Hello",
                email: req.body.email ? req.body.email : "Hello@gmail.com",
                phone: req.body.phone ? req.body.phone : "8979909890",
                designation: req.body.designation ? req.body.designation : ""
            };
            console.log(userData);
            const data = await Users.updateOne({
                _id: ObjectId(req.params.id)
            },
            {
                $set : userData
            });
            console.log(data);
            res.status(200).send({
                message: "Data Updated Successfully.",
                data:data
            })
           }
        }catch(err) {
            console.log("err",err);
        res.status(422).send(err)
        }
    },

    async getUser(req,res) {
        try {
            const data = await Users.find({_id: ObjectId(req.params.id)});
            res.status(200).send({
                message: "Data Retrieved Successfully.",
                data:data
            });
        } catch (err) {
            console.log("err-",err);
            res.status(422).send(err);
        }
    },

    async getAllUsers(req,res) {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10 ;
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let skip = (page > 1) ? ((page - 1) * limit) : 0
            const data = await Users.find({}).skip(skip).limit(limit);
            res.status(200).send({
                message: "Data Retrieved Successfully.",
                data:data
            });
        } catch (err) {
            console.log("err-",err);
            res.status(422).send(err);
        }
    },

    async deleteUsers(req, res){
       try {
        const data = await Users.deleteOne({_id: ObjectId(req.params.id)});
        res.status(200).send({
            message: "Data Retrieved Succesfully.",
            data:data
        })
       } catch (err) {
         console.log("err",err);
         res.status(422).send(err);
       }
    }
 
}


module.exports = UsersController;