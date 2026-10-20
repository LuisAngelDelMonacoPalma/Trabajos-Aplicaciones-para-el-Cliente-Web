/* Lógica del módulo: classroom */
function enterClassroom(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            if (!course) return;

            appState.currentClassroomCourse = course;
            showView('classroom');

            document.getElementById('classroom-breadcrumb-course').textContent = course.title;
            document.getElementById('classroom-title').textContent = course.title;
            document.getElementById('classroom-desc').textContent = course.description;
            document.getElementById('classroom-category').textContent = course.category;
            document.getElementById('classroom-instructor').textContent = course.instructorName || 'Docente';
            document.getElementById('classroom-banner').src = course.cover;

            // Render Classroom Actions based on Role
            const actionsDiv = document.getElementById('classroom-actions');
            actionsDiv.innerHTML = '';

            if (appState.currentUser.role === 'instructor' || appState.currentUser.role === 'admin') {
                actionsDiv.innerHTML = `
                    <button onclick="openParticipantsModal('${course.id}')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border">
                        <i class="fa-solid fa-users mr-1"></i> Ver participantes
                    </button>
                    <button onclick="openCourseEditor('${course.id}')" class="bg-uleam-red text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow">
                        <i class="fa-solid fa-pen"></i> Editar
                    </button>
                `;
            }

            renderClassroomModules();
        }

function renderClassroomModules() {
            const course = appState.currentClassroomCourse;
            const container = document.getElementById('classroom-modules-accordion');
            container.innerHTML = '';

            let enrollment = appState.enrollments.find(e => e.userId === appState.currentUser.id && e.courseId === course.id);
            if (!enrollment) {
                // Mock enrollment state for Instructor previewing
                enrollment = { completedLessons: [], progress: 0, completed: false };
            }

            // Calculate progress
            let totalItems = 0;
            let finishedItems = 0;

            course.modules.forEach((mod, mIdx) => {
                const modDiv = document.createElement('div');
                modDiv.className = "border rounded-lg overflow-hidden bg-white shadow-sm";

                let itemsHtml = '';
                mod.items.forEach(item => {
                    totalItems++;
                    const isDone = enrollment.completedLessons.includes(item.id);
                    if (isDone) finishedItems++;

                    let icon = 'fa-video';
                    if (item.type === 'recurso') icon = 'fa-file-arrow-down';
                    if (item.type === 'evaluacion') icon = 'fa-list-check';

                    itemsHtml += `
                        <div onclick="selectClassroomItem('${mod.id}', '${item.id}')" 
                            class="p-2.5 text-xs font-medium flex items-center justify-between hover:bg-gray-50 cursor-pointer border-t ${appState.activeClassroomItem?.id === item.id ? 'bg-red-50 text-uleam-red font-bold' : 'text-gray-700'}">
                            <div class="flex items-center space-x-2">
                                <i class="fa-solid ${icon} opacity-70"></i>
                                <span>${item.title}</span>
                            </div>
                            ${isDone ? '<i class="fa-solid fa-circle-check text-green-600"></i>' : '<i class="fa-regular fa-circle text-gray-300"></i>'}
                        </div>
                    `;
                });

                modDiv.innerHTML = `
                    <div class="bg-gray-100 p-3 font-bold text-xs text-gray-800 flex justify-between items-center cursor-pointer">
                        <span>${mod.title}</span>
                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                    </div>
                    <div class="divide-y">
                        ${itemsHtml || '<p class="p-2 text-[11px] text-gray-400 italic">Módulo sin elementos</p>'}
                    </div>
                `;
                container.appendChild(modDiv);
            });

            // Update Progress Percentage
            const calcProgress = totalItems > 0 ? Math.round((finishedItems / totalItems) * 100) : 0;
            document.getElementById('classroom-completion-badge').textContent = `${calcProgress}%`;

            if (enrollment && appState.currentUser.role === 'estudiante') {
                enrollment.progress = calcProgress;
                enrollment.completed = calcProgress === 100;
                saveData();
            }

            if (calcProgress === 100 && appState.currentUser.role === 'estudiante') {
                document.getElementById('classroom-certificate-box').classList.remove('hidden');
            } else {
                document.getElementById('classroom-certificate-box').classList.add('hidden');
            }

            // Default selection if none active
            if (!appState.activeClassroomItem && course.modules.length > 0 && course.modules[0].items.length > 0) {
                selectClassroomItem(course.modules[0].id, course.modules[0].items[0].id);
            }
        }

