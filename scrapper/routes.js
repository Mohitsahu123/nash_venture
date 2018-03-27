var scrapperController         = require('./scrapperController');
/**
 * Creates an object of the exports module to be able to access controller function
 * @param appObj exports object connects the url to the controller function
 */

module.exports = function(appObj){
	appObj.post('/scrapper', scrapperController.fetchImages);
	appObj.get('/scrapper/listKeyword', scrapperController.listKeyword);
	appObj.get('/scrapper/getKeyword/:keyword', scrapperController.getKeyword);
}