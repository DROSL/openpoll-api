const express = require("express");
const router = express.Router();

router.use(require("./routes/welcome"));
router.use(require("./routes/events"));
router.use(require("./routes/file"));
router.use(require("./routes/polls"));
router.use(require("./routes/answers"));
router.use(require("./routes/votes"));

module.exports = router;
