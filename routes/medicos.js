const router = require('express').Router();

const {
    getMedicos
} = require('../controllers/medicosController');


// GET médicos

router.get('/', getMedicos);


module.exports = router;