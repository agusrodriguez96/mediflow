const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const { nombre, email, password } = req.body;

    try {

        const existe = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (existe.rows.length > 0) {

            return res.status(400).json({
                error: 'El email ya existe'
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO usuarios
            (nombre, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, email, rol`,
            [nombre, email, hash]
        );

        const usuario = result.rows[0];

        const token = jwt.sign(     //genera token para ingresar automaticamente sin tener q volver al login
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );



        // RESPUESTA

        res.status(201).json({

            message: 'Usuario registrado correctamente',

            token,

            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error interno'
        });
    }
};

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const usuario = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.json({
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error interno'
        });
    }
};

module.exports = {
    register,
    login
};