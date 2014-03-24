module.exports = function( i18n ){
    return {
        __: function () {
            return i18n.__.apply(this, arguments);
        },
        __n: function () {
            return i18n.__n.apply(this, arguments);
        }
    }
}