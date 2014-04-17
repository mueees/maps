define([
    'backbone',
    'config',
    'backbone.relational'
], function(Backbone, config){
    return Backbone.RelationalModel.extend({
        defaults: {
            title: "Default title",
            description: "Default description",

            /*
             * point
             * polygon,
            * */
            type: "",

            /*frontend*/
            isEdit: false
        },

        editEnable: function(){
            var group,
                project;

            group = this.get('group');
            if( !group ){
                this.set('isEdit', true);
                return this;
            }

            project = group.get('project');
            if(!project){
                this.set('isEdit', true);
                return this;
            }

            project.setEditFeature(this);
        }
    });

})