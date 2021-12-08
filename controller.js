const URL = require("./models/url"),
  rp = require("request-promise"),
  axios = require("axios"),
  Handlebars = require("handlebars"),
  // querystring = require('querystring'),
  // url = require('url'),
  fs = require("fs");


const API_KEY = process.env.YT_DATA_API_KEY;
const {spawn} = require('child_process');
const {PythonShell} = require('python-shell');

exports.getHello = function (req, res) {

  console.log("i am at getHello");

  //sample transcript at index.html
  //BTS (방탄소년단) 'Permission to Dance' Official MV
  const id = "6100aa0bb8401f4e886fe630";  
  console.log(id);
  URL.findOne({ _id: id }, function (err, data) {

    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {

      // console.log(data);
      let readStream = fs.createReadStream(__dirname + '/views/index.html');
      readStream.on('close', () => {
        res.end()
      })

      var source = fs.readFileSync(__dirname + "/views/index.handlebars", "utf8");
      var template = Handlebars.compile(source);
      // res.end(template(data).toString());

      readStream.pipe(res.end(template(data).toString()))
    } 
    // else {
    //   console.log("error msg at getDoc: No data found");
    //   return res.redirect("/error/" + "No data found")
    // }
  }).lean();

};

exports.getSearch = function (req, res) {

  console.log(req.query.q)
  // console.log(req.params.id)
  // const API_KEY = process.env.YT_DATA_API_KEY;
  const Q_URL = encodeURI("https://www.googleapis.com/youtube/v3/search?key=" + API_KEY 
  + "&type=video&part=snippet&maxResults=" + 8 
  + "&q=" + req.query.q);
  // console.log(Q_URL)

  let videos;
  (async () => {
    try {
      
      const { data } = await axios.get(Q_URL);  // const { data } = await axios.got.get(Q_URL);
      // console.log(data)

      videos = data.items;
      // videos = JSON.parse(JSON.stringify(data.items));
      // console.log(videos)

      var source = fs.readFileSync(__dirname + "/views/js/search.handlebars", "utf8");
      var template = Handlebars.compile(source);
      res.end(template(videos).toString());

    } catch (error) {
      console.log(error);
      // res.write(error)
    }
  })();


};

exports.getError = function (req, res) {
  console.log("error msg at getError: " + req.params.id)

  if(req.params.id === "No captions found") {
     return res.sendFile(__dirname + "/views/js/No_captions_found.html")
  }
  if(req.params.id === "No data found") {
    return res.sendFile(__dirname + "/views/js/No_data_found.html")
 }
//  if(req.params.id === "res.status(400).json(err)") {
//   return res.sendFile(__dirname + "/views/js/No_data_found.html")
// }

}

exports.getDoc = function (req, res) {
 
  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {
      
      const d = JSON.parse(JSON.stringify(data));
      const al = data.captionTracks.map(lang =>lang.vssId); 
      returnAl =  al.map((myArr, index) => {
        return `${index}: ${myArr}`;
      }) 


      res.writeHead(200, {
        // 'Content-Type': 'text/plain; charset=utf-8'
        'Content-Type': 'application/json'
      });

      //assuming that user already knows _id of a doc, 
      //a full record of a doc is also available to be returned
      if(req.query.full === "true") {
        //a full res of a doc
        console.log(JSON.stringify(d, null, 3));
        res.end(JSON.stringify(d, null, 3));
      }
      //default res
      //return _id, title, url, and info of available langs only
      else { 
        console.log(JSON.stringify(
          {
            "_id": d._id,
            "title": d.title,
            "url": d.url,
            "available languages in captionTracks": returnAl
          },null,4  
        ));
         //a specific set of res in a doc
        //it works but it's better to go for vssId
        res.end(JSON.stringify(
          {
            "_id": d._id,
            "title": d.title,
            "url": d.url,
            "available languages in captionTracks": returnAl
          },null,4  
        ));
      }

      
      /*************************************************************
      //a specific set of res in a doc
      //it works but it's better to go for vssId
      res.end(JSON.stringify(
        {
          "_id": d._id,
          "title": d.title,
          "url": d.url,
          "available languages in captionTracks": returnAl
        },null,4  
      ));
      ***************************************************************/

      /***********************************************************
      console.log(JSON.stringify(
        {
          "_id": d._id,
          "title": d.title,
          "url": d.url,
          "available languages in captionTracks": returnAl
        },null,4  
      ));

      //a specific set of res in a doc
      //it works but it's better to go for vssId
      res.end(JSON.stringify(
        {
          "_id": d._id,
          "title": d.title,
          "url": d.url,
          "available languages in captionTracks": returnAl
        },null,4  
      ));
      **********************************************************/
      
      /*******************************************
      //works but without a line break
      res.json(
        {
          "_id": d._id,
          "title": d.title
        }
      );
      *******************************************/
     
      /************************************************************************************
       * some tests..
      //   //core info of a doc
      //   res.json(d._id) + "\n" +  // /ytt/api);
      //   // d.url + "\n" +
      //   // d.title + "\n" +
      //   // d.videoId + "\n" +
      //   // d.captionTracks + "\n" + //[object Object]
      //   // d.captionTracks.length   //this need to come with lang code or name
      // );
      **************************************************************************************/
    } 
  }).lean();

};

