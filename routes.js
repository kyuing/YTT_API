var express = require("express"),
  path = require("path"),
  router = express.Router();

// router.use(express.static(path.resolve(__dirname, "views")));
router.use(express.static(path.join(__dirname, "views")));

var ctrl = require("./controller");
router.get("/hello", ctrl.getHello);  //home
router.get("/ytt", ctrl.getSearch); //get video search result
// router.get("/ytt/:id", ctrl.getDoc); //get a doc

router.get("/error/:id", ctrl.getError); //get an error

router.post("/ytt", ctrl.postDoc); //post a doc
router.get("/ytt/api/all", ctrl.getDocs); //get all docs
router.get("/ytt/api/:id", ctrl.getDoc); //get a doc in full
router.get("/ytt/api/:id/scripts", ctrl.getScripts);  //get scripts by all languages available in a doc
router.get("/ytt/api/:id/script", ctrl.getScript);  //get a script by a language in a doc. just add q='language name goes here'
router.get("/ytt/api/:id/numoflangs", ctrl.getAvailableLang);


// router.post("/ytt_ytapi_test", ctrl.test_YT_API_FOR_SINGLE_SEARCH); //post == not working
// router.get("/ytt_ytapi_test", ctrl.test_YT_API_FOR_SINGLE_SEARCH);



module.exports = router; // export router
