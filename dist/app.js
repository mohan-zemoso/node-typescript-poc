"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const patientRoutes = require("./routes/patient");
const authRoutes = require("./routes/auth");
const sequelizeProd = require("./util/database");
const Patient = require("./models/patient");
const User = require("./models/user");
app.use(body_parser_1.default.json()); // application/json
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/booking", patientRoutes.router);
app.use("/auth", authRoutes.router);
app.use((error, _req, res, _next) => {
    res.status(error.statusCode).send(error.message);
});
Patient.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Patient);
sequelizeProd
    // .sync({ force: true })
    .sync()
    .then(() => {
    app.listen(8080);
})
    .catch((err) => {
    console.log(err);
});
