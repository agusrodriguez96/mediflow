require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const turnosRoutes = require('./routes/turnos');
const medicosRoutes = require('./routes/medicos');
const especialidadesRoutes = require('./routes/especialidades');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/especialidades', especialidadesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});