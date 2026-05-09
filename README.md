# 🏥 Mediflow

## 📌 Descripción del proyecto

**Mediflow** es una aplicación para la gestión de turnos médicos.  
Permite a los pacientes reservar turnos con distintos profesionales de la salud según su especialidad, y gestionar el estado de sus citas (pendiente, confirmado, cancelado o atendido).

El objetivo del sistema es optimizar la organización de turnos médicos, evitar la superposición de horarios y mejorar la administración de consultas.

---

## ⚙️ Instalación del proyecto

### 1. Clonar el repositorio

git clone <https://github.com/agusrodriguez96/mediflow>
cd mediflow

---

### 2. Instalar dependencias

npm install

---

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mediflow
DB_USER=postgres
DB_PASSWORD=password

---

### 4. Base de datos

 archivo `database.sql` en PostgreSQL 
Este archivo incluye:
- Creación de tablas
- Relaciones entre entidades
- Datos de prueba
- Procedimientos almacenados
- Triggers

---

## 🧠 Lógica de la base de datos

### 📌 Procedimiento almacenado: reservar_turno

Permite registrar un nuevo turno médico de forma controlada.

- Verifica si el médico ya tiene un turno en la misma fecha y hora.
- Si el horario está ocupado, lanza un error.
- Si está disponible, inserta el turno con estado "pendiente".

Evita la superposición de turnos médicos.

---

### 📌 Trigger: trigger_cancelacion_turno

Se ejecuta automáticamente cuando se actualiza un turno.

- Detecta cuando el estado cambia a "cancelado".
- Registra la acción en la tabla `auditoria_turnos`.

Permite llevar un historial de cancelaciones.

---

### 📌 Transacción (lógica de reserva)

La reserva de turnos se ejecuta de forma segura:

- Se valida la disponibilidad del médico.
- Se inserta el turno.
- Si ocurre un error, se revierte la operación.

Garantiza la integridad de los datos.

---

## 🚀 Tecnologías utilizadas

- Node.js
- PostgreSQL
- pgAdmin
- SQL (procedimientos, triggers, constraints)