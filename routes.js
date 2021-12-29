var express = require("express"),
  path = require("path"),
  router = express.Router();

// router.use(express.static(path.resolve(__dirname, "views")));
router.use(express.static(path.join(__dirname, "views")));

var ctrl = require("./controller");
router.get("/hello", ctrl.getHello);  //home
router.get("/error/:id", ctrl.getError); //get an error

//post a doc using GET req.  
//query params ?url='youtube video url goes here'
//if wanted full res of a doc, ?url='youtube video url goes here'&full=true  
router.get("/ytt/api", ctrl.postDoc);
router.get("/ytt/api/all", ctrl.getDocs); //get all docs
router.get("/ytt/api/:id", ctrl.getDoc); //get a doc in full or in partial
router.get("/ytt/api/:id/scripts", ctrl.getScripts);  //get scripts by all languages available in a doc
router.get("/ytt/api/:id/script", ctrl.getScript);  //get a script by a language in a doc. just add ?q=vssId goes here


// router.get("/ytt/api/:id/paraphrase", ctrl.getParaphrase);  //?q= vssId  //paused 


router.get("/ytt/api/:id/numoflangs", ctrl.getAvailableLang);




module.exports = router; // export router
