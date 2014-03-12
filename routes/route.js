var rootController = require('../controllers/root')
    , api = require('../controllers/api');


module.exports = function(app) {
    app.get('/', rootController.home);
}