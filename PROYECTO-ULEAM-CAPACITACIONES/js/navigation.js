/* Lógica del módulo: navigation */
function hideAllViews() {
            const views = ['auth', 'student', 'instructor', 'admin', 'classroom', 'editor'];
            views.forEach(v => {
                const el = document.getElementById(`view-${v}`);
                if (el) el.classList.add('hidden');
            });
        }

function showView(viewName) {
            hideAllViews();
            const target = document.getElementById(`view-${viewName}`);
            if (target) target.classList.remove('hidden');
            appState.activeView = viewName;
        }

function navigateToDashboard() {
            if (!appState.currentUser) {
                showView('auth');
                return;
            }

            const role = appState.currentUser.role;
            if (role === 'estudiante') {
                showView('student');
                renderStudentCourses();
            } else if (role === 'instructor') {
                showView('instructor');
                renderInstructorCourses();
            } else if (role === 'admin') {
                showView('admin');
                renderAdminDashboard();
            }
        }
