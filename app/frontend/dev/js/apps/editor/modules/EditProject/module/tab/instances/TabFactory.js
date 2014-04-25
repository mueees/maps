define([
    'backbone',
    'marionette',
    '../views/TabDataView',
    '../views/TabProjectView'
],function(Backbone, Marionette, TabDataView, TabProjectView){

    function TabFactory(){}

    TabFactory.make = function(type , projectModel){
        var result;

        switch (type) {
            case "data":
                result = new TabDataView({
                    model: projectModel
                });
                break;
            case "style":
                //result = new DataTab();
                break;
            case "project":
                result = new TabProjectView({
                    model: projectModel
                });
                break;
        }

        return result;
    }
    return TabFactory;
})