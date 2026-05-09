const API_URL = 'http://localhost:3000/api';


const mostrarToast = (
    mensaje,
    tipo = 'success'
) => {

    const toast = document.getElementById('toast');

    toast.textContent = mensaje;

    toast.className = '';

    toast.classList.add('show');
    toast.classList.add(tipo);

    setTimeout(() => {

        toast.classList.remove('show');

    }, 3000);
};

// register formulario

const registerForm = document.getElementById('registerForm');

if (registerForm) {

    registerForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const nombre = document.getElementById('nombre').value;

        const email = document.getElementById('email').value;

        const password = document.getElementById('password').value;

        try {

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        nombre,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            mostrarToast(data.message);

            localStorage.setItem(
                'token',
                data.token
            );

            window.location.href = 'index.html';

        } catch (error) {

            console.error(error);

           mostrarToast('Error al registrar');
        }
    });
}



// LOGIN

const loginForm = document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('loginEmail').value;

        const password = document.getElementById('loginPassword').value;

        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.token) {

                localStorage.setItem(
                    'token',
                    data.token
                );

                window.location.href = 'index.html';

            } else {

                mostrarToast(data.error);
            }

        } catch (error) {

            console.error(error);

            mostrarToast('Error al iniciar sesión');
        }
    });
}