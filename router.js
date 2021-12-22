const express = require("express");
const router = express.Router();

router.use(require("./routes/welcome"));
router.use(require("./routes/events"));

module.exports = router;
