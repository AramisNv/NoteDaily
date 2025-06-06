
# 📓 NoteDaily

**Nombre del Sistema**: NoteDaily  
**Descripción Breve**: Aplicación web de gestión de notas personales.  

**Equipo de Desarrollo**:  
- Nava Murillo Priscila Aramis

---

## 1. Introducción

### 📄 Descripción General
NoteDaily es una aplicación web que permite a los usuarios crear, editar, visualizar y eliminar notas personales. Su diseño busca ofrecer una experiencia sencilla e intuitiva para el registro de información cotidiana.

### 🎯 Audiencia
Dirigida a estudiantes, profesionales y cualquier persona interesada en llevar un control organizado de sus tareas o ideas diarias.

### 🚀 Alcance
La aplicación permite el registro de usuarios, autenticación, y la gestión de notas. Las notas pueden tener título, contenido, fecha y se almacenan por usuario. La interfaz está diseñada siguiendo un prototipo definido en Figma.

---

## 2. Resumen del Sistema

### 🎯 Objetivo General
Desarrollar una aplicación web full-stack funcional que permita gestionar notas personales de forma segura y eficiente.

### 🔧 Funcionalidades Principales
- Registro y login de usuarios.
- Creación, edición, lectura y eliminación (CRUD) de notas.
- Interfaz gráfica amigable basada en diseño Figma.

### 🧱 Arquitectura General del Diseño
Sigue una arquitectura cliente-servidor utilizando el patrón MVC:

- **Frontend**: HTML, CSS y JavaScript.  
- **Backend**: Node.js con Express.js.  
- **Base de datos**: MongoDB.

---

## 3. Requisitos

### ✅ Requisitos Funcionales

- **RF01**: El usuario podrá registrarse con un correo y contraseña.  
- **RF02**: El usuario podrá iniciar sesión con sus credenciales.  
- **RF03**: El usuario podrá crear una nueva nota.  
- **RF04**: El usuario podrá editar y eliminar sus notas.  
- **RF05**: El sistema validará que solo el dueño de la nota pueda modificarla o eliminarla.

### 📌 Requisitos No Funcionales

- **RNF01**: La aplicación debe estar disponible 24/7.  
- **RNF02**: El tiempo de respuesta del servidor debe ser menor a 2 segundos.  
- **RNF03**: El diseño debe ser responsivo.

### 🛠️ Requisitos Técnicos

- **Lenguaje de programación**: JavaScript  
- **Frameworks**: Node.js, Express.js  
- **Base de datos**: MongoDB  
- **Librerías**: dotenv, mongoose, bcrypt, jsonwebtoken, bootstrap, etc.

---

## 4. Arquitectura del Sistema

### 🧩 Tecnologías Usadas

- **Frontend**: HTML, CSS, JavaScript (vanilla), bootstrap.
- **Backend**: Node.js + Express.js  
- **Base de Datos**: MongoDB (Atlas o local)  
- **Control de versiones**: Git

### 📁 Estructura de la Aplicación

```
NoteDaily/
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── views/
│   ├── index.html
│   
│   └── dashboard.html
├── controllers/
│   └── authController.js
├── public/
│   ├── css/
│   └── js/
├── .env
├── server.js
├── package.json
```

---

## 5. Instalación

### 🧰 Requisitos de Software

- Node.js >= 18.x  
- MongoDB Atlas o local  
- Navegador actualizado

### 💻 Requisitos de Hardware

- CPU de 2 núcleos  
- 4 GB de RAM  
- Conexión a Internet

### 🛠️ Pasos para instalación
Antes de instalar, asegúrate de tener instalado:
Node.js (recomendado: versión 16+)
MongoDB (puede ser local o MongoDB Atlas)

Git (opcional, si vas a clonar el proyecto desde un repositorio)
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/notedaily.git
   ```
2. Instala dependencias:
   ```bash
   npm install bcryptjs cors dotenv express jsonwebtoken mongosee
   ```
3. Crea el archivo `.env` con las siguientes variables:
   ```
  MONGO_URI=mongodb+srv://yutritospecopeco:Cagada123@tiendaonline.2a9gy.mongodb.net/dailyNote
  PORT=5000
  JWT_SECRET=CaquitaPorSiempre
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   # o
   node server.js
   # o
   nodemon server.js
   ```
5. Colocarse en carpeta frontend y al archivo index.html. Dar la opción de abrir con Live server
   ```

---

## 6. Uso del Sistema

### 🔁 Flujo del Usuario

1. El usuario accede al login.  
2. Si no tiene cuenta, se registra.  
3. Una vez autenticado, se debe logear con su email y contraseña.
4. Accede al panel principal del programa, 
5. Desde allí puede crear, leer, editar y eliminar sus notas.
6. Si desea, puede cerrar sesion, regresando al login.

![image](https://github.com/user-attachments/assets/0ae8ec06-13b5-450a-8c6a-af9a2f094ad6)
![image](https://github.com/user-attachments/assets/dd15990b-7341-43bd-aa92-3523705c327e)
![image](https://github.com/user-attachments/assets/f773950c-6139-406b-8bed-84ab95841d4a)
![image](https://github.com/user-attachments/assets/39776595-3e58-4ec1-8af5-f9f30c3dd00e)
![image](https://github.com/user-attachments/assets/51773519-65de-4ead-a3ca-47ef0758926a)





---

## 7. Base de Datos

### 📐 Modelado

**Usuario**:
- `_id` (ObjectId)  
- `nombre` (String)  
- `email` (String, único)  
- `contraseña` (String, encriptada)  


**Nota**:
- `_id` (ObjectId)  
- `titulo` (String)  
- `contenido` (String)  
- `etiquetas`: `["personal", "importante"]`  
- `fechaCreacion` (Date)  
- `usuarioId` (ObjectId, referencia a Usuario)  


### 📄 Descripción de las Entidades

**Colección `usuarios`**:
- `_id`: ID único generado automáticamente.  
- `nombre`: Nombre del usuario.  
- `email`: Correo electrónico único del usuario.  
- `contraseña`: Hash de la contraseña (usa bcrypt).  


**Colección `notas`**:
- `_id`: ID único de la nota.  
- `titulo`: Título de la nota.  
- `contenido`: Cuerpo de la nota.  
- `etiquetas`: Lista de etiquetas asociadas.  
- `fechaCreacion`: Fecha cuando se creó la nota.  


---

### 🔍 Consultas principales

- **Obtener notas de un usuario**:
  ```js
  Note.find({ user: userId }).populate('labels');
  ```

- **Crear nota con etiquetas**:
  ```js
  await Note.create({
    user: userId,
    title: "Nueva nota",
    content: "Contenido importante",
    labels: [labelId1, labelId2]
  });
  ```

- **Filtrar notas por etiquetas**:
  ```js
  db.notas.find({
    usuarioId: ObjectId("ID-del-usuario"),
    etiquetas: "trabajo"
  });
  ```

- **Eliminar una etiqueta de una nota existente**:
  ```js
  db.notas.updateOne(
    { _id: ObjectId("ID-de-la-nota") },
    { $pull: { etiquetas: "etiqueta-a-quitar" } }
  );
  ```


