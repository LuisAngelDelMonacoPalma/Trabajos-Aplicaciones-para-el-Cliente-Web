/* Estado inicial y persistencia local. Los datos se guardan en localStorage. */
/* -------------------------------------------------------------------
           1. INITIAL STATE & STORAGE MANAGEMENT (LocalStorage)
        ------------------------------------------------------------------- */
        const DEFAULT_USERS = [
            { id: 'u1', email: 'estudiante@uleam.edu.ec', name: 'Usuario Estudiante', role: 'estudiante', phone: '0987654321', dni: '1314745769', country: 'Ecuador', nationality: 'Ecuatoriana', address: 'Barrio María Auxiliadora #2', personalEmail: 'estudiante@gmail.com', dob: '2002-03-27', gender: 'Masculino', status: 'ACTIVO' },
            { id: 'u2', email: 'instructor@uleam.edu.ec', name: 'Luis Del Mónaco', role: 'instructor', phone: '0991234567', dni: '1309876543', country: 'Ecuador', nationality: 'Ecuatoriana', address: 'Manta Central', personalEmail: 'luis.monaco@gmail.com', dob: '1985-08-14', gender: 'Masculino', status: 'ACTIVO' },
            { id: 'u3', email: 'admin@uleam.edu.ec', name: 'Administrador ULEAM', role: 'admin', phone: '0955555555', dni: '1300000000', country: 'Ecuador', nationality: 'Ecuatoriana', address: 'Campus Manta', personalEmail: 'admin@uleam.edu.ec', dob: '1980-01-01', gender: 'Masculino', status: 'ACTIVO' }
        ];

        const DEFAULT_COURSES = [
            {
                id: 'c101',
                title: 'Introducción a Python',
                category: 'Programación',
                instructorId: 'u2',
                instructorName: 'Luis Del Mónaco',
                description: 'Aprende los fundamentos de programación con Python desde cero. Control de flujo, funciones y POO.',
                cover: 'https://placehold.co/600x400/C62828/ffffff?text=Introducción+a+Python',
                status: 'PUBLICADO', // PUBLICADO, PENDIENTE, BORRADOR, DESHABILITADO
                pendingAction: null, // 'PUBLICACION', 'DESHABILITACION'
                modules: [
                    {
                        id: 'm1',
                        title: 'Módulo 1: Fundamentos y Sintaxis',
                        items: [
                            { id: 'i1', type: 'leccion', title: 'Lección 1 - Variables y Tipos de Datos', completed: false, videoUrl: '' },
                            { id: 'i2', type: 'leccion', title: 'Lección 2 - Operadores y Expresiones', completed: false, videoUrl: '' },
                            { id: 'i3', type: 'recurso', title: 'Recurso 1: Guía_Sintaxis.pdf', fileUrl: '#' },
                            { id: 'i4', type: 'evaluacion', title: 'Evaluación 1: Quiz Sintaxis', completed: false, score: 0, maxScore: 10 }
                        ]
                    },
                    {
                        id: 'm2',
                        title: 'Módulo 2: Estructuras de Control',
                        items: [
                            { id: 'i5', type: 'leccion', title: 'Lección 3 - Bucles y Condicionales', completed: false, videoUrl: '' },
                            { id: 'i6', type: 'recurso', title: 'Recurso 2: Ejemplo_Bucles.py', fileUrl: '#' },
                            { id: 'i7', type: 'evaluacion', title: 'Evaluación 2: Control de Flujo', completed: false, score: 0, maxScore: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'c102',
                title: 'Redes y Protocolos',
                category: 'Redes',
                instructorId: 'u2',
                instructorName: 'Luis Del Mónaco',
                description: 'Principios de redes TCP/IP, modelo OSI, direccionamiento IPv4/IPv6 y enrutamiento básico.',
                cover: 'https://placehold.co/600x400/424242/ffffff?text=Redes+y+Protocolos',
                status: 'PUBLICADO',
                pendingAction: null,
                modules: [
                    {
                        id: 'm201',
                        title: 'Módulo 1: Modelo OSI y TCP/IP',
                        items: [
                            { id: 'i201', type: 'leccion', title: 'Capas del Modelo OSI', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'c103',
                title: 'Patrones de Diseño SOLID',
                category: 'Programación',
                instructorId: 'u2',
                instructorName: 'Luis Del Mónaco',
                description: 'Buenas prácticas de arquitectura de software orientada a objetos y principios SOLID.',
                cover: 'https://placehold.co/600x400/7CB342/ffffff?text=Patrones+SOLID',
                status: 'PUBLICADO',
                pendingAction: null,
                modules: []
            }
        ];

        const DEFAULT_ENROLLMENTS = [
            { userId: 'u1', courseId: 'c101', progress: 50, completed: false, completedLessons: ['i1', 'i2'] }
        ];

        const DEFAULT_NOTIFICATIONS = [
            { id: 'n1', text: 'Bienvenido a la plataforma ULEAM Capacitaciones', date: 'Hoy' },
            { id: 'n2', text: 'Te has inscrito en "Introducción a Python"', date: 'Ayer' }
        ];

        // Global State variables
        var appState = {
            currentUser: null,
            users: [],
            courses: [],
            enrollments: [],
            notifications: [],
            activeView: 'auth',
            currentClassroomCourse: null,
            activeClassroomItem: null,
            editingCourse: null,
            editingModuleIndexForContent: null,
            activeQuiz: null
        };

        // Initialize LocalStorage Data

function initStorage() {
            if (!localStorage.getItem('uleam_users')) {
                localStorage.setItem('uleam_users', JSON.stringify(DEFAULT_USERS));
            }
            if (!localStorage.getItem('uleam_courses')) {
                localStorage.setItem('uleam_courses', JSON.stringify(DEFAULT_COURSES));
            }
            if (!localStorage.getItem('uleam_enrollments')) {
                localStorage.setItem('uleam_enrollments', JSON.stringify(DEFAULT_ENROLLMENTS));
            }
            if (!localStorage.getItem('uleam_notifications')) {
                localStorage.setItem('uleam_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
            }

            appState.users = JSON.parse(localStorage.getItem('uleam_users'));
            appState.courses = JSON.parse(localStorage.getItem('uleam_courses'));
            appState.enrollments = JSON.parse(localStorage.getItem('uleam_enrollments'));
            appState.notifications = JSON.parse(localStorage.getItem('uleam_notifications'));
        }

function saveData() {
            localStorage.setItem('uleam_users', JSON.stringify(appState.users));
            localStorage.setItem('uleam_courses', JSON.stringify(appState.courses));
            localStorage.setItem('uleam_enrollments', JSON.stringify(appState.enrollments));
            localStorage.setItem('uleam_notifications', JSON.stringify(appState.notifications));
        }
