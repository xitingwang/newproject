__inline('./common/helper.js');
(function ($) {
    var Template = {};

    var Index = function () {
        var _this = this;
        seajs.use('common.helper', function(helper){
            window.Helper = helper;
            _this.init();
        })
    };

    $.extend(Index.prototype, {
        init: function () {
            var _this = this;

            _this.bindEvent();
        },
        bindEvent: function(){
            var _this = this;
        }
    });
    window.Index = Index;
})(jQuery);

var INDEX_GO;

$(function(){
    INDEX_GO = new Index();
});