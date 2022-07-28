const Patient = require("../models/patient");
const { validationResult } = require("express-validator/check");
import { errorType } from "../app";
import { patientType } from "../models/patient";

type getPatientsResType = {
  status: (statusCode: number) => any;
  json: (patients: patientType[]) => any;
};

type nextType = (error: errorType) => any;

type addPatientReqType = {
  body: {
    name: string;
    gender: string;
    relation: string;
  };
  userId: number;
};

type addPatientResType = {
  status: (statusCode: number) => any;
  json: (arg: {
    message: string;
    patient: {
      name: string;
      gender: string;
      relation: string;
      userId: number;
    };
  }) => any;
};

type getPatientReqType = {
  params: {
    patientId: number;
  };
};

type getPatientResType = {
  status: (statusCode: number) => any;
  json: (patient: patientType) => any;
};

type updatePatientReqType = {
  body: {
    name: string;
    gender: string;
    relation: string;
  };
  params: {
    patientId: number;
  };
};

type updatePatientResType = {
  status: (statusCode: number) => any;
  json: (arg: {
    message: string;
    patient: {
      name: string;
      gender: string;
      relation: string;
    };
  }) => any;
};

type deletePatientReqType = {
  params: {
    patientId: number;
  };
};

type deletePatientResType = {
  status: (statusCode: number) => any;
  send: (message: string) => any;
};

const getPatients = (_req: any, res: getPatientsResType, next: nextType) => {
  Patient.findAll()
    .then((patients: patientType[]) => {
      res.status(200).json(patients);
    })
    .catch((error: errorType) => {
      error.statusCode = 500;
      error.message = "Couldn't get patients";
      return next(error);
    });
};

const addPatient = (
  req: addPatientReqType,
  res: addPatientResType,
  next: nextType
) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: errorType = {
      message: "Validation failed",
      statusCode: 422,
    };
    throw error;
  }
  const name = req.body.name;
  const gender = req.body.gender;
  const relation = req.body.relation;

  Patient.create({
    name: name,
    gender: gender,
    relation: relation,
    userId: req.userId,
  })
    .then(() => {
      res.status(201).json({
        message: "Patient added successfully!",
        patient: {
          name: name,
          gender: gender,
          relation: relation,
          userId: req.userId,
        },
      });
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Couldn't add patient";
      }
      return next(err);
    });
};

const getPatient = (
  req: getPatientReqType,
  res: getPatientResType,
  next: nextType
) => {
  Patient.findByPk(req.params.patientId)
    .then((patient: patientType) => {
      if (patient === null) {
        const error: errorType = {
          message: `Patient with id-${req.params.patientId} not found. Please try another id`,
          statusCode: 404,
        };
        throw error;
      }
      res.status(200).json(patient);
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Couldn't get patient";
      }
      return next(err);
    });
};

const updatePatient = (
  req: updatePatientReqType,
  res: updatePatientResType,
  next: nextType
) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error: errorType = {
      message: "Validation failed",
      statusCode: 422,
    };
    throw error;
  }
  const name = req.body.name;
  const gender = req.body.gender;
  const relation = req.body.relation;

  Patient.findByPk(req.params.patientId)
    .then((patient: patientType) => {
      if (patient === null) {
        const error: errorType = {
          message: `Patient with id-${req.params.patientId} not found. Please try another id`,
          statusCode: 404,
        };
        throw error;
      }
      patient.name = name;
      patient.gender = gender;
      patient.relation = relation;
      return patient.save();
    })
    .then(() => {
      res.status(201).json({
        message: "Patient details updated successfully!",
        patient: { name: name, gender: gender, relation: relation },
      });
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Couldn't update patient";
      }
      return next(err);
    });
};

const deletePatient = (
  req: deletePatientReqType,
  res: deletePatientResType,
  next: nextType
) => {
  Patient.findByPk(req.params.patientId)
    .then((patient: patientType) => {
      if (patient === null) {
        const error: errorType = {
          message: `Patient with id-${req.params.patientId} not found. Please try another id`,
          statusCode: 404,
        };
        throw error;
      }
      return patient.destroy();
    })
    .then(() => {
      res
        .status(200)
        .send(`Patient with id-${req.params.patientId} deleted successfully!`);
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Couldn't delete patient";
      }
      return next(err);
    });
};

module.exports = {
  getPatients: getPatients,
  getPatient: getPatient,
  addPatient: addPatient,
  updatePatient: updatePatient,
  deletePatient: deletePatient,
};
