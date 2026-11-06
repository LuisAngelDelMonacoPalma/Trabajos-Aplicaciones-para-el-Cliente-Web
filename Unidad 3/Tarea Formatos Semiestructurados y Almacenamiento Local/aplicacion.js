// --- 1. CONFIGURACIÓN Y EXPRESIONES REGULARES ---
const REGLAS_VALIDACION = {
    cedula: {
        regex: /^\d{10}$/,
        mensaje: "La cédula debe contener exactamente 10 dígitos numéricos."
    },
    apellidos: {
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/,
        mensaje: "Los apellidos solo deben contener letras (mínimo 2 caracteres)."
    },
    nombres: {
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/,
        mensaje: "Los nombres solo deben contener letras (mínimo 2 caracteres)."
    },
    direccion: {
        regex: /^.{5,100}$/,
        mensaje: "La dirección debe tener entre 5 y 100 caracteres."
    },
    telefono: {
        regex: /^09\d{8}$/,
        mensaje: "El teléfono debe ser celular (10 dígitos, empieza con 09)."
    },
    correo: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        mensaje: "Ingrese un correo electrónico válido."
    },
    facultad: {
        regex: /.+/,
        mensaje: "Seleccione una facultad."
    },
    nivel: {
        regex: /^([1-9]|10)$/,
        mensaje: "El nivel debe ser un número del 1 al 10."
    },
    paralelo: {
        regex: /^[A-Za-z]{1,2}$/,
        mensaje: "El paralelo debe ser 1 o 2 letras (ej. A, B, A1)."
    }
};

// --- 2. ESTADO DE LA APLICACIÓN ---
let estudiantes = JSON.parse(localStorage.getItem('estudiantes_db')) || [];
let estaEditando = false;

// --- 3. ELEMENTOS DEL DOM ---
const formulario = document.getElementById('formulario-estudiante');
const entradaId = document.getElementById('id-estudiante');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

const campos = ['cedula', 'apellidos', 'nombres', 'direccion', 'telefono', 'correo', 'facultad', 'nivel', 'paralelo'];

// --- 4. FUNCIONES DE VALIDACIÓN ---
function validarCampo(nombreCampo) {
    const input = document.getElementById(nombreCampo);
    const spanError = document.getElementById(`error-${nombreCampo}`);
    const regla = REGLAS_VALIDACION[nombreCampo];
    const valor = input.value.trim();

    if (!regla.regex.test(valor)) {
        input.classList.add('invalido');
        spanError.textContent = regla.mensaje;
        return false;
    } else {
        input.classList.remove('invalido');
        spanError.textContent = '';
        return true;
    }
}

function validarFormulario() {
    let esValido = true;
    campos.forEach(campo => {
        const validoCampo = validarCampo(campo);
        if (!validoCampo) esValido = false;
    });
    return esValido;
}

// Validación en tiempo real al escribir o cambiar valor
campos.forEach(campo => {
    const input = document.getElementById(campo);
    input.addEventListener('input', () => validarCampo(campo));
    input.addEventListener('change', () => validarCampo(campo));
});

// --- 5. FUNCIONES CRUD Y PERSISTENCIA (localStorage) ---
function guardarEnLocalStorage() {
    localStorage.setItem('estudiantes_db', JSON.stringify(estudiantes));
}

function renderizarTabla() {
    cuerpoTabla.innerHTML = '';

    if (estudiantes.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay estudiantes registrados.</td></tr>`;
        return;
    }

    estudiantes.forEach(est => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${est.cedula}</strong></td>
            <td>${est.apellidos} ${est.nombres}</td>
            <td>
                <div>${est.correo}</div>
                <div class="detalle-contacto">${est.telefono} | ${est.direccion}</div>
            </td>
            <td>${est.facultad}<br><small>Nivel ${est.nivel} - Par. ${est.paralelo}</small></td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicion('${est.id}')">Editar</button>
                <button class="btn btn-eliminar" onclick="eliminarEstudiante('${est.id}')">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Guardar / Actualizar registro
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const datosEstudiante = {
        cedula: document.getElementById('cedula').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        facultad: document.getElementById('facultad').value,
        nivel: document.getElementById('nivel').value.trim(),
        paralelo: document.getElementById('paralelo').value.trim().toUpperCase()
    };

    if (estaEditando) {
        const idActual = entradaId.value;
        const existeCedula = estudiantes.some(e => e.cedula === datosEstudiante.cedula && e.id !== idActual);
        if (existeCedula) {
            alert('La cédula ingresada ya pertenece a otro estudiante.');
            return;
        }

        estudiantes = estudiantes.map(e => e.id === idActual ? { ...datosEstudiante, id: idActual } : e);
        estaEditando = false;
        btnGuardar.textContent = 'Guardar Estudiante';
        btnCancelar.classList.add('oculto');
    } else {
        const existeCedula = estudiantes.some(e => e.cedula === datosEstudiante.cedula);
        if (existeCedula) {
            alert('Ya existe un estudiante registrado con esta cédula.');
            return;
        }

        datosEstudiante.id = crypto.randomUUID();
        estudiantes.push(datosEstudiante);
    }

    guardarEnLocalStorage();
    reiniciarFormulario();
    renderizarTabla();
});

// Preparar edición
window.prepararEdicion = function(id) {
    const est = estudiantes.find(e => e.id === id);
    if (!est) return;

    entradaId.value = est.id;
    campos.forEach(campo => {
        document.getElementById(campo).value = est[campo];
        validarCampo(campo);
    });

    estaEditando = true;
    btnGuardar.textContent = 'Actualizar Estudiante';
    btnCancelar.classList.remove('oculto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Eliminar estudiante
window.eliminarEstudiante = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro de estudiante?')) {
        estudiantes = estudiantes.filter(e => e.id !== id);
        
        if (estaEditando && entradaId.value === id) {
            reiniciarFormulario();
        }

        guardarEnLocalStorage();
        renderizarTabla();
    }
};

// Cancelar edición
btnCancelar.addEventListener('click', reiniciarFormulario);

function reiniciarFormulario() {
    formulario.reset();
    entradaId.value = '';
    estaEditando = false;
    btnGuardar.textContent = 'Guardar Estudiante';
    btnCancelar.classList.add('oculto');

    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const spanError = document.getElementById(`error-${campo}`);
        input.classList.remove('invalido');
        spanError.textContent = '';
    });
}

// --- 6. INICIALIZACIÓN ---
renderizarTabla();