exports.getScript = function (req, res) {

  //https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
  // const query = req.query.q;// query = {field:"a"}
  console.log("requested vssId: " + req.query.q)

  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {
      
      const d = JSON.parse(JSON.stringify(data));
      let toReturn;
      for (var i = 0; i < d.captionTracks.length; i++) {
        if(d.captionTracks[i]['vssId'] === req.query.q) {
          toReturn = d.captionTracks[i]['script'];
        }
        // else {
        //  toReturn = null;
        // }
      }      

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
      });

      if(toReturn != null) {
        res.end(
          JSON.stringify(toReturn.toString(), null, 4) + "\n\n" 
          // JSON.stringify(d.captionTracks[0]['script'], null, 4) + "\n\n" 
        );

        
      }else {
        toReturn = "Please provide a valid query parameter\n" +
        "e.g. http://localhost:5500/ytt/api/" + d._id + "/script?q=a valid vssId\n\n" +
        "Check the vssId you want at the default info of the document:\n" +
        "at http://localhost:5500/ytt/api/" + d._id + "\n" + 
        "or at http://localhost:5500/ytt/api/" + d._id + "?full=true";
        res.end(toReturn);
      }
     
    } 
  }).lean();

};

exports.getScripts = function (req, res) {
  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {
      
      const d = JSON.parse(JSON.stringify(data));

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
      });

      res.end(
        JSON.stringify(d.captionTracks, null, 4) + "\n\n" 
      );
    } 
  }).lean();

};

exports.getAvailableLang = function (req, res) {
  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }
    if (data) { 
      // const d = JSON.parse(JSON.stringify(data));
      const al = data.captionTracks.map(lang =>lang.name); 
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
      toReturn =  al.map((myArr, index) => {
        return `${index}: ${myArr}`;
        // return `${index}: ${myArr} \n`;
      }) 

      res.end(
        // al + "\n" + 
        // JSON.stringify(al) + "\n\n" 
        // JSON.stringify(al.length + al) + "\n\n" 
        // JSON.stringify(`${index} + ": " + al`) + "\n\n" 
        // toReturn + "\n\n" +
        JSON.stringify(toReturn) + "\n\n" 
      );
    } 
  }).lean();

};

//since getDocs function is not in the main use, alerting is not implemented here.
//if necessary to implement alert in relation to error or no data at getDocs, refer to the function getDoc 
exports.getDocs = function (req, res) {
  URL.find({}).lean().exec(function (err, data) {
      if (err) {
        res.status(400).json(err);
      }

      if (data) {
        // const d = data.map(lang =>lang.languageCode); 
      
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8'
        });
        res.end(JSON.stringify(data, null, 4) + "\n\n");
        
      
      } else {
        console.log("No data found. Back to home");
        res.redirect("/");
      }
    });
};

