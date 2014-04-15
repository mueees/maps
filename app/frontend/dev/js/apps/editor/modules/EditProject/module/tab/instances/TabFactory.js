define([
],function(L, Point){
    function TabFactory(){}

    TabFactory.make = function(type){
        var result;
        switch (type) {
            case "data":
                result = new DataTab();
                break;
            case "style":
                result = new DataTab();
                break;
            case "project":
                result = new DataTab();
                break;
        }
        return result;
    }
    return TabFactory;
})