const API_BASE_URL = 'http://localhost:5000/api/users';

const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const passwordError = document.getElementById('passwordError');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

btnLogin.addEventListener('click', () => {
  formLogin.style.display = 'block';
  formRegister.style.display = 'none';
  btnLogin.classList.add('btn-primary');
  btnLogin.classList.remove('btn-outline-primary');
  btnRegister.classList.remove('btn-primary');
  btnRegister.classList.add('btn-outline-primary');
});

btnRegister.addEventListener('click', () => {
  formLogin.style.display = 'none';
  formRegister.style.display = 'block';
  btnRegister.classList.add('btn-primary');
  btnRegister.classList.remove('btn-outline-primary');
  btnLogin.classList.remove('btn-primary');
  btnLogin.classList.add('btn-outline-primary');
});

// Validar contraseña mientras se escribe
registerPassword.addEventListener('input', () => {
  const password = registerPassword.value;
  if (!passwordRegex.test(password)) {
    passwordError.textContent = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.';
    passwordError.style.display = 'block';
  } else {
    passwordError.textContent = '';
    passwordError.style.display = 'none';
  }
});

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;

  if (!name || !email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (!passwordRegex.test(password)) {
    passwordError.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('¡Usuario registrado con éxito!');
      formRegister.reset();
      passwordError.style.display = 'none';
      btnLogin.click(); // cambiar al formulario de login automáticamente
    } else {
      alert(data.message || 'Error al registrar usuario');
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
  }
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('¡Inicio de sesión exitoso!');
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || 'Error al iniciar sesión');
    }
  } catch (err) {
    alert('Error de conexión con el servidor');
  }
});
