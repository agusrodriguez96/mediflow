const router = require('express').Router();

const auth = require('../middleware/auth');

const {
    getTurnos,
    crearTurno,
    cancelarTurno
} = require('../controllers/turnosController');

router.get('/', auth, getTurnos);

router.post('/', auth, crearTurno);

router.put('/:id/cancelar', auth, cancelarTurno);

module.exports = router;