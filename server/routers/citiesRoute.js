const router = require("express").Router();
const { authenticateJWT } = require("../middlewares/authMiddleware");
const cities = require("../cities.json");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    res.status(200).send({ cities });
  } catch (err) {
    res.status(518).send({ error: { code: err.code, message: err.message } });
  }
});

module.exports = router;
