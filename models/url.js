var mongoose = require("mongoose");
// require("mongoose-type-url");

var urlSchema = new mongoose.Schema(
  {
    url: { type: String },
    videoId: { type: String },
    title: { type: String },
    captionTracks: [
      // { name: {type: String} },
      {
        baseUrl: { type: String },  //fmt=json3
        name: {type: String},
        vssId: { type: String },
        languageCode: { type: String },
        kind: { type: String },
        isTranslatable: { type: Boolean },
        script: { type: String }
      }
    ]
  
  },
  { timestamps: true }
  // { strict: false }
);
module.exports = mongoose.model("URL", urlSchema);


// var backupSchema = new mongoose.Schema(
//   {
//     url: { type: String },
//     tt_url: { type: String },
//     // url: {
//     //   work: mongoose.SchemaTypes.Url,
//     //   profile: mongoose.SchemaTypes.Url,
//     // },
//     transcript: { type: String },
//   },
//   { timestamps: true }
//   // { strict: false }
// );
// module.exports = mongoose.model("BACKUP", backupSchema);
