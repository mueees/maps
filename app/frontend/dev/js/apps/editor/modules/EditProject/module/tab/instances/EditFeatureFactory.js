define([
    'backbone',
    'marionette',
    '../views/EditPointView'
],function(Backbone, Marionette, EditPointView){

    function EditFeatureFactory(){}

    EditFeatureFactory.make = function(feature){
        var result;

        /*switch (type) {
         case "data":
         result = new DataTab();
         break;
         case "style":
         result = new DataTab();
         break;
         case "project":
         result = new DataTab();
         break;
         }*/

        result = new EditPointView({
            model: feature
        });

        return result;
    }
    return EditFeatureFactory;
})