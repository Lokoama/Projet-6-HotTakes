const express = require("express")
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

//Routes définit dans le '../controllers/sauce'. Les routes ont un auth qui ne permet qu'aux utilisateurs avec le bon ID d'interagir avec elles.
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeAndDislike);


module.exports = router;