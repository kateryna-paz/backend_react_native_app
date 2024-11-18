const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;
const mongoURI = process.env.MONGO_URI;

const appliancesRouter = require("./routers/appliances");
const usersRouter = require("./routers/users");
const panelsRouter = require("./routers/panels");
const locationsRouter = require("./routers/locations");
const regionsRouter = require("./routers/regions");
const panelTypesRouter = require("./routers/panelTypes");

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

// Routers
app.use(`${api}/appliances`, appliancesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/panels`, panelsRouter);
app.use(`${api}/locations`, locationsRouter);
app.use(`${api}/regions`, regionsRouter);
app.use(`${api}/paneltypes`, panelTypesRouter);

mongoose
  .connect(mongoURI, {
    dbName: "solar-panels",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});
