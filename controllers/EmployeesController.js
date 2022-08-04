const { ObjectId } = require('mongodb');
const Employees = require('../models/employees');
const validator = require("../helpers/validate");

const EmployeesController = {
  
    async create(req,res) {
        const validationRule = {
            "name": "required|string",
            "date_of_birth": 'required|string',
            "home_address" : 'required|string'
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

            const userData= {
                name: req.body.name,
                date_of_birth: req.body.date_of_birth,
                home_address: req.body.home_address,
            };
           
            console.log(userData);
            const data = await new Employees(userData).save();
            console.log(data);
            res.status(200).send({
                message: "Data Inserted Successfully.",
                data:data
            })
        }catch(err) {
            console.log("err",err);
        res.status(422).send(err)
        }
    },

    async employeeUpdate(req,res) {
        const validationRule = {
            "name": "required|string",
            "date_of_birth": 'required|string',
            "home_address" : 'required|string'
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
          
            const userData= {
                name: req.body.name ? req.body.name : "",
                date_of_birth: req.body.date_of_birth ? req.body.date_of_birth : "",
                home_address: req.body.home_address ? req.body.home_address : "",
            };
            console.log(userData);
            const data = await Employees.updateOne({
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
        }catch(err) {
            console.log("err",err);
        res.status(422).send(err)
        }
    },

    async getEmployee(req,res) {
        try {
            const data = await Employees.find({_id: ObjectId(req.params.id)});
            res.status(200).send({
                message: "Data Retrieved Successfully.",
                data:data
            });
        } catch (err) {
            console.log("err-",err);
            res.status(422).send(err);
        }
    },

    async getAllEmployee(req,res) {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10 ;
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let skip = (page > 1) ? ((page - 1) * limit) : 0
            const data = await Employees.find({}).skip(skip).limit(limit);
            res.status(200).send({
                message: "Data Retrieved Successfully.",
                data:data
            });
        } catch (err) {
            console.log("err-",err);
            res.status(422).send(err);
        }
    },

    async deleteEmployee(req, res){
       try {
        const data = await Employees.deleteOne({_id: ObjectId(req.params.id)});
        console.log(data);
        res.status(200).send({
            message: "Data Deleted Succesfully.",
            data:data
        })
       } catch (err) {
         console.log("err",err);
         res.status(422).send(err);
       }
    }
 
}


module.exports = EmployeesController;