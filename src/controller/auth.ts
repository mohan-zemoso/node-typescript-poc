const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { errorType } from "../app";
import { userType } from "../models/user";

type nextType = (error: errorType) => any;

type signupReqType = {
  body: {
    name: string;
    email: string;
    password: string;
  };
};

type signupResType = {
  status: (statusCode: number) => any;
  json: (arg: { message: string; user: { name: string } }) => any;
};

type loginReqType = {
  body: {
    email: string;
    password: string;
  };
};

type loginResType = {
  status: (statusCode: number) => any;
  json: (arg: { token: any; id: number; name: string; email: string }) => any;
};

const signup = (req: signupReqType, res: signupResType, next: nextType) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    const error: errorType = {
      message: validationError.array()[0].msg,
      statusCode: 422,
    };
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((encyptedPwd: string) => {
      const user = new User({
        name: name,
        email: email,
        password: encyptedPwd,
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: "User added successfully!",
        user: { name: name },
      });
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Password encyption failed";
      }
      return next(err);
    });
};

const login = (req: loginReqType, res: loginResType, next: nextType) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  let loadedUser: userType;

  User.findOne({ where: { email: email } })
    .then((user: userType) => {
      if (!user) {
        const error: errorType = {
          message: "User not found!!",
          statusCode: 401,
        };
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual: boolean) => {
      if (!isEqual) {
        const error: errorType = {
          message: "Wrong password!!",
          statusCode: 401,
        };
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id,
        },
        "secretkey",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        id: loadedUser.id,
        name: loadedUser.name,
        email: loadedUser.email,
      });
    })
    .catch((err: errorType) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Login failed";
      }
      return next(err);
    });
};

module.exports = {
  signup: signup,
  login: login,
};
