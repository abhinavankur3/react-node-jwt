const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "a1s2d3f4g5h6j7k8l9";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await userModel.find({ username });
    user = user && user.length && user[0];

    if (!user) {
      let err = new Error();
      err.code = "auth/invalid-username-password";
      err.message = "Invalid username or password";
      throw err;
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      let err = new Error();
      err.code = "auth/invalid-username-password";
      err.message = "Invalid username or password";
      throw err;
    }
    const accessToken = jwt.sign({ username: user.username, _id: user._id }, accessTokenSecret);
    res.status(200).send({ accessToken, fullname: user.fullname, email: user.email });
  } catch (err) {
    res.status(500).send({ error: { code: err.code, message: err.message } });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, fullname, email } = req.body;
    if (!username || !password || !fullname || !email) {
      let err = new Error();
      err.code = "auth/missing-parameters";
      err.message = "Required parameters missing";
      throw err;
    }
    await userModel.create({ username, password: bcrypt.hashSync(password, 8), fullname, email });
    res.status(200).send({ registered: true });
  } catch (err) {
    res.status(500).send({ error: { code: err.code, message: err.message } });
  }
});

router.get("/getUser", authenticateJWT, async (req, res) => {
  const user = await userModel.find({ _id: req.userId }).select("fullname email");
  res.status(200).send({ user: user[0] });
});

module.exports = router;
