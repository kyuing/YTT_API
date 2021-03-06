const URL = require("./models/url"),
  rp = require("request-promise"),
  axios = require("axios"),
  Handlebars = require("handlebars"),
  // querystring = require('querystring'),
  // url = require('url'),
  PDFGenerator = require('pdfkit'),
  puppeteer = require("puppeteer"),
  fs = require("fs");


const API_KEY = process.env.YT_DATA_API_KEY;
// const {cp} = require('child_process');
const {spawn} = require('child_process');
const {PythonShell} = require('python-shell');

exports.getHello = function (req, res) {

  console.log("i am at getHello");

  res.send(__dirname + "/views/index.html");

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
            "videoId": d.videoId,
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
            "videoId": d.videoId,
            "title": d.title,
            "url": d.url,
            "available languages in captionTracks": returnAl
          },null,4  
        ));
      }
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

      if(toReturn != null) {
        
        if(req.query.pdf === "true") {
          // /*return*/ res.redirect("/ytt/api/" + d._id + "/paraphrase?q=" + toReturn);

          //https://pdfkit.org/
          //https://levelup.gitconnected.com/generating-pdf-in-nodejs-201e8d9fa3d8

          let output = new PDFGenerator;
          output.pipe(fs.createWriteStream('script.pdf', { encoding: 'utf8' }));

          //writing to pdf is working, but some langs such as korean or japanese
          //are broken.
          // output.text(toReturn);
          output.text(toReturn.toString());
          // output.text(JSON.stringify(toReturn.toString(), null, 4));
          output.end();

          //https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-read-stream/
          var filename = __dirname + '/script.pdf';

          // This line opens the file as a readable stream
          var readStream = fs.createReadStream(filename);

          // This will wait until we know the readable stream is actually valid before piping
          readStream.on('open', function () {
            // This just pipes the read stream to the response object 
            // (which goes to the client)
            // The resulting page deos not download anything automatically
            // instead, it just gives a downloadable pdf web page to users.
            // res.writeHead(200, {
            //   'Content-Type': 'text/plain; charset=utf-8'
            // });
            readStream.pipe(
              res
              // res.end(toReturn)
            );

            //delete the pdf file as soon as streamed to browser
            var filename = 'script.pdf';
            fs.unlink(filename, (err) => {
              console.log('File deleted ...');
            });
          });

          // This catches any errors that happen while creating the readable stream (usually invalid names)
          readStream.on('error', function(err) {
            res.end(err);
          });

        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
          });
          res.end(toReturn)
          // res.end(
          //   JSON.stringify(toReturn.toString(), null, 4) + "\n\n" 
          //   // JSON.stringify(d.captionTracks[0]['script'], null, 4) + "\n\n" 
          // );
        }
        

        
      }else {
        // toReturn = "Please provide a valid query parameter\n" +
        // "e.g. http://localhost:5500/ytt/api/" + d._id + "/script?q=a valid vssId\n\n" +
        // "Check the vssId you want at the default info of the document:\n" +
        // "at http://localhost:5500/ytt/api/" + d._id + "\n" + 
        // "or at http://localhost:5500/ytt/api/" + d._id + "?full=true";
        // res.end(toReturn);

        toReturn = "Please provide a valid query parameter\n" +
        "e.g. " + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "/script?q=a valid vssId\n\n" +
        "Check the vssId you want at the default info of the document:\n" +
        "at " + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "\n" + 
        "or at "  + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "?full=true";
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

//since getDocs function is not in the main use, just return full JSON of the collection
exports.getDocs = function (req, res) {

  // let toReturn = "";

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


//not in use.
//in testing of:
//http://localhost:5500/ytt/api/61cc9aaeb06a67579ff4a7f8/script?q=.en
//http://localhost:5500/ytt/api/61cc9aaeb06a67579ff4a7f8/paraphrase?q=.en
exports.getParaphrase = function (req, res) {

  console.log("\nin the function getParaphrase\n")
  console.log("requested vssId: " + req.query.q)

  URL.findOne({ _id: req.params.id }, function (err, data) {
    
    let toReturn;

    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {
      
      const d = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < d.captionTracks.length; i++) {
        if(d.captionTracks[i]['vssId'] === req.query.q) {
          toReturn = d.captionTracks[i]['script'];
        }
      }      

      if(toReturn != null) {
        
        let dataToSend;

        //https://nodejs.org/api/child_process.html#child-process
        //https://medium.com/@gkverma1094/child-process-in-nodejs-b2cd17c76830
        // spawn new child process to call the python script
        const python = spawn('py', ['script.py', toReturn.toString()]);  //working, but chars are not decoded

        
        // collect data from script
        python.stdout.on('data', function (data) {
         
         dataToSend = data.toString();
         console.log('Pipe data from python script ...');

        });
        
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
          console.log(`child process close all stdio with code ${code}`);
                
          // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //gives such a raw html encoding
          res.end(dataToSend);  //gives res related encoding        

        });
      
        
      }else {
        // toReturn = "Please provide a valid query parameter\n" +
        // "e.g. http://localhost:5500/ytt/api/" + d._id + "/script?q=a valid vssId\n\n" +
        // "Check the vssId you want at the default info of the document:\n" +
        // "at http://localhost:5500/ytt/api/" + d._id + "\n" + 
        // "or at http://localhost:5500/ytt/api/" + d._id + "?full=true";
        // res.end(toReturn);

        toReturn = "Please provide a valid query parameter\n" +
        "e.g. " + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "/paraphrase?q=a valid vssId\n\n" +
        "Check the vssId you want at the default info of the document:\n" +
        "at " + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "\n" + 
        "or at "  + "https://ytt-api.herokuapp.com/ytt/api/" + d._id + "?full=true";
        res.end(toReturn);
      }
     
    } 
  }).lean();
};


exports.postDoc = function (req, res) {


  // console.log("req.body.full: " + req.body.full)

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
                            // if(texts[i][j].utf8) {
                            //   t += texts[i][j].utf8.replace(/'/g, "\'")
                            // }
                            
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

