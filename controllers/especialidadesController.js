const pool = require('../db');




const getEspecialidades = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM especialidades
            ORDER BY nombre
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
    getEspecialidades
};