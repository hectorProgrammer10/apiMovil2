const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { dir } = require("console");

// Directorio persistente en Render
const UPLOADS_DIR = path.join(__dirname, "/var/data/uploads");

// Crear el directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configurar multer para usar la carpeta persistente en el disco
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const multipleUpload = upload.fields([
  { name: "fichaTecnica", maxCount: 1 },
  { name: "modeloCanva", maxCount: 1 },
  { name: "pdfProyecto", maxCount: 1 },
]);

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/app/all", controller.allAccess);

  app.get("/api/app/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/app/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/app/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Nueva ruta para subir proyectos
  app.post(
    "/api/app/uploadProject",
    [authJwt.verifyToken, multipleUpload],
    controller.uploadProject
  );

  // Nueva ruta para eliminar un usuario por su nombre de usuario
  app.delete(
    "/api/app/admin/user/:username",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUserByUsername
  );

  //----proyectos---
  // Nueva ruta para obtener los datos del usuario y sus proyectos
  app.get(
    "/api/app/userProjects",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserProjects
  );

  // Nueva ruta para descargar archivos
  app.get(
    "/api/app/download/:id",
    [authJwt.verifyToken],
    controller.downloadFile
  );

  app.get(
    "/api/app/userProjectsAll",
    [authJwt.verifyToken],
    controller.getUserProjects
  );

  //calificaiones
  app.get(
    "/api/app/ssv/obtenerCal",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.moderatorBoard
  );
  app.post(
    "/api/app/ssv/mandarCal",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorCal
  );
  // ---------------------------------------------------------------------------------------------------- movil 2
  //productosMds
  app.post("/api/app/ssv/mds", controller.addMds);
  app.get("/api/app/ssv/getMds", controller.getMds);

  //pedidos
  app.post("/api/app/ssv/pedido", controller.addPedido);
  app.get("/api/app/ssv/getPedidos", controller.getPedidos);
};
//-------
