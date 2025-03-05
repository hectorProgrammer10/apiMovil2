const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "*",
};

// const corsOptions = {
//   origin: ["http://localhost:8081", "http://localhost:5173"],
// };

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   reset();
// });

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn____NNNN.",
  });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on http://localhost:${PORT} or accessible via your network IP`
  );
});
//////////si es primera vez
//reset();
//----
function reset() {
  setTimeout(() => {
    initial();
  }, 200);
}

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
