define([
    'backbone',
    'marionette',
    '../views/TabDataView'
],function(Backbone, Marionette, TabDataView){

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
                //result = new DataTab();
                break;
        }

        return result;
    }
    return TabFactory;
})