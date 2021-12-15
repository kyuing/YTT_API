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

//this can be used for POST on web using a form
//if using this, you can kind of provide GET a doc in full
router.post("/ytt", ctrl.postDoc); //post a doc  <-- need another function and its legacy code 




//post a doc using GET req.  
//query params ?url='youtube video url goes here'
//if wanted full res of a doc, ?url='youtube video url goes here'&full=true  
router.get("/ytt/api", ctrl.postDoc);


router.get("/ytt/api/all", ctrl.getDocs); //get all docs
router.get("/ytt/api/:id", ctrl.getDoc); //get a doc in full or in partial
router.get("/ytt/api/:id/scripts", ctrl.getScripts);  //get scripts by all languages available in a doc
router.get("/ytt/api/:id/script", ctrl.getScript);  //get a script by a language in a doc. just add ?q=vssId goes here

//https://stackoverflow.com/questions/49728793/nodejs-express-router-resolves-to-wrong-path/49729687
router.get("/ytt/api/:id/paraphrase", ctrl.getParaphrase);  //?q= vssId


router.get("/ytt/api/:id/numoflangs", ctrl.getAvailableLang);




module.exports = router; // export router
