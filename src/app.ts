import express from "express";
import bodyParser from "body-parser";
const app = express();
const patientRoutes = require("./routes/patient");
const authRoutes = require("./routes/auth");
const sequelizeProd = require("./util/database");
const Patient = require("./models/patient");
const User = require("./models/user");

export type errorType = { statusCode: number; message: string };
type corsMiddlewareResType = {
  setHeader: (arg0: string, arg1: string) => void;
};
type errorMiddlewareResType = {
  status: (statusCode: number) => any;
  send: (message: string) => any;
};

app.use(bodyParser.json()); // application/json
app.use((_req: any, res: corsMiddlewareResType, next: () => void) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/booking", patientRoutes.router);
app.use("/auth", authRoutes.router);
app.use(
  (error: errorType, _req: any, res: errorMiddlewareResType, _next: any) => {
    res.status(error.statusCode).send(error.message);
  }
);

Patient.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Patient);
sequelizeProd
  .sync({ force: true })
  // .sync()
  .then(() => {
    app.listen(8080);
  })
  .catch((err: any) => {
    console.log(err);
  });
