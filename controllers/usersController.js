const Users = require('../models/users');
const validator = require("../helpers/validate");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const secret = 'BHRTPO(TY&'

const UsersController = {

    async register(req, res) {
        const validationRule = {
            "name": "required|string",
            "email": 'required|email',
            "mobile": 'required|regex:/^([2346789]{1})([0-9]{9})$/',
            "password": 'required|string'
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
            console.log(isEmailExists);
            if (isEmailExists > 0) {
                errors = {
                    ...errors,
                    "email": [
                        "Email Must Be Uniqued"
                    ]
                }
            }

            let isMobileExists = await Users.countDocuments({
                mobile: req.body.mobile.toString()
            });
            if (isMobileExists > 0) {
                errors = {
                    ...errors,
                    "mobile": [
                        "Mobile Must Be Uniqued"
                    ]
                }
            }

            if (Object.keys(errors).length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: {
                            "errors": errors
                        }
                    });
            } else {
                var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                const createObj = {
                    name: req.body.name,
                    email: req.body.email.toLowerCase(),
                    mobile: req.body.mobile,
                    password: hashedPassword
                }
                const data = await new Users(createObj).save();

                var token = jwt.sign({
                    id: data._id
                }, secret, {
                    expiresIn: 86400
                });
                console.log("token---->",token, `Bearer ${token}`)

                let _data = {};
                let value = `Bearer ${token}`
                _data = {
                    ...data['_doc'],
                    'token': value,
                }

                res.status(200).send({
                    message: "Register Successfully.",
                    data: _data
                });
            }
        } catch (err) {
            res.status(406).send(err)
        }
    },

    async login(req, res) {
        const validationRule = {
            "username": "required|string",
            "password": "required|string"
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try {
            let username = req.body.username.toLowerCase();
            let user = {};
            let errors = {};
            let password = req.body.password;
            if (username.includes("@")) {
                user = await Users.findOne({ email: username });
                if (!user) {
                    errors['username'] = ["Email Not Exists!"]
                }
            } else {
                user = await Users.findOne({ mobile: username });
                if (!user) {
                    errors['username'] = ["Mobile Number Not Exists!"]
                }

            }
            if (user && user['password']) {
                let valid = await bcrypt.compare(password, user['password']);
                if (!valid) {
                    errors['username'] = ["Invalid Password!"];
                }
            }
            if (Object.keys(errors).length < 1) {
                var token = jwt.sign({
                    id: user._id
                }, secret, {
                    expiresIn: "30d"
                });
                console.log("token---->", token);

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({
                    message: 'Login Successfully',
                    data: { ...user['_doc'], token: `Bearer ${token}` }
                });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: errors
                    });
            }
        } catch (err) {
            console.log("err", err);
            res.status(406).send(err)
        }
    },
}

module.exports = UsersController;