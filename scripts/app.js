document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar ul li");
  const sections = document.querySelectorAll(".section");
  const form = document.getElementById("form-paciente");
  const tablaCuerpo = document.querySelector("#tabla-pacientes tbody");
  const loginForm = document.querySelector(".login-form");
  const loginBox = document.querySelector(".login");
  const app = document.getElementById("app");

  // Evento submit del login
  loginForm.addEventListener("submit", validarLogin);

  function validarLogin(e) {
    e.preventDefault();
    const usuario = document.querySelector("#usuario").value;
    const password = document.querySelector("#password").value;

    if (usuario.trim() === "" || password.trim() === "") {
      validacionLogin("Todos los campos son obligatorios", "error");
      return;
    }

    const usuarioCorrecto = "admin";
    const contrasenaCorrecta = "1234";

    if (usuario === usuarioCorrecto && password === contrasenaCorrecta) {
      // Login correcto: oculta login y muestra app
      loginBox.style.display = "none";
      app.style.display = "block";
    } else {
      validacionLogin("Usuario o contraseña incorrectos", "error");
    }
  }

  function validacionLogin(mjs, tipo = "error") {
    const alertaExistente = document.querySelector(".login-form .remove");
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.classList.add("alerta", `alerta-${tipo}`, "remove");
    alerta.textContent = mjs;

    loginForm.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.add("fade-out");
      alerta.addEventListener("animationend", () => alerta.remove());
    }, 3000);
  }

  // Navegación del menú lateral
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-section");
      menuItems.forEach((i) => i.classList.remove("active"));
      sections.forEach((sec) => sec.classList.remove("active"));

      item.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  // Arreglo para guardar pacientes
  let pacientes = [];

  // Función para mostrar pacientes en la tabla
  function mostrarPacientes() {
    tablaCuerpo.innerHTML = "";
    pacientes.forEach((paciente, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${paciente.nombre}</td>
        <td>${paciente.telefono}</td>
        <td>${paciente.fecha}</td>
        <td>${paciente.sintomas}</td>
        <td>${paciente.diagnostico}</td>
        <td>${paciente.tratamiento}</td>
        <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
      `;
      tablaCuerpo.appendChild(fila);
    });

    // Botones para eliminar pacientes
    document.querySelectorAll(".btn-eliminar").forEach((boton) => {
      boton.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        pacientes.splice(idx, 1);
        mostrarPacientes();
      });
    });
  }

  // Evento submit del formulario para nuevo paciente
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoPaciente = {
      nombre: form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      fecha: form.fecha.value,
      sintomas: form.sintomas.value.trim(),
      diagnostico: form.diagnostico.value.trim(),
      tratamiento: form.tratamiento.value.trim(),
    };

    // Validar que ningún campo esté vacío
    if (Object.values(nuevoPaciente).some((valor) => valor === "")) {
      mostrarAlerta("Todos los campos son obligatorios", "error");
      return;
    }
    mostrarAlerta("Guardado correctamente", "exito");

    pacientes.push(nuevoPaciente);
    mostrarPacientes();
    form.reset();

    // Cambiar a la sección pacientes tras guardar
    setTimeout(() => {
      document
        .querySelector('[data-section="pacientes"]')
        .classList.add("active");
      document.getElementById("pacientes").classList.add("active");

      sections.forEach((sec) => {
        if (sec.id !== "pacientes") {
          sec.classList.remove("active");
        }
      });

      menuItems.forEach((i) => {
        if (i.getAttribute("data-section") !== "pacientes") {
          i.classList.remove("active");
        }
      });
    }, 2000);
  });

  // Mostrar alertas dentro del formulario pacientes
  function mostrarAlerta(mjs, tipo = "error") {
    const alertaExistente = document.querySelector("#form-paciente .remove");
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.classList.add("alerta", `alerta-${tipo}`, "remove");
    alerta.textContent = mjs;

    form.insertBefore(alerta, form.firstChild);

    setTimeout(() => {
      alerta.classList.add("fade-out");
      alerta.addEventListener("animationend", () => alerta.remove());
    }, 3000);
  }

  // Inicializar tabla pacientes vacía
  mostrarPacientes();
});
