const pool = require('../db');

const getTurnos = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                t.id,
                u.nombre AS paciente,
                m.nombre AS medico,
                e.nombre AS especialidad,
                t.fecha,
                t.hora,
                t.estado
            FROM turnos t
            JOIN usuarios u
                ON t.id_usuario = u.id
            JOIN medicos m
                ON t.id_medico = m.id
            JOIN especialidades e
                ON m.id_especialidad = e.id
            ORDER BY t.fecha, t.hora
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error interno'
        });
    }
};



const crearTurno = async (req, res) => {

    const {
        id_medico,
        fecha,
        hora
    } = req.body;

    const id_usuario = req.usuario.id;

    try {

        await pool.query(
            'CALL reservar_turno($1, $2, $3, $4)',
            [id_usuario, id_medico, fecha, hora]
        );

        res.status(201).json({
            message: 'Turno reservado'
        });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};


const cancelarTurno = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const { id } = req.params;

        const turno = await client.query(
            'SELECT * FROM turnos WHERE id = $1',
            [id]
        );

        if (turno.rows.length === 0) {
            throw new Error('Turno inexistente');
        }

        await client.query(
            `UPDATE turnos
             SET estado = 'cancelado'
             WHERE id = $1`,
            [id]
        );

        await client.query(
            `INSERT INTO auditoria_turnos
            (id_turno, accion)
            VALUES ($1, $2)`,
            [id, 'Cancelación manual desde API']
        );

        await client.query('COMMIT');

        res.json({
            message: 'Turno cancelado'
        });

    } catch (error) {

        await client.query('ROLLBACK');

        res.status(500).json({
            error: error.message
        });

    } finally {

        client.release();
    }
};

module.exports = {
    getTurnos,
    crearTurno,
    cancelarTurno
}