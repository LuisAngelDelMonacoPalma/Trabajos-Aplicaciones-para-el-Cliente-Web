# ULEAM Capacitaciones — prototipo organizado

## Estructura
- `index.html`: estructura de las pantallas, formularios y modales.
- `css/styles.css`: estilos personalizados y scrollbar.
- `js/tailwind-config.js`: colores y tipografía personalizados de Tailwind.
- `js/state.js`: datos iniciales, estado global y persistencia con `localStorage`.
- `js/auth.js`: inicio de sesión de demostración, recuperación y cierre de sesión.
- `js/navigation.js`: navegación entre vistas.
- `js/student.js`: catálogo, cursos del estudiante e inscripción.
- `js/classroom.js`: aula virtual, lecciones, cuestionarios y certificado de demostración.
- `js/instructor.js`: panel del instructor y borradores.
- `js/admin.js`: panel administrativo, cursos, aprobaciones y usuarios.
- `js/course-editor.js`: editor de cursos, módulos y elementos.
- `js/profile-notifications.js`: perfil, notificaciones y participantes.
- `js/main.js`: inicialización.

## Ejecutar
Abre `index.html` en un navegador. Se requiere conexión a Internet para cargar Tailwind CSS, Font Awesome, Google Fonts y las imágenes externas utilizadas por el prototipo. También puedes servir esta carpeta con una extensión como Live Server.

## Accesos rápidos de demostración
En la pantalla de inicio de sesión usa los botones Estudiante, Instructor o Admin.

## Importante
Esta reorganización mantiene la arquitectura original de prototipo: datos de ejemplo y `localStorage` en el navegador. No es todavía un sistema de autenticación seguro ni una plataforma multiusuario conectada a una base de datos. La recuperación de contraseña y el certificado son demostrativos. Para producción, estas funciones deben implementarse en un backend con autorización por rol.
