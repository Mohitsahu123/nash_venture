


var _       = require('underscore');
var Scraper = require ('images-scraper')
var google = new Scraper.Google();
//var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
 var Jimp = require("jimp");
 var db_model = require("./db_model");
var async               = require('async');

 var a = console.log;
 var b = JSON.stringify;
exports.fetchImages = function(req, res) {
	let keyword = req.body.keyword || '';
	var imagePathArr = [];
	google.list({
	    keyword: keyword,
	    num: 15,
	    detail: false,
	    type: "image/jpeg",
	    nightmare: {
	        show: false
	    }
	})
	.then(function (result) {
	    let imagesArr = result.filter((item)=> { if(item.type != 'image/svg') return item.url});
	    var count = 0;
	    async.eachSeries(imagesArr, (image, cb)=> {
	    	a("\r\n\n\ image ", image.url)
	            Jimp.read( image.url, function (err, cImage) {
	                if (err){
	                	cb(err) ;
	                }else if(cImage){

	                 cImage.quality(60)                 // set JPEG quality 
	                     .greyscale() 					// set  black and white filter  
	                     .write(path.join(__dirname, './images/'+ keyword+count+".jpeg")); 
	                imagePathArr.push( './images/'+ keyword+count+".jpeg");
	                count++;
	                }
	                cb();
	        	});
	    }, function(error) {
            if (error) {
               throw err;
            } else {
                var myData = new db_model.scrapper({
                		keyword:keyword,
                		images_path: imagePathArr
                });
				 myData.save()
				 .then(item => {
				 	
				 return res.status(200).send("item saved to database");
				 })
				 .catch(err => {
				 	a("\r\n\n\n\ err ", err)
				 return res.status(400).send("unable to save to database");
				 });
            }
        })

	}).catch(function(err) {
	    console.log('err', err);
	    return res.send(400).json(err);
	});


}


exports.listKeyword = function(req, res) {

	// var myData = new db_model.scrapper({});
	 db_model.scrapper.find({})
	  .then(item => {
	 	a("\r\n\n\n\ item ", item)
	 return res.status(200).send(item);
	 })
	 .catch(err => {
	 	a("\r\n\n\n\ err ", err)
	 return res.status(400).send("unable to list the keywords");
	 });

}


exports.getKeyword = function(req, res) {
	var keyword = req.params.keyword || '';
	 db_model.scrapper.findOne({keyword:keyword})
	  .then(item => {
	 	a("\r\n\n\n\ item ", item)
	 return res.status(200).send(item);
	 })
	 .catch(err => {
	 	a("\r\n\n\n\ err ", err)
	 return res.status(400).send("unable to fetch to images for the keyword");
	 });

}


