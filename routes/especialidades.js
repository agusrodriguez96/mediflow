const router = require('express').Router();

const {
    getEspecialidades
} = require('../controllers/especialidadesController');


// GET especialidades

router.get('/', getEspecialidades);


module.exports = router;