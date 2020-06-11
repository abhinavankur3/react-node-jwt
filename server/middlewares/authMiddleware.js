const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "a1s2d3f4g5h6j7k8l9";

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      let err = new Error();
      err.code = "auth/token-missing";
      err.message = "Token is missing";
      throw err;
    }
    const token = authHeader.split(" ")[1];
    const userInfo = await jwt.verify(token, accessTokenSecret);
    const user = await userModel.find({ _id: userInfo._id });
    if (user && user.length) {
      req.userId = user[0]._id;
      next();
    }
  } catch (err) {
    res.status(518).send({ error: { code: err.code, message: err.message } });
  }
};

module.exports = { authenticateJWT };
