var express = require("express"),
  path = require("path"),
  router = express.Router();

// router.use(express.static(path.resolve(__dirname, "views")));
router.use(express.static(path.join(__dirname, "views")));

var ctrl = require("./controller");
router.get("/hello", ctrl.getHello);  //home
router.get("/ytt", ctrl.getSearch); //get video search result
router.get("/ytt/:id", ctrl.getDoc); //get a doc
router.get("/error/:id", ctrl.getError); //get an error
router.post("/ytt", ctrl.postDoc); //post a doc
router.get("/ytt_all", ctrl.getDocs); //get all docs

// router.post("/ytt_ytapi_test", ctrl.test_YT_API_FOR_SINGLE_SEARCH); //post == not working
// router.get("/ytt_ytapi_test", ctrl.test_YT_API_FOR_SINGLE_SEARCH);



module.exports = router; // export router
