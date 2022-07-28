import jwt from "jsonwebtoken";
import { errorType } from "../app";

type authReqType = {
  userId: number;
  get: (header: string) => string;
};

module.exports = (req: authReqType, _res: any, next: () => void) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: errorType = {
      message: "Not authenticated.",
      statusCode: 401,
    };
    throw error;
  }
  const token: string = authHeader.split(" ")[1];

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "secretkey");
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error: errorType = {
      message: "Not authenticated.",
      statusCode: 401,
    };
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
