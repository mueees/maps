var rootController = require('../controllers/root')
    , memberController = require('../controllers/member')
    , projectController = require('../controllers/project')
    , passport = require('passport')
    , api = require('../controllers/api');

module.exports = function(app) {

    //static
    app.get('/', rootController.home);
    app.get('/editor(/:idProject)?(/analyze/:idFeature)?', rootController.editor);

    //member
    app.get('/api/user/confirmation/:id', memberController.confirmation);
    app.post('/api/user/signup', memberController.signup);
    app.post('/api/user/signin', passport.authenticate('local', {}), memberController.signin);
    app.get('/api/user/logout', memberController.logout);

    //project
    app.post('/api/project/add', projectController.add);
    app.post('/api/project/remove/:id', passport.authenticate('local', {}), projectController.remove);
    app.get('/api/projects', passport.authenticate('local', {}), projectController.getProjects);
    app.get('/api/project/:id', passport.authenticate('local', {}), projectController.getProject);
    app.post('/api/project/edit/:id', passport.authenticate('local', {}), projectController.editProject);


}