-------------------------------------------------------
----- mediflow database: sistema de turnos medicos-----
-------------------------------------------------------

DROP TABLE IF EXISTS auditoria_turnos CASCADE;
DROP TABLE IF EXISTS turnos CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;




--tablas: usuarios, especialidades, medicos, turnos.--

--1. usuarios--

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'paciente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--2. especialidades--

CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);


--3. médicos--

CREATE TABLE medicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(30),
    id_especialidad INT NOT NULL,

    CONSTRAINT fk_especialidad
        FOREIGN KEY(id_especialidad)
        REFERENCES especialidades(id)
);


--4. turnos: la tabla principal y más importante--

CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_medico INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id),

    CONSTRAINT fk_medico
        FOREIGN KEY(id_medico)
        REFERENCES medicos(id),

    CONSTRAINT check_estado
        CHECK (
            estado IN (
                'pendiente',
                'confirmado',
                'cancelado',
                'atendido'
            )
        )
);


--restricción para evitar turnos duplicados--

ALTER TABLE turnos
ADD CONSTRAINT unique_turno
UNIQUE(id_medico, fecha, hora);

--tabla: auditoria_turnos, el trigger necesita un lugar donde guardar la info--

CREATE TABLE auditoria_turnos (
    id SERIAL PRIMARY KEY,
    id_turno INT,
    accion VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--insert de datos de prueba--

--usuarios--

INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES
('Facundo González', 'fgonzalez@example.com.ar', '$2y$12$eImiTXuWVxfM37uY4JANjO.o5p5vVDZp6P5N5N5N5N5N5N5N5N5N', 'paciente'),
('Martina Rodríguez', 'm.rodriguez@mail.com.ar', '$2y$12$L7R6k1vWzQ9P8O7N6M5L4K3J2I1H0G9F8E7D6C5B4A3Z2Y1X0W9V', 'paciente'),
('Bautista López', 'bauti_lopez88@gmail.com', '$2y$12$K8J9H0G1F2E3D4C5B6A7Z8Y9X0W1V2U3T4S5R6Q7P8O9N0M1L2K3', 'paciente'),
('Valentina García', 'v.garcia.doc@yahoo.com.ar', '$2y$12$A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6', 'paciente'),
('Mateo Fernández', 'mfernandez_salud@outlook.com', '$2y$12$Z1Y2X3W4V5U6T7S8R9Q0P1O2N3M4L5K6J7I8H9G0F1E2D3C4B5A6', 'paciente'),
('Sofía Martínez', 'smartinez.92@example.com', '$2y$12$M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6', 'paciente'),
('Joaquín Pérez', 'jperez_ar@proveedor.com.ar', '$2y$12$Q7W8E9R0T1Y2U3I4O5P6A7S8D9F0G1H2J3K4L5Z6X7C8V9B0N1M2', 'paciente'),
('Lucía Álvarez', 'lucia_alvarez_85@mail.ar', '$2y$12$V1B2N3M4A5S6D7F8G9H0J1K2L3P4O5I6U7Y8T9R0E1W2Q3Z4X5C6', 'paciente'),
('Santiago Romero', 'santi.romero.ok@gmail.com', '$2y$12$X1C2V3B4N5M6L7K8J9H0G1F2D3S4A5P6O7I8U9Y0T1R2E3W4Q5Z6', 'paciente'),
('Delfina Herrera', 'dherrera_paciente@example.org', '$2y$12$T1R2E3W4Q5Z6X7C8V9B0N1M2L3K4J5H6G7F8D9S0A1P2O3I4U5Y6', 'paciente');

--especialidades--

INSERT INTO especialidades (nombre, descripcion)
VALUES
('Traumatología Deportiva', 'Diagnóstico y tratamiento de lesiones.'),
('Kinesiología y Fisiatría', 'Rehabilitación física integral.'),
('Nutrición Deportiva', 'Planes de alimentación específicos para el atleta.'),
('Cardiología', 'Realización de ergometrías y control preventivo para una práctica segura.'),
('Psicología del Deporte', 'Entrenamiento de procesos cognitivos para mejorar el enfoque.');

--médicos--

INSERT INTO medicos (nombre, matricula, telefono, id_especialidad)
VALUES
('Raúl Montenegro', 'MN 112584', '1145218899', 1),
('Guadalupe Sanchez', 'MN 135420', '1166332211', 2),
('María Cerezo', 'MP 44582', '1133225544', 3),
('Alejandro Rossi', 'MN 108773', '1155447788', 4),
('Valeria Domínguez', 'MP 22351', '1122558877', 5);

--turnos--

INSERT INTO turnos (id_usuario, id_medico, fecha, hora, estado)
VALUES

(
    1,
    1,
    '2026-05-10',
    '08:00',
    'confirmado'
),

(
    2,
    1,
    '2026-05-10',
    '09:00',
    'pendiente'
),

(
    1,
    2,
    '2026-05-11',
    '10:00',
    'confirmado'
),

(
    2,
    2,
    '2026-05-11',
    '11:00',
    'pendiente'
),

(
    1,
    3,
    '2026-05-12',
    '12:00',
    'atendido'
),

(
    2,
    3,
    '2026-05-12',
    '13:00',
    'confirmado'
),

(
    1,
    1,
    '2026-05-13',
    '14:00',
    'pendiente'
),

(
    2,
    2,
    '2026-05-13',
    '15:00',
    'confirmado'
),

(
    1,
    3,
    '2026-05-14',
    '16:00',
    'cancelado'
),

(
    2,
    1,
    '2026-05-14',
    '17:00',
    'pendiente'
);


--procedimiento almacenado (stored procedure): en este caso evitamos que un medico tenga dos turnos a la vez--

CREATE OR REPLACE PROCEDURE reservar_turno(
    p_id_usuario INT,
    p_id_medico INT,
    p_fecha DATE,
    p_hora TIME
)
LANGUAGE plpgsql
AS $$
BEGIN
	--aqui verifico si ya existe un turno--
    IF EXISTS (
        SELECT 1
        FROM turnos
        WHERE id_medico = p_id_medico
        AND fecha = p_fecha
        AND hora = p_hora
        AND estado <> 'cancelado'
    ) THEN

        RAISE EXCEPTION 'El horario ya está ocupado';

    END IF;
	--insertar turno--
    INSERT INTO turnos (
        id_usuario,
        id_medico,
        fecha,
        hora,
        estado
    )
    VALUES (
        p_id_usuario,
        p_id_medico,
        p_fecha,
        p_hora,
        'pendiente'
    );

END;
$$;

--función para el trigger--

CREATE OR REPLACE FUNCTION registrar_cancelacion()
RETURNS TRIGGER
AS $$
BEGIN

    IF NEW.estado = 'cancelado'
    AND OLD.estado <> 'cancelado' THEN

        INSERT INTO auditoria_turnos (
            id_turno,
            accion
        )
        VALUES (
            NEW.id,
            'Turno cancelado'
        );

    END IF;

    RETURN NEW;

END;
$$
LANGUAGE plpgsql;

--trigger--

CREATE TRIGGER trigger_cancelacion_turno
AFTER UPDATE
ON turnos
FOR EACH ROW
EXECUTE FUNCTION registrar_cancelacion();


---verificacion para ver si el trigger funciona--
UPDATE turnos
SET estado = 'cancelado'
WHERE id = 2;

SELECT * FROM auditoria_turnos;

   

