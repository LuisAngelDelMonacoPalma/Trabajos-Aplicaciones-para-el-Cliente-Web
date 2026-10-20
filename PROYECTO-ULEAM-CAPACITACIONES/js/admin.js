/* Lógica del módulo: admin */
function renderAdminDashboard() {
            // Stats recalculation
            document.getElementById('stat-active-users').textContent = appState.users.filter(u => u.status === 'ACTIVO').length;
            document.getElementById('stat-published-courses').textContent = appState.courses.filter(c => c.status === 'PUBLICADO').length;
            document.getElementById('stat-certificates-issued').textContent = appState.enrollments.filter(e => e.completed).length + 42;

            renderAdminCourses();
            renderAdminUsers();
            renderAdminMyCourses();
        }

function renderAdminCourses() {
            const list = document.getElementById('admin-courses-list');
            list.innerHTML = '';

            const search = document.getElementById('admin-course-search').value.toLowerCase();
            const filter = document.getElementById('admin-course-filter').value;

            const filtered = appState.courses.filter(c => {
                const matchSearch = c.title.toLowerCase().includes(search);
                const matchFilter = filter === 'ALL' || c.status === filter;
                return matchSearch && matchFilter;
            });

            filtered.forEach(c => {
                const item = document.createElement('div');
                item.className = "p-3 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50";

                let actionBtns = '';
                if (c.status === 'PENDIENTE') {
                    actionBtns = `
                        <button onclick="adminApproveCourse('${c.id}')" class="bg-uleam-green hover:bg-uleam-greenHover text-white text-xs px-3 py-1 rounded font-bold">Aprobar Publicación</button>
                    `;
                } else if (c.pendingAction === 'DESHABILITACION') {
                    actionBtns = `
                        <button onclick="adminConfirmDisableCourse('${c.id}')" class="bg-red-800 hover:bg-red-900 text-white text-xs px-3 py-1 rounded font-bold">Aprobar Deshabilitación</button>
                    `;
                } else if (c.status === 'PUBLICADO') {
                    actionBtns = `
                        <button onclick="adminToggleDisableCourse('${c.id}')" class="border border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded font-bold">Deshabilitar</button>
                    `;
                } else if (c.status === 'DESHABILITADO') {
                    actionBtns = `
                        <button onclick="adminApproveCourse('${c.id}')" class="bg-uleam-green hover:bg-uleam-greenHover text-white text-xs px-3 py-1 rounded font-bold">Rehabilitar</button>
                    `;
                }

                item.innerHTML = `
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-sm text-gray-800">${c.title}</span>
                            <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100">${c.status}</span>
                        </div>
                        <p class="text-xs text-gray-500">Docente: ${c.instructorName || 'ULEAM'} | Categoría: ${c.category}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="enterClassroom('${c.id}')" class="border text-gray-700 hover:bg-gray-100 text-xs px-3 py-1 rounded font-bold">Ver detalles</button>
                        <button onclick="openCourseEditor('${c.id}')" class="bg-uleam-red text-white text-xs px-3 py-1 rounded font-bold">Editar</button>
                        ${actionBtns}
                    </div>
                `;
                list.appendChild(item);
            });
        }

function adminApproveCourse(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            if (course) {
                course.status = 'PUBLICADO';
                course.pendingAction = null;
                addNotification(`El curso "${course.title}" ha sido publicado por el administrador.`);
                saveData();
                renderAdminDashboard();
            }
        }

function adminConfirmDisableCourse(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            if (course) {
                course.status = 'DESHABILITADO';
                course.pendingAction = null;
                saveData();
                renderAdminDashboard();
            }
        }

function adminToggleDisableCourse(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            if (course) {
                course.status = course.status === 'DESHABILITADO' ? 'PUBLICADO' : 'DESHABILITADO';
                saveData();
                renderAdminDashboard();
            }
        }

function renderAdminUsers() {
            const list = document.getElementById('admin-users-list');
            list.innerHTML = '';

            const search = document.getElementById('admin-user-search').value.toLowerCase();

            appState.users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)).forEach(u => {
                const item = document.createElement('div');
                item.className = "py-3 flex justify-between items-center";
                item.innerHTML = `
                    <div>
                        <p class="font-bold text-sm text-gray-800">${u.name}</p>
                        <p class="text-xs text-gray-500">${u.role.toUpperCase()} - ${u.email}</p>
                    </div>
                    <button onclick="openProfileModal('${u.id}')" class="bg-uleam-red hover:bg-uleam-redHover text-white text-xs px-3 py-1.5 rounded font-bold shadow">
                        Ver / Editar perfil
                    </button>
                `;
                list.appendChild(item);
            });
        }

function renderAdminMyCourses() {
            const list = document.getElementById('admin-my-courses-list');
            list.innerHTML = '';

            appState.courses.filter(c => c.instructorId === appState.currentUser.id).forEach(c => {
                const item = document.createElement('div');
                item.className = "p-3 border rounded-lg flex justify-between items-center bg-gray-50";
                item.innerHTML = `
                    <div>
                        <p class="font-bold text-sm text-gray-800">${c.title}</p>
                        <p class="text-xs text-gray-500">${c.status}</p>
                    </div>
                    <button onclick="openCourseEditor('${c.id}')" class="bg-uleam-red text-white text-xs px-3 py-1 rounded font-bold">Editar</button>
                `;
                list.appendChild(item);
            });
        }
