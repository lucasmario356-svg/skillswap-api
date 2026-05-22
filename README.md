# skillswap-api
Descripción del proyecto

Este es el servidor central de la aplicación SkillSwap. Su función principal es gestionar la base de datos, controlar el acceso de los usuarios y asegurar que toda la información que llega desde el cliente sea válida antes de guardarla.

Funcionalidades principales

Protección de rutas: Se utiliza JWT (JSON Web Tokens) para que solo los usuarios identificados puedan realizar acciones como publicar o editar habilidades.

Validación estricta de datos: He implementado un middleware con la librería Joi que actúa como filtro. Si alguien intenta enviar un precio negativo o un título demasiado corto, el servidor bloquea la petición automáticamente.

Envío de correos electrónicos: El sistema está conectado a una cuenta de Gmail real mediante Nodemailer. Cuando un usuario se registra, recibe un enlace de verificación en su bandeja de entrada para activar su cuenta.

Jerarquía de usuarios: La base de datos admite tres niveles de permisos: Admin, Helper y User, lo que permite controlar qué puede hacer cada persona en la plataforma.

Stack técnico

Node.js y Express para la estructura del servidor.

MongoDB Atlas y Mongoose para el almacenamiento de datos.

Nodemailer para la gestión de mensajería.

Joi para la integridad de los datos.