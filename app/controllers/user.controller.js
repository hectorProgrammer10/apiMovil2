const fs = require("fs");
const path = require("path");
const db = require("../models");
const {
  user: User,
  user_roles: UserRoles,
  proyecto: Proyecto,
  calificaciones: Calificaciones,
  product: Product,
  pedido: Pedido,
} = db;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "nombre",
        "carrera",
        "cuatrimestre",
        "categoria",
      ],
    });

    // Obtener todos los evaluadores (usuarios con roleId = 2)
    const evaluadorRoles = await UserRoles.findAll({
      where: { roleId: 2 },
    });

    const evaluadorIds = evaluadorRoles.map((role) => role.userId);

    // Filtrar usuarios que son evaluadores
    const evaluadores = users.filter((user) => evaluadorIds.includes(user.id));

    res.status(200).send({ usuarios: users, evaluadores: evaluadores });
  } catch (err) {
    console.error("Error en adminBoard:", err);
    res.status(500).send({ message: err.message });
  }
};

//-----------proyectos-----------
exports.getUserProjects = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "categoria", "carrera"],
      include: [
        {
          model: Proyecto,
          as: "proyectos",
        },
      ],
    });

    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.downloadFile = (req, res) => {
  try {
    const fileId = req.params.id; // Obtener el ID del archivo desde los parámetros de la ruta

    // Construir la ruta completa del archivo basado en el ID recibido
    // const filePath = path.join(`${fileId}`);
    const filePath = path.join(`/var/data/uploads/${fileId}`);
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return res.status(404).send({
        message: "El archivo no existe.",
      });
    }

    // Descargar el archivo utilizando res.download()
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error al descargar el archivo:", err);
        res.status(500).send({
          message: "No se pudo descargar el archivo.",
        });
      } else {
        console.log("Archivo descargado correctamente:", fileId);
      }
    });
  } catch (err) {
    console.error("Error en downloadFile:", err);
    res.status(500).send({
      message: "Error en el servidor.",
    });
  }
};
//-------------

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };

exports.deleteUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Eliminar el usuario
    await User.destroy({ where: { username: username } });

    res.status(200).send({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.uploadProject = (req, res) => {
  const userId = req.userId; // Este ID proviene del token
  const { nombreProyecto, descripcion, videoPitch } = req.body;

  const fichaTecnica = req.files["fichaTecnica"]
    ? req.files["fichaTecnica"][0].path
    : null;
  const modeloCanva = req.files["modeloCanva"]
    ? req.files["modeloCanva"][0].path
    : null;
  const pdfProyecto = req.files["pdfProyecto"]
    ? req.files["pdfProyecto"][0].path
    : null;

  Proyecto.create({
    idUser: userId,
    name: nombreProyecto,
    description: descripcion,
    videoLink: videoPitch,
    technicalSheet: fichaTecnica,
    canvaModel: modeloCanva,
    projectPdf: pdfProyecto,
  })
    .then(() => {
      res.status(200).send({ message: "Project uploaded successfully!" });
    })
    .catch((err) => {
      console.error("Error en uploadProject:", err);
      res.status(500).send({ message: err.message });
    });
};

//calificaciones mod.

exports.moderatorBoard = async (req, res) => {
  try {
    const calificaciones = await Calificaciones.findAll();
    res.status(200).send(calificaciones);
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    res.status(500).send({ message: error.message });
  }
};

exports.moderatorCal = async (req, res) => {
  const {
    userEvaluador,
    userAlumno,
    innovacion,
    mercado,
    tecnica,
    financiera,
    pitch,
    observaciones,
    total,
  } = req.body;
  try {
    const newCalificacion = await Calificaciones.create({
      userEvaluador,
      userAlumno,
      innovacion,
      mercado,
      tecnica,
      financiera,
      pitch,
      observaciones,
      total,
    });

    res.status(201).send(newCalificacion);
  } catch (error) {
    console.error("Error al crear la calificación:", error);
    res.status(500).send({ message: error.message });
  }
};

//------------------------------------------------------------------------------movil2
//producto post-get
exports.addMds = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  try {
    const newProduct = await Product.create({
      nombre,
      descripcion,
      precio,
    });
    res.send({ message: "producto registered successfully!" });
  } catch (error) {
    console.log("error al crear el producto");
    res.status(500).send({ message: error.message });
  }
};
exports.getMds = async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.status(200).send(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send({ message: error.message });
  }
};
//pedidos post-get
exports.addPedido = async (req, res) => {
  const { name, place, cantidad } = req.body;

  try {
    const newPedido = await Pedido.create({
      name,
      place,
      cantidad,
    });
    res.send({ message: "pedido successfully!" });
  } catch (error) {
    console.log("error al crear el pedido" + error);
    res.status(500).send({ message: error.message });
  }
};
exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.status(200).send(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).send({ message: error.message });
  }
};
