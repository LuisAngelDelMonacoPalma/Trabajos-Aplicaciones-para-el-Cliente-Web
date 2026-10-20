/* Lógica del módulo: profile-notifications */
function openProfileModal(userId = null) {
            const user = userId ? appState.users.find(u => u.id === userId) : appState.currentUser;
            if (!user) return;

            activeEditingUserId = user.id;

            document.getElementById('profile-edit-name-display').textContent = user.name;
            document.getElementById('profile-edit-role-badge').textContent = user.role;
            document.getElementById('profile-edit-avatar').src = `https://placehold.co/100x100/C62828/ffffff?text=${user.name.charAt(0)}`;

            document.getElementById('prof-name').value = user.name || '';
            document.getElementById('prof-email').value = user.email || '';
            document.getElementById('prof-phone').value = user.phone || '';
            document.getElementById('prof-dni').value = user.dni || '';
            document.getElementById('prof-country').value = user.country || 'Ecuador';
            document.getElementById('prof-nationality').value = user.nationality || 'Ecuatoriana';
            document.getElementById('prof-address').value = user.address || '';
            document.getElementById('prof-personal-email').value = user.personalEmail || '';
            document.getElementById('prof-dob').value = user.dob || '';
            document.getElementById('prof-gender').value = user.gender || 'Masculino';

            document.getElementById('modal-profile').classList.remove('hidden');
        }

function closeProfileModal() {
            document.getElementById('modal-profile').classList.add('hidden');
        }

function handleSaveProfile(e) {
            e.preventDefault();
            const u = appState.users.find(usr => usr.id === activeEditingUserId);
            if (!u) return;

            u.name = document.getElementById('prof-name').value.trim();
            u.email = document.getElementById('prof-email').value.trim();
            u.phone = document.getElementById('prof-phone').value.trim();
            u.dni = document.getElementById('prof-dni').value.trim();
            u.country = document.getElementById('prof-country').value.trim();
            u.nationality = document.getElementById('prof-nationality').value.trim();
            u.address = document.getElementById('prof-address').value.trim();
            u.personalEmail = document.getElementById('prof-personal-email').value.trim();
            u.dob = document.getElementById('prof-dob').value;
            u.gender = document.getElementById('prof-gender').value;

            if (u.id === appState.currentUser.id) {
                appState.currentUser = u;
                updateHeaderNav();
            }

            saveData();
            closeProfileModal();
            alert('Perfil actualizado correctamente.');
        }

function toggleNotifications() {
            const drawer = document.getElementById('modal-notifications');
            drawer.classList.toggle('hidden');
        }

function addNotification(text) {
            appState.notifications.unshift({
                id: 'n_' + Date.now(),
                text: text,
                date: 'Ahora'
            });
            saveData();
            renderNotifications();
        }

function renderNotifications() {
            const list = document.getElementById('notifications-list');
            const badge = document.getElementById('notif-badge');

            list.innerHTML = '';
            if (appState.notifications.length > 0) {
                badge.classList.remove('hidden');
                appState.notifications.forEach(n => {
                    list.innerHTML += `
                        <div class="p-3 border-b text-xs space-y-1 bg-gray-50 rounded">
                            <p class="text-gray-800 font-medium">${n.text}</p>
                            <span class="text-[10px] text-gray-400 block">${n.date}</span>
                        </div>
                    `;
                });
            } else {
                badge.classList.add('hidden');
                list.innerHTML = `<p class="text-center py-6 text-xs text-gray-400">Sin notificaciones.</p>`;
            }
        }

function clearNotifications() {
            appState.notifications = [];
            saveData();
            renderNotifications();
        }

function openParticipantsModal(courseId) {
            const course = appState.courses.find(c => c.id === courseId);
            const container = document.getElementById('participants-list-container');
            container.innerHTML = '';

            const courseEnrollments = appState.enrollments.filter(e => e.courseId === courseId);

            if (courseEnrollments.length === 0) {
                container.innerHTML = `<p class="text-center py-4 text-xs text-gray-400">No hay estudiantes inscritos aún.</p>`;
            } else {
                courseEnrollments.forEach(en => {
                    const student = appState.users.find(u => u.id === en.userId);
                    if (student) {
                        container.innerHTML += `
                            <div class="py-2 flex justify-between items-center text-xs">
                                <div>
                                    <p class="font-bold text-gray-800">${student.name}</p>
                                    <p class="text-gray-400">${student.email}</p>
                                </div>
                                <span class="bg-gray-100 px-2 py-0.5 rounded font-bold">${en.progress}%</span>
                            </div>
                        `;
                    }
                });
            }

            document.getElementById('modal-participants').classList.remove('hidden');
        }

function closeParticipantsModal() {
            document.getElementById('modal-participants').classList.add('hidden');
        }