exports.getParaphrase = function (req, res) {

  console.log("\nin the function getPegasus\n")

  console.log("requested vssId: " + req.query.q)

  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {
      
      const d = JSON.parse(JSON.stringify(data));
      let toReturn;
      for (var i = 0; i < d.captionTracks.length; i++) {
        if(d.captionTracks[i]['vssId'] === req.query.q) {
          toReturn = d.captionTracks[i]['script'];
        }
        // else {
        //  toReturn = null;
        // }
      }      

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
      });

      if(toReturn != null) {
        // res.end(
        //   JSON.stringify(toReturn.toString(), null, 4) + "\n\n" 
        //   // JSON.stringify(d.captionTracks[0]['script'], null, 4) + "\n\n" 
        // );

        var dataToSend;

        // spawn new child process to call the python script
        // note: on deploying web, 1st param can be one of python, py, or python3
        // cuz python command on localhost is py
        // const python = spawn('py', [__dirname + '/script.py']);

        // const python = spawn('python', ['./script.py']);
        // const python = spawn('py',[__dirname + "/script.py", toReturn] );
        // const python = spawn('py',[__dirname + "/script.py", toReturn.toString()] );
        const python = spawn('py',[__dirname + "/script.py", 
        JSON.stringify(toReturn.toString(), null, 4)] );
        
        // collect data from script
        python.stdout.on('data', function (data) {
          console.log('Pipe data from python script ...');
          dataToSend = data.toString();
        });
          // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code}`);
          
          // send data to browser
          console.log(dataToSend)
          res.end(dataToSend);
          // res.send(dataToSend)
        });

        
      }else {
        toReturn = "Please provide a valid query parameter\n" +
        "e.g. http://localhost:5500/ytt/api/" + d._id + "/script?q=a valid vssId\n\n" +
        "Check the vssId you want at the default info of the document:\n" +
        "at http://localhost:5500/ytt/api/" + d._id + "\n" + 
        "or at http://localhost:5500/ytt/api/" + d._id + "?full=true";
        res.end(toReturn);
      }
     
    } 
  }).lean();

   //https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f
  //https://javascript.plainenglish.io/how-to-run-python-script-using-node-js-6b351169e916
  // var dataToSend;

  // // spawn new child process to call the python script
  // // note: on deploying web, 1st param can be one of python, py, or python3
  // // cuz python command on localhost is py
  // // const python = spawn('py', [__dirname + '/script.py']);

  // // const python = spawn('python', ['./script.py']);
  // const python = spawn('py',[__dirname + "/script.py", req.query.q] );
  
  // // collect data from script
  // python.stdout.on('data', function (data) {
  //   console.log('Pipe data from python script ...');
  //   dataToSend = data.toString();
  // });
  //   // in close event we are sure that stream from child process is closed
  // python.on('close', (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
    
  //   // send data to browser
  //   console.log(dataToSend)
  //   res.send(dataToSend)
  // });

  // //https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
  // // Use child_process.spawn method from 
  //   // child_process module and assign it
  //   // to variable spawn
  //   var spawn = require("child_process").spawn;
      
  //   // Parameters passed in spawn -
  //   // 1. type_of_script
  //   // 2. list containing Path of the script
  //   //    and arguments for the script 
      
  //   // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
  //   // so, first name = Mike and last name = Will
  //   var process = spawn('python',["./script.py",
  //                           req.query.f,
  //                           req.query.l] );
  
  //   // Takes stdout data from script which executed
  //   // with arguments and send this data to res object
  //   process.stdout.on('data', function(data) {
  //       res.send(data.toString());
  //   } )



  // //https://www.npmjs.com/package/python-shell

  // let options = {
  //   mode: 'text',
  //   pythonPath: '',
  //   pythonOptions: ['-u'], // get print results in real-time
  //   scriptPath: 'path',
  //   // args: ['arg1', 'arg2']
  // };

  // PythonShell.run('script.py', options, function (err) {
  //   if (err) throw err;
  //   console.log('finished');
  // });
};



