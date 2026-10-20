/* Lógica del módulo: auth */
function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const user = appState.users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (user) {
                appState.currentUser = user;
                launchPlatform();
            } else {
                alert('Usuario no encontrado. Utilice una de las opciones rápidas de prueba.');
            }
        }

function loginPreset(role) {
            const user = appState.users.find(u => u.role === role);
            if (user) {
                appState.currentUser = user;
                launchPlatform();
            }
        }

function launchPlatform() {
            document.getElementById('main-header').classList.remove('hidden');
            updateHeaderNav();
            navigateToDashboard();
            renderNotifications();
        }

function switchRole(role) {
            const user = appState.users.find(u => u.role === role);
            if (user) {
                appState.currentUser = user;
                updateHeaderNav();
                navigateToDashboard();
            }
        }

function showAuthStep(step) {
            document.getElementById('auth-login-card').classList.add('hidden');
            document.getElementById('auth-recovery-1').classList.add('hidden');
            document.getElementById('auth-recovery-2').classList.add('hidden');

            if (step === 'login') document.getElementById('auth-login-card').classList.remove('hidden');
            if (step === 'recovery-1') document.getElementById('auth-recovery-1').classList.remove('hidden');
            if (step === 'recovery-2') document.getElementById('auth-recovery-2').classList.remove('hidden');
        }

function resendCode() {
            alert('Código reenviado al correo institucional: 123456');
        }

function validateRecoveryCode() {
            const val = document.getElementById('recovery-code-input').value.trim();
            if (val === '123456' || val.length >= 4) {
                showAuthStep('recovery-2');
            } else {
                alert('Código inválido. Ingrese 123456 para la prueba.');
            }
        }

function handleResetPassword(e) {
            e.preventDefault();
            const p1 = document.getElementById('new-pass').value;
            const p2 = document.getElementById('confirm-pass').value;

            if (p1 !== p2) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            alert('Contraseña actualizada correctamente. Inicie sesión.');
            showAuthStep('login');
        }

function confirmLogout() {
            document.getElementById('modal-logout').classList.remove('hidden');
        }

function closeLogoutModal() {
            document.getElementById('modal-logout').classList.add('hidden');
        }

function executeLogout() {
            closeLogoutModal();
            appState.currentUser = null;
            document.getElementById('main-header').classList.add('hidden');
            showView('auth');
            showAuthStep('login');
        }

function togglePasswordVisibility(fieldId) {
            const input = document.getElementById(fieldId);
            input.type = input.type === 'password' ? 'text' : 'password';
        }