function selectClassroomItem(moduleId, itemId) {
            const course = appState.currentClassroomCourse;
            let foundItem = null;

            course.modules.forEach(m => {
                m.items.forEach(i => {
                    if (i.id === itemId) foundItem = i;
                });
            });

            if (!foundItem) return;
            appState.activeClassroomItem = foundItem;

            document.getElementById('player-title').textContent = foundItem.title;
            document.getElementById('player-lesson-name').textContent = foundItem.title;

            const contentArea = document.getElementById('player-content-area');

            if (foundItem.type === 'leccion') {
                contentArea.innerHTML = `
                    <i class="fa-solid fa-circle-play text-6xl text-uleam-red mb-4 animate-pulse"></i>
                    <h3 class="text-lg font-bold">${foundItem.title}</h3>
                    <p class="text-xs text-gray-400 mt-1">Reproduciendo clase en video de la ULEAM...</p>
                `;
            } else if (foundItem.type === 'recurso') {
                contentArea.innerHTML = `
                    <i class="fa-solid fa-file-arrow-down text-6xl text-blue-500 mb-4"></i>
                    <h3 class="text-lg font-bold">${foundItem.title}</h3>
                    <p class="text-xs text-gray-400 mt-1 mb-4">Recurso descargable adjunto por el docente.</p>
                    <a href="#" onclick="alert('Descargando archivo adjunto del curso...'); return false;" class="bg-uleam-red text-white text-xs px-4 py-2 rounded font-bold shadow">
                        <i class="fa-solid fa-download mr-1"></i> Descargar archivo
                    </a>
                `;
            } else if (foundItem.type === 'evaluacion') {
                contentArea.innerHTML = `
                    <i class="fa-solid fa-clipboard-question text-6xl text-uleam-green mb-4"></i>
                    <h3 class="text-lg font-bold">${foundItem.title}</h3>
                    <p class="text-xs text-gray-400 mt-1 mb-4">Cuestionario de evaluación del módulo.</p>
                    <button onclick="openQuizModal()" class="bg-uleam-green hover:bg-uleam-greenHover text-white text-xs px-5 py-2.5 rounded-lg font-bold shadow">
                        <i class="fa-solid fa-pen-to-square mr-1"></i> Realizar evaluación
                    </button>
                `;
            }

            renderClassroomModules();
        }

function markCurrentLessonComplete() {
            if (!appState.activeClassroomItem) return;

            const enrollment = appState.enrollments.find(e => e.userId === appState.currentUser.id && e.courseId === appState.currentClassroomCourse.id);
            if (!enrollment) return;

            if (!enrollment.completedLessons.includes(appState.activeClassroomItem.id)) {
                enrollment.completedLessons.push(appState.activeClassroomItem.id);
                saveData();
                renderClassroomModules();
            }
        }

function openQuizModal() {
            document.getElementById('modal-quiz').classList.remove('hidden');
            document.getElementById('quiz-screen-intro').classList.remove('hidden');
            document.getElementById('quiz-screen-questions').classList.add('hidden');
            document.getElementById('quiz-screen-results').classList.add('hidden');
        }

function closeQuizModal() {
            clearInterval(quizTimerInterval);
            document.getElementById('modal-quiz').classList.add('hidden');
        }

function startQuizTimerAndQuestions() {
            document.getElementById('quiz-screen-intro').classList.add('hidden');
            document.getElementById('quiz-screen-questions').classList.remove('hidden');

            currentQuizIndex = 0;
            quizTimeLeft = 900;
            renderQuizQuestion();

            quizTimerInterval = setInterval(() => {
                quizTimeLeft--;
                const mins = Math.floor(quizTimeLeft / 60);
                const secs = quizTimeLeft % 60;
                document.getElementById('quiz-timer-display').textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                if (quizTimeLeft <= 0) {
                    clearInterval(quizTimerInterval);
                    finishQuizAttempt();
                }
            }, 1000);
        }

function renderQuizQuestion() {
            const q = MOCK_QUIZ_QUESTIONS[currentQuizIndex];
            document.getElementById('quiz-question-counter').textContent = `Pregunta ${currentQuizIndex + 1} de ${MOCK_QUIZ_QUESTIONS.length}`;
            document.getElementById('quiz-question-text').textContent = q.question;

            const opts = document.getElementById('quiz-options-list');
            opts.innerHTML = '';

            q.options.forEach((opt, idx) => {
                opts.innerHTML += `
                    <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-700">
                        <input type="radio" name="quiz-opt" value="${idx}" class="text-uleam-red focus:ring-uleam-red">
                        <span>${opt}</span>
                    </label>
                `;
            });

            document.getElementById('btn-quiz-prev').disabled = currentQuizIndex === 0;
            document.getElementById('btn-quiz-next').textContent = currentQuizIndex === MOCK_QUIZ_QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente';
        }

function navigateQuizQuestion(dir) {
            currentQuizIndex += dir;
            if (currentQuizIndex >= MOCK_QUIZ_QUESTIONS.length) {
                finishQuizAttempt();
            } else {
                renderQuizQuestion();
            }
        }

function finishQuizAttempt() {
            clearInterval(quizTimerInterval);
            document.getElementById('quiz-screen-questions').classList.add('hidden');
            document.getElementById('quiz-screen-results').classList.remove('hidden');

            markCurrentLessonComplete();
        }

function finishQuiz() {
            closeQuizModal();
        }

function downloadCertificate() {
            alert(`Emitiendo Certificado ULEAM para ${appState.currentUser.name} por completar el curso "${appState.currentClassroomCourse.title}".`);
        }
