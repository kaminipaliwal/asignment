var router = require('express').Router();

const employeesController = require('../controllers/EmployeesController');
const UsersController = require('../controllers/UsersController');
const authMiddleware = require('../middleware/auth-middleware');

router.post('/user/register', UsersController.register);
router.post('/user/login',authMiddleware, UsersController.login);

router.post('/employee/create',authMiddleware, employeesController.create);
router.patch('/employee/update/:id',authMiddleware, employeesController.employeeUpdate);
router.get('/employee/get_employee/:id',authMiddleware, employeesController.getEmployee);
router.get('/employee/get_all',authMiddleware, employeesController.getAllEmployee);
router.delete('/employee/remove/:id',authMiddleware,employeesController.deleteEmployee);

module.exports = router;