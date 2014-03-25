var rootController = require('../controllers/root')
    , memberController = require('../controllers/member')
    , passport = require('passport')
    , api = require('../controllers/api');


module.exports = function(app) {

    app.get('/', rootController.home);

    app.get('/api/user/confirmation/:id', memberController.confirmation);
    app.post('/api/user/signup', memberController.signup);
    app.post('/api/user/signin', passport.authenticate('local', {}), memberController.signin);
    app.get('/api/user/logout', memberController.logout);

}