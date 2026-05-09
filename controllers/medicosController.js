const pool = require('../db');


// Obtener médicos

const getMedicos = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                m.id,
                m.nombre,
                m.matricula,
                m.telefono,
                e.nombre AS especialidad
            FROM medicos m
            JOIN especialidades e
                ON m.id_especialidad = e.id
            ORDER BY m.nombre
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error interno'
        });
    }
};

module.exports = {
    getMedicos
};
