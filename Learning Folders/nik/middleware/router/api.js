const express = require("express");
const router = express.Router();
const ctr1User = require("../controller/userController");
router.post("/saveinfo", ctr1User.saveInfo);
router.get("/home", ctr1User.home);
module.exports = router;
