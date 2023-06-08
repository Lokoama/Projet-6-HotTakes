const express = require("express")
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

// router.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
//   });


  router.get('/', auth, sauceCtrl.getAllSauce);
  router.post('/', auth, multer, sauceCtrl.createSauce);
  router.get('/:id', auth, sauceCtrl.getOneSauce);
  router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;