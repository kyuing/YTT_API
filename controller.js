const URL = require("./models/url"),
  rp = require("request-promise"),
  axios = require("axios"),
  Handlebars = require("handlebars"),
  // querystring = require('querystring'),
  // url = require('url'),
  fs = require("fs");

const API_KEY = process.env.YT_DATA_API_KEY;


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
 
  // const id = JSON.parse(JSON.stringify(req.query.id));
  // console.log("const id: " + id)
  URL.findOne({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log("err at getDoc: " + err)
      // res.status(400).json(err);
      return res.redirect("/error/" + "No data found")
    }

    if (data) {

      var source = fs.readFileSync(__dirname + "/views/js/my.handlebars", "utf8");
      var template = Handlebars.compile(source);

      res.end(template(data).toString());
    } 
    // else {
    //   console.log("error msg at getDoc: No data found");
    //   return res.redirect("/error/" + "No data found")
    // }
  }).lean();

};

exports.postDoc = function (req, res) {
  
  const url = JSON.parse(JSON.stringify(req.body.url));
  console.log("console.log(url) at POST: " + url);

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
      res.redirect("/ytt/" + data._id);  //data.id returns undefined
      
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
        // console.log(parsed);

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
                      res.redirect("/ytt/" + new_data.id);  //to getDoc

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

//since getDocs function is not in the main use, alerting is not implemented here.
//if necessary to implement alert in relation to error or no data at getDocs, refer to the function getDoc 
exports.getDocs = function (req, res) {
  URL.find({}).lean().exec(function (err, data) {
      if (err) {
        res.status(400).json(err);
      }

      if (data) {

      //if data goes bigger, 
      //create another handlebars template that only takes _id, url, tt_url, title
      var source = fs.readFileSync(__dirname + "/views/js/my.handlebars", "utf8");
      var template = Handlebars.compile(source);
      res.end(template(data).toString());

      /********************************************************************************
       //not working
      var source = fs.createReadStream(__dirname + "/views/js/my.handlebars", "utf8");
      var template = Handlebars.compile(source);
      res.end(template(data).toString());
      ********************************************************************************/
     
      /*************************************************************************************
       //works but unecessary
      let readStream = fs.createReadStream(__dirname + "/views/js/my.handlebars", "utf8");
      readStream.on("close", () => {
        res.end();
      });

      var source = fs.readFileSync(__dirname + "/views/js/my.handlebars", "utf8");
      var template = Handlebars.compile(source);
      readStream.pipe(res.end(template(data).toString())); // Stream chunks to response
      **************************************************************************************/

      } else {
        console.log("No data found. Back to home");
        res.redirect("/");
      }
    });
};