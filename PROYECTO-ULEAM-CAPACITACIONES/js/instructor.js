/* Lógica del módulo: instructor */
function switchInstructorTab(tab) {
            currentInstructorTab = tab;
            const btnCr = document.getElementById('inst-tab-creados');
            const btnBo = document.getElementById('inst-tab-borradores');

            if (tab === 'creados') {
                btnCr.className = "pb-2 font-bold text-uleam-red border-b-2 border-uleam-red";
                btnBo.className = "pb-2 font-bold text-gray-500 hover:text-gray-700";
            } else {
                btnBo.className = "pb-2 font-bold text-uleam-red border-b-2 border-uleam-red";
                btnCr.className = "pb-2 font-bold text-gray-500 hover:text-gray-700";
            }
            renderInstructorCourses();
        }

function renderInstructorCourses() {
            const grid = document.getElementById('instructor-courses-list');
            grid.innerHTML = '';

            const myCourses = appState.courses.filter(c => c.instructorId === appState.currentUser.id);
            const filtered = myCourses.filter(c => {
                if (currentInstructorTab === 'creados') return c.status === 'PUBLICADO' || c.status === 'PENDIENTE';
                return c.status === 'BORRADOR';
            });

            if (filtered.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500 text-sm">No tienes cursos en esta categoría.</p>`;
                return;
            }

            filtered.forEach(c => {
                const card = document.createElement('div');
                card.className = "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between";
                
                let badgeStatus = '';
                if (c.status === 'PUBLICADO') badgeStatus = '<span class="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">Publicado</span>';
                if (c.status === 'PENDIENTE') badgeStatus = '<span class="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded">Pendiente Admin</span>';
                if (c.status === 'BORRADOR') badgeStatus = '<span class="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded">Borrador</span>';

                card.innerHTML = `
                    <div>
                        <img src="${c.cover}" class="w-full h-36 object-cover">
                        <div class="p-4 space-y-2">
                            <div class="flex justify-between items-center">
                                ${badgeStatus}
                                <span class="text-xs text-gray-400 font-medium">${c.modules.length} Módulos</span>
                            </div>
                            <h3 class="font-bold text-md text-gray-800">${c.title}</h3>
                            <p class="text-xs text-gray-500 line-clamp-2">${c.description}</p>
                        </div>
                    </div>
                    <div class="p-4 border-t bg-gray-50 flex gap-2">
                        <button onclick="enterClassroom('${c.id}')" class="flex-1 border text-gray-700 py-1.5 rounded text-xs font-bold hover:bg-gray-100">Ver detalles</button>
                        <button onclick="openCourseEditor('${c.id}')" class="flex-1 bg-uleam-red text-white py-1.5 rounded text-xs font-bold hover:bg-uleam-redHover shadow">Editar</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
