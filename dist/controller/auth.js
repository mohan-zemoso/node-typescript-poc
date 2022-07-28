"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const error = {
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
        .then((encyptedPwd) => {
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
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Password encyption failed";
        }
        return next(err);
    });
};
const login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ where: { email: email } })
        .then((user) => {
        if (!user) {
            const error = {
                message: "User not found!!",
                statusCode: 401,
            };
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
        .then((isEqual) => {
        if (!isEqual) {
            const error = {
                message: "Wrong password!!",
                statusCode: 401,
            };
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: loadedUser.email,
            userId: loadedUser.id,
        }, "secretkey", { expiresIn: "1h" });
        res.status(200).json({
            token: token,
            id: loadedUser.id,
            name: loadedUser.name,
            email: loadedUser.email,
        });
    })
        .catch((err) => {
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
