/* Lógica del módulo: main */
function updateHeaderNav() {
            const user = appState.currentUser;
            if (!user) return;

            document.getElementById('nav-username').textContent = user.name;
            document.getElementById('nav-avatar').src = `https://placehold.co/100x100/C62828/ffffff?text=${user.name.charAt(0)}`;

            // Highlight switchers
            ['estudiante', 'instructor', 'admin'].forEach(r => {
                const btn = document.getElementById(`role-btn-${r}`);
                if (btn) {
                    if (r === user.role) {
                        btn.className = "px-2.5 py-1 text-xs font-bold rounded bg-uleam-red text-white shadow-sm";
                    } else {
                        btn.className = "px-2.5 py-1 text-xs font-medium rounded text-gray-600 hover:bg-gray-200";
                    }
                }
            });

            // Nav links according to role
            const nav = document.getElementById('nav-links');
            if (user.role === 'estudiante') {
                nav.innerHTML = `
                    <button onclick="switchStudentTab('mis-cursos')" class="hover:text-uleam-red">Mis Cursos</button>
                    <button onclick="switchStudentTab('catalogo')" class="hover:text-uleam-red">Catálogo</button>
                `;
            } else if (user.role === 'instructor') {
                nav.innerHTML = `
                    <button onclick="navigateToDashboard()" class="hover:text-uleam-red">Mis Cursos</button>
                `;
            } else if (user.role === 'admin') {
                nav.innerHTML = `
                    <button onclick="navigateToDashboard()" class="hover:text-uleam-red">Panel Admin</button>
                `;
            }
        }

/* Inicialización de la aplicación */
window.onload = function() {
    initStorage();
    showView('auth');
    showAuthStep('login');
};

