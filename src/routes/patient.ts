const express = require("express");
const { body } = require("express-validator/check");
const router = express.Router();
const patientController = require("../controller/patient");
const isAuth = require("../middleware/isAuth");

router.get("/patients", isAuth, patientController.getPatients);
router.post(
  "/patients",
  isAuth,
  [
    body("name").trim().isAlpha(),
    body("gender").trim().isAlpha(),
    body("relation").trim().isAlpha(),
  ],
  patientController.addPatient
);
router.get("/patients/:patientId", isAuth, patientController.getPatient);
router.put(
  "/patients/:patientId",
  isAuth,
  [
    body("name").trim().isAlpha(),
    body("gender").trim().isAlpha(),
    body("relation").trim().isAlpha(),
  ],
  patientController.updatePatient
);
router.delete("/patients/:patientId", isAuth, patientController.deletePatient);

module.exports = {
  router: router,
};
