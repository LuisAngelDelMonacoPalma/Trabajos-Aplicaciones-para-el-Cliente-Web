/* Lógica del módulo: course-editor */
function openCourseEditor(courseId = null, isAdminNew = false) {
            showView('editor');

            if (courseId) {
                appState.editingCourse = JSON.parse(JSON.stringify(appState.courses.find(c => c.id === courseId)));
            } else {
                appState.editingCourse = {
                    id: 'c_' + Date.now(),
                    title: '',
                    category: 'Programación',
                    instructorId: appState.currentUser.id,
                    instructorName: appState.currentUser.name,
                    description: '',
                    cover: 'https://placehold.co/600x400/C62828/ffffff?text=Nuevo+Curso',
                    status: 'BORRADOR',
                    modules: []
                };
            }

            const c = appState.editingCourse;
            document.getElementById('edit-course-id').value = c.id;
            document.getElementById('edit-course-title').value = c.title;
            document.getElementById('edit-course-category').value = c.category;
            document.getElementById('edit-course-description').value = c.description;

            // Admin field for instructor assignment
            const instDiv = document.getElementById('admin-instructor-assignment-field');
            if (appState.currentUser.role === 'admin') {
                instDiv.classList.remove('hidden');
                const sel = document.getElementById('edit-course-instructor');
                sel.innerHTML = '';
                appState.users.filter(u => u.role === 'instructor' || u.role === 'admin').forEach(u => {
                    sel.innerHTML += `<option value="${u.id}" ${u.id === c.instructorId ? 'selected' : ''}>${u.name}</option>`;
                });
            } else {
                instDiv.classList.add('hidden');
            }

            renderEditorModules();
        }

function renderEditorModules() {
            const container = document.getElementById('editor-modules-container');
            container.innerHTML = '';

            appState.editingCourse.modules.forEach((mod, mIdx) => {
                const modBlock = document.createElement('div');
                modBlock.className = "bg-gray-50 border rounded-lg p-4 space-y-3";

                let itemsList = '';
                mod.items.forEach((item, iIdx) => {
                    itemsList += `
                        <div class="bg-white p-2 border rounded flex justify-between items-center text-xs">
                            <span><strong>${item.type.toUpperCase()}:</strong> ${item.title}</span>
                            <button onclick="removeContentFromModule(${mIdx}, ${iIdx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                });

                modBlock.innerHTML = `
                    <div class="flex justify-between items-center gap-2">
                        <input type="text" value="${mod.title}" onchange="updateModuleName(${mIdx}, this.value)" class="font-bold text-sm bg-white border px-2 py-1 rounded w-full">
                        <button onclick="removeModuleFromEditor(${mIdx})" class="text-red-600 hover:text-red-800 text-sm"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div class="space-y-1 pl-2">
                        ${itemsList || '<p class="text-[11px] text-gray-400 italic">Sin elementos en este módulo.</p>'}
                    </div>
                    <button onclick="openAddContentModal(${mIdx})" class="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold text-gray-700">
                        + Agregar lección / recurso / evaluación
                    </button>
                `;
                container.appendChild(modBlock);
            });
        }

function updateModuleName(mIdx, val) {
            appState.editingCourse.modules[mIdx].title = val;
        }

function addNewModuleToEditor() {
            appState.editingCourse.modules.push({
                id: 'm_' + Date.now(),
                title: `Módulo ${appState.editingCourse.modules.length + 1}: Nuevo Módulo`,
                items: []
            });
            renderEditorModules();
        }

function removeModuleFromEditor(mIdx) {
            appState.editingCourse.modules.splice(mIdx, 1);
            renderEditorModules();
        }

function openAddContentModal(mIdx) {
            appState.editingModuleIndexForContent = mIdx;
            document.getElementById('modal-add-content').classList.remove('hidden');
        }

function closeAddContentModal() {
            document.getElementById('modal-add-content').classList.add('hidden');
        }

function selectNewItemType(type) {
            const title = prompt(`Ingrese el título para este elemento (${type}):`);
            if (!title) return;

            const mIdx = appState.editingModuleIndexForContent;
            appState.editingCourse.modules[mIdx].items.push({
                id: 'i_' + Date.now(),
                type: type,
                title: title,
                completed: false
            });

            closeAddContentModal();
            renderEditorModules();
        }

function removeContentFromModule(mIdx, iIdx) {
            appState.editingCourse.modules[mIdx].items.splice(iIdx, 1);
            renderEditorModules();
        }

function saveCourseDraft() {
            syncFormToEditingCourse();
            appState.editingCourse.status = 'BORRADOR';
            commitEditingCourse();
            alert('Curso guardado en Borradores.');
            navigateToDashboard();
        }

function submitCourseForPublish() {
            syncFormToEditingCourse();
            if (appState.currentUser.role === 'admin') {
                appState.editingCourse.status = 'PUBLICADO';
                alert('Curso publicado en la plataforma.');
            } else {
                appState.editingCourse.status = 'PENDIENTE';
                appState.editingCourse.pendingAction = 'PUBLICACION';
                addNotification(`Solicitud enviada al Administrador para publicar "${appState.editingCourse.title}".`);
                alert('Solicitud de publicación enviada al administrador.');
            }
            commitEditingCourse();
            navigateToDashboard();
        }

function requestDisableCourse() {
            if (!appState.editingCourse) return;
            appState.editingCourse.pendingAction = 'DESHABILITACION';
            commitEditingCourse();
            alert('Solicitud de deshabilitar enviada al administrador.');
            navigateToDashboard();
        }

function syncFormToEditingCourse() {
            const c = appState.editingCourse;
            c.title = document.getElementById('edit-course-title').value.trim() || 'Curso sin título';
            c.category = document.getElementById('edit-course-category').value;
            c.description = document.getElementById('edit-course-description').value.trim();
            c.cover = document.getElementById('edit-course-cover').value;

            if (appState.currentUser.role === 'admin') {
                const instId = document.getElementById('edit-course-instructor').value;
                const instUser = appState.users.find(u => u.id === instId);
                if (instUser) {
                    c.instructorId = instUser.id;
                    c.instructorName = instUser.name;
                }
            }
        }

function commitEditingCourse() {
            const existingIdx = appState.courses.findIndex(c => c.id === appState.editingCourse.id);
            if (existingIdx >= 0) {
                appState.courses[existingIdx] = appState.editingCourse;
            } else {
                appState.courses.push(appState.editingCourse);
            }
            saveData();
        }
