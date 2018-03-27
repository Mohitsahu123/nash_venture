


var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/nash-test");


var scrapperSchema = new mongoose.Schema({
 keyword: String,
 images_path: []
});

exports.scrapper = mongoose.model("Scrapper", scrapperSchema);