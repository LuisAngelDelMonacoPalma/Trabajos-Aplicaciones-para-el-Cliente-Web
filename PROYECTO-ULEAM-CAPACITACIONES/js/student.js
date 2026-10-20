/* Lógica del módulo: student */
function switchStudentTab(tab) {
            showView('student');
            currentStudentTab = tab;
            const btnMis = document.getElementById('tab-btn-mis-cursos');
            const btnCat = document.getElementById('tab-btn-catalogo');
            const secMis = document.getElementById('student-section-mis-cursos');
            const secCat = document.getElementById('student-section-catalogo');

            if (tab === 'mis-cursos') {
                btnMis.className = "font-bold text-lg text-uleam-red border-b-2 border-uleam-red pb-1";
                btnCat.className = "font-bold text-lg text-gray-500 hover:text-gray-800 pb-1";
                secMis.classList.remove('hidden');
                secCat.classList.add('hidden');
                renderStudentCourses();
            } else {
                btnCat.className = "font-bold text-lg text-uleam-red border-b-2 border-uleam-red pb-1";
                btnMis.className = "font-bold text-lg text-gray-500 hover:text-gray-800 pb-1";
                secCat.classList.remove('hidden');
                secMis.classList.add('hidden');
                renderStudentCatalog();
            }
        }

function switchEnrolledSubtab(sub) {
            currentEnrolledSubtab = sub;
            const btnEn = document.getElementById('subtab-en-curso');
            const btnComp = document.getElementById('subtab-completados');

            if (sub === 'en-curso') {
                btnEn.className = "px-4 py-1.5 rounded-md font-semibold bg-white text-gray-800 shadow-sm";
                btnComp.className = "px-4 py-1.5 rounded-md font-semibold text-gray-600 hover:text-gray-900";
            } else {
                btnComp.className = "px-4 py-1.5 rounded-md font-semibold bg-white text-gray-800 shadow-sm";
                btnEn.className = "px-4 py-1.5 rounded-md font-semibold text-gray-600 hover:text-gray-900";
            }
            renderStudentCourses();
        }

function renderStudentCourses() {
            const grid = document.getElementById('student-courses-grid');
            grid.innerHTML = '';

            const userEnrollments = appState.enrollments.filter(e => e.userId === appState.currentUser.id);
            const isCompletedFilter = currentEnrolledSubtab === 'completados';

            const filteredEnrollments = userEnrollments.filter(e => isCompletedFilter ? e.completed : !e.completed);

            if (filteredEnrollments.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <i class="fa-solid fa-graduation-cap text-4xl text-gray-300 mb-2"></i>
                        <p class="text-gray-500 text-sm font-medium">No tienes cursos en esta sección.</p>
                        ${!isCompletedFilter ? '<button onclick="switchStudentTab(\'catalogo\')" class="mt-3 text-xs bg-uleam-red text-white font-bold px-3 py-1.5 rounded">Explorar catálogo</button>' : ''}
                    </div>
                `;
                return;
            }

            filteredEnrollments.forEach(en => {
                const course = appState.courses.find(c => c.id === en.courseId);
                if (!course) return;

                const card = document.createElement('div');
                card.className = "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between";
                card.innerHTML = `
                    <div>
                        <img src="${course.cover}" class="w-full h-36 object-cover" onerror="this.src='https://placehold.co/600x400/C62828/ffffff?text=ULEAM'">
                        <div class="p-4 space-y-2">
                            <h3 class="font-bold text-md text-gray-800">${course.title}</h3>
                            <p class="text-xs text-gray-500 line-clamp-2">${course.description}</p>
                            <div class="pt-2">
                                <div class="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                    <span>Progreso</span>
                                    <span>${en.progress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-uleam-red h-2 rounded-full" style="width: ${en.progress}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t bg-gray-50">
                        <button onclick="enterClassroom('${course.id}')" class="w-full bg-uleam-red hover:bg-uleam-redHover text-white py-2 rounded-lg text-xs font-bold shadow transition">
                            ${en.completed ? 'Ver detalles / Certificado' : 'Continuar'}
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

function renderStudentCatalog() {
            const grid = document.getElementById('catalog-courses-grid');
            grid.innerHTML = '';

            const search = document.getElementById('catalog-search').value.toLowerCase();
            const cat = document.getElementById('catalog-category-filter').value;

            const publishedCourses = appState.courses.filter(c => c.status === 'PUBLICADO');
            const filtered = publishedCourses.filter(c => {
                const matchSearch = c.title.toLowerCase().includes(search) || c.description.toLowerCase().includes(search);
                const matchCat = cat === 'ALL' || c.category === cat;
                return matchSearch && matchCat;
            });

            if (filtered.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500 text-sm">No se encontraron cursos disponibles.</p>`;
                return;
            }

            filtered.forEach(c => {
                const isEnrolled = appState.enrollments.some(e => e.userId === appState.currentUser.id && e.courseId === c.id);

                const card = document.createElement('div');
                card.className = "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between";
                card.innerHTML = `
                    <div>
                        <img src="${c.cover}" class="w-full h-36 object-cover">
                        <div class="p-4 space-y-2">
                            <span class="text-[10px] font-bold text-uleam-red bg-red-50 px-2 py-0.5 rounded border border-red-100">${c.category}</span>
                            <h3 class="font-bold text-md text-gray-800">${c.title}</h3>
                            <p class="text-xs text-gray-500 line-clamp-2">${c.description}</p>
                        </div>
                    </div>
                    <div class="p-4 border-t bg-gray-50">
                        <button onclick="openEnrollModal('${c.id}')" class="w-full border border-uleam-red text-uleam-red hover:bg-uleam-red hover:text-white py-2 rounded-lg text-xs font-bold transition">
                            ${isEnrolled ? 'Ver detalles' : 'Ver detalles e Inscribirme'}
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

function openEnrollModal(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            if (!course) return;

            pendingEnrollCourseId = courseId;
            document.getElementById('enroll-modal-title').textContent = course.title;
            document.getElementById('enroll-modal-img').src = course.cover;
            document.getElementById('enroll-modal-desc').textContent = course.description;
            document.getElementById('enroll-modal-cat').textContent = course.category;
            document.getElementById('enroll-modal-modules').textContent = course.modules.length;
            document.getElementById('enroll-modal-instructor').textContent = course.instructorName || 'Docente ULEAM';

            const isEnrolled = appState.enrollments.some(e => e.userId === appState.currentUser.id && e.courseId === courseId);
            const btn = document.getElementById('btn-confirm-enrollment');

            if (isEnrolled) {
                btn.textContent = 'Ir al Curso';
                btn.onclick = () => { closeEnrollModal(); enterClassroom(courseId); };
            } else {
                btn.textContent = 'Inscribirme';
                btn.onclick = confirmEnrollment;
            }

            document.getElementById('modal-course-enroll').classList.remove('hidden');
        }

function closeEnrollModal() {
            document.getElementById('modal-course-enroll').classList.add('hidden');
        }

function confirmEnrollment() {
            if (!pendingEnrollCourseId) return;

            appState.enrollments.push({
                userId: appState.currentUser.id,
                courseId: pendingEnrollCourseId,
                progress: 0,
                completed: false,
                completedLessons: []
            });

            addNotification(`Te has inscrito exitosamente en el curso.`);
            saveData();
            closeEnrollModal();
            enterClassroom(pendingEnrollCourseId);
        }
