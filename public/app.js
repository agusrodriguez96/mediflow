const API_URL = 'http://localhost:3000/api';

const token = localStorage.getItem('token');



// PROTEGER DASHBOARD

if (!token) {

    window.location.href = 'login.html';
}



// LOGOUT

document
    .getElementById('logoutBtn')
    .addEventListener('click', () => {

        localStorage.removeItem('token');

        window.location.href = 'login.html';
    });



// OBTENER MÉDICOS

const cargarMedicos = async () => {

    const response = await fetch(
        `${API_URL}/medicos`
    );

    const medicos = await response.json();

    const select = document.getElementById('medicoSelect');

    medicos.forEach(medico => {

        select.innerHTML += `
            <option value="${medico.id}">
                ${medico.nombre}
            </option>
        `;
    });
};



// OBTENER TURNOS

const cargarTurnos = async () => {

    const response = await fetch(
        `${API_URL}/turnos`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const turnos = await response.json();

    const container = document.getElementById(
        'turnosContainer'
    );

    container.innerHTML = '';

    turnos.forEach(turno => {

        container.innerHTML += `
            <div class="turno">

                <h3>${turno.medico}</h3>

                <p>
                    ${turno.especialidad}
                </p>

                <p>
                    ${turno.fecha}
                </p>

                <p>
                    ${turno.hora}
                </p>

                <p>
                    Estado: ${turno.estado}
                </p>

                <button
                    onclick="cancelarTurno(${turno.id})"
                >
                    Cancelar
                </button>

            </div>
        `;
    });
};



// CREAR TURNO

document
    .getElementById('turnoForm')
    .addEventListener('submit', async (e) => {

        e.preventDefault();

        const id_medico = document.getElementById(
            'medicoSelect'
        ).value;

        const fecha = document.getElementById(
            'fecha'
        ).value;

        const hora = document.getElementById(
            'hora'
        ).value;

        const response = await fetch(
            `${API_URL}/turnos`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    id_medico,
                    fecha,
                    hora
                })
            }
        );

        const data = await response.json();

        alert(data.message || data.error);

        cargarTurnos();
    });



// CANCELAR TURNO

const cancelarTurno = async (id) => {

    const response = await fetch(
        `${API_URL}/turnos/${id}/cancelar`,
        {
            method: 'PUT',

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    alert(data.message || data.error);

    cargarTurnos();
};



// INICIALIZAR

cargarMedicos();

cargarTurnos();