exports.postDoc = function (req, res) {

  //prototype
  // const url = JSON.parse(JSON.stringify(req.body.url));
  // console.log("console.log(url) at POST: " + url);

  //only one query 
  // console.log("\nconsole.log(req.query.q) at POST: " + req.query.q);
  // const url = JSON.parse(JSON.stringify(req.query.q));
  // console.log("console.log(url) at POST: " + url);

  //1st q = youtube video url
  //2nd q = -full or undefined
  // const url = JSON.parse(JSON.stringify(req.query.q));
  // console.log("console.log(url) at POST: " + url);

  //https://stackoverflow.com/questions/39530988/getting-request-query-parameters-count
  //https://www.codegrepper.com/code-examples/javascript/req+query+params+express   //https://(www)?(\.)?(m\.)?youtu.*
  // console.log(Object.keys(req.query.q).length);  //works but it's just better to use each of specific q names
  //however, you need url validation using regex e.g. https://www.w3schools.com/jsref/jsref_match.asp

  
  let url;
  let isFullDocRes;
  
  if(req.query.full === "true") {
    console.log("\nconsole.log(req.query.url, req.query.full) at POST: " + req.query.url + ", " + req.query.full + "\n")
    url = JSON.parse(JSON.stringify(req.query.url));
    isFullDocRes = true;
    // console.log("console.log(url) at POST: " + url);
  }else {
    console.log("\nconsole.log(req.query.url) at POST: " + req.query.url + "\n");
    url = JSON.parse(JSON.stringify(req.query.url));
    isFullDocRes = false;
  }
  

  URL.findOne({ url: url }, function (err, data) {
    if (err) {
      res.status(400).json(err);
    }

    if (data) { 
      console.log(
        "\nThe requested url already exists in db:" +
          "\n" +
          "_id: " +
          data._id +
          "\n" +
          "url:" +
          data.url
      );
      // console.log(JSON.parse(JSON.stringify(data.body.id)));
      // res.redirect("/ytt/" + data._id);  //prev
      if(!isFullDocRes) {
        res.redirect("/ytt/api/" + data._id);
      }else {
        res.redirect("/ytt/api/" + data._id + "?full=true");
      }
        
    } 
    else {  
  
      rp(url).then(function (html) {

        let regexp, match, matchOne, tt_url, filter;

        //https://stackoverflow.com/questions/41984107/using-regex-to-get-title/41984573
        //https://regex101.com/r/piwm5H/1
        let title, end;
        regexp = new RegExp(/<title.*?>(.*)<\/title>/);
        // regexp = new RegExp(/.*?<title>(.*?)</title>.*/);  //error in formatting

        match = regexp.exec(html); //row html entity
        // match = regexp.exec(html.toString());  //not shown to string
        if (!match) {
          console.log("msg at title regexp: No title found");
          title = "";
        }
        title = match[1];
        if(title.endsWith(" - YouTube")) {
          end = title.length - 10;  //remove " - youtube"
          if(end != -1) {
            title = title.substring(0, end);  
          }
        }
        console.log("\nconsole.log(title): " + title);

        let captionTrack = [];
        let texts = [], t = "";

        //let isLegacyMode = false;

        //you can download the scraped html to page in detail.
        regexp = new RegExp(/captionTracks.*?(youtube.com\/api\/timedtext.*?)]/);
        match = regexp.exec(html);
        if (!match) {

          regexp = new RegExp(/playerCaptionsTracklistRenderer.*?(youtube.com\/api\/timedtext.*?)]/);
          match = regexp.exec(html);

          //here, you can put the legacy regexp code that extracts the first matching timedtext url only
          //so that you can give users at least one transcript in case error is.
          //implement it after most of things are done or when having spare time.
          //but not really necessary for now.

          if (!match) {
            console.log("msg at postDoc: No captions found");
            return res.redirect("/error/" + "No captions found")
          }
        }
        // console.log(match[0]);
        
        let parsed = JSON.parse(match[0].substring(match[0].indexOf("["), match[0].length));
        // let parsed = JSON.parse(match[0].substring(15, match[0].length));
        console.log(parsed);

        let obj = {parsed};
        
        //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url?answertab=votes#tab-top
        let videoId, ampersandPosition;
        videoId = obj.parsed[0]['baseUrl'].split('v=')[1];
        ampersandPosition = videoId.indexOf('&');
        if(ampersandPosition != -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
        console.log("\nconsole.log(videoid); " + videoId + "\n")

        for(var x=0; x<obj.parsed.length; x++) {
        
          let baseUrlFmtJson3 = obj.parsed[x]['baseUrl'].replace(/,/g, '%2C') + "&fmt=json3";
          let name = obj.parsed[x]['name'].simpleText;
          let vssId = obj.parsed[x]['vssId'];
          let languageCode = obj.parsed[x]['languageCode'];
          let kind = obj.parsed[x]['kind'];
          let isTranslatable = obj.parsed[x]['isTranslatable'];
          // let outerCounter = 0;

          (async () => {
              try {
                
                // console.log(baseUrlFmtJson3);
                const {data} = await axios.get(baseUrlFmtJson3);  
                texts = data.events.map((event) => event.segs);

                  for (var i = 0; i < texts.length; i++) {
                    if (texts[i] != null || texts[i] != undefined) {
                      for (var j = 0; j < texts[i].length; j++) {
                        if (texts[i][j] != null || texts[i][j] != undefined) {
                          if (texts[i][j].utf8 != null || texts[i][j].utf8 != undefined) {
                            // t += texts[i][j].utf8;
                            t += texts[i][j].utf8 + " ";
                          }
                        }
                      }
                    }
                  }
                 
                  //asr(Automatic speech recognition) is null.
                  if(kind === null || kind === undefined) {
                    captionTrack.push(
                      // {name: name},
                      {
                        baseUrl: baseUrlFmtJson3,
                        name: name,
                        vssId: vssId,
                        languageCode: languageCode,
                        isTranslatable: isTranslatable,
                        script: t
                      }
                    );
                  }

                  // asr(Automatic speech recognition) is NOT null.
                  if(kind != null || kind != undefined) {
                    captionTrack.push(
                      // {name: name},
                      {
                        baseUrl: baseUrlFmtJson3,
                        name: name,
                        vssId: vssId,
                        languageCode: languageCode,
                        kind: kind,
                        isTranslatable: isTranslatable,
                        script: t
                      }
                    );
                  }
                  t = "";

                  // console.log("\n___________________________________________________\n");  
                  // console.log("captionTrack.length: " + captionTrack.length);
                  // console.log("obj.parsed.length: " + obj.parsed.length);
                  // console.log(captionTrack);

                  
                  //we collected all the language available
                  if(captionTrack.length === obj.parsed.length) {
                    // let ct = JSON.stringify(captionTrack);
                    // let ct = JSON.parse(JSON.stringify(captionTrack));
                    let new_data = new URL(
                      { 
                        url: url, 
                        videoId: videoId, 
                        // tt_url: tt_url, 
                        title: title, 
                        captionTracks: captionTrack
                        // captionTracks: ct
                        // captionTracks: JSON.parse(JSON.stringify(captionTrack))
                      }
                    );
                    console.log("\n___________________________________________________\n");  
                    console.log(
                      "\nThe following data is ready to POST:" + "\n" +
                      "url: " + /*new_data.*/url + "\n" +
                      "videoId: " + videoId + "\n" +
                      // "timedtext url: " + new_data.tt_url + "\n" +
                      "title: " + title + "\n" +
                      // "transcript: " + new_data.t  ////undefiend but saved to db
                      "captionTracks: " + captionTrack + "\n" 
                    ); 

                    new_data.save(function (err, nb) {
                      if (err) {
                        res.status(400).json(err);
                      }
                      console.log("POST to URL collection successfully");
                      if(!isFullDocRes) {
                        res.redirect("/ytt/api/" + new_data.id);
                      }else {
                        res.redirect("/ytt/api/" + new_data.id + "?full=true");
                      }
                      
                      // res.redirect("/ytt/api/" + new_data.id);  //to getDoc

                      // res.redirect("/ytt/" + new_data.id);  //to getDoc
                      // res.redirect("/ytt/" + new_data.id + "#transcription");  //works but ignores css
                      // res.redirect("/ytt_all"); //to getDocs

                    });

                  }


              } catch (error) {
                console.log(error);
              }
            })();

        }//end of for loop
      
    })
    .catch(function (err) {
      console.log(err);
    });

    }

  }).lean();

};

