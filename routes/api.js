var router = require('express').Router();

const usersController = require('../controllers/usersController');


router.post('/user/create', usersController.create);
router.patch('/user/update/:id', usersController.userUpdate);
router.get('/user/get_user/:id', usersController.getUser);
router.get('/user/get_all', usersController.getAllUsers);
router.delete('/user/remove/:id',usersController.deleteUsers);

module.exports = router;