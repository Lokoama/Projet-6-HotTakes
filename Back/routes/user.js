const express = require ("express");
const router = express.Router();

const userCtrl = require('../controllers/user');

//routes pour l'inscription et la connexion d'utilisateurs
router.post ('/signup', userCtrl.signup);
router.post ('/login', userCtrl.login)

module.exports = router;