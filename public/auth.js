const API_URL = 'http://localhost:3000/api';



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

            alert(data.message);

            window.location.href = 'login.html';

        } catch (error) {

            console.error(error);

            alert('Error al registrar');
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

                alert(data.error);
            }

        } catch (error) {

            console.error(error);

            alert('Error al iniciar sesión');
        }
    });
}