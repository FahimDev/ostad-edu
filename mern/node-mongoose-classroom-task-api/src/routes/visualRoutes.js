const express = require("express");
const { dbState } = require("../controllers/visualController");

const router = express.Router();

router.get("/db-state", dbState);

module.exports = router;
