define('common.helper', function(require) {
    var Helper = {
        /**
         * 字符串截断
         * @param 字符串
         * @param 长度
         * @returns 截断后的字符串
         */
        maxLen: function (str, len) {
            if (!str || str == null) return '';
            if (str.length <= len)
                return str;
            return str.substring(0, len) + '...';
        },
        getUrl: function(url){
            return url.toLowerCase().indexOf('http://')!=-1?url:'http://'+url;
        },
        //获取数据script格式
        getRemoteData: function (/*string*/ url, /*object*/ dataObj, /*function*/fn, /*boolean*/ isCache) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'script',
                data: dataObj || '',
                cache: isCache || false,
                success: function (data, textStatus, xhr) {
                    fn && fn(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    // lobby.console('getRecommendData:get data error')
                }
            });
        },
        //获取数据json格式
        getRemoteJsonData:function(/*string*/ url, /*object*/ dataObj, /*function*/fn, /*boolean*/ isCache){
            $.ajax({
                url:url,
                type:'get',
                dataType:'jsonp',
                data: dataObj || '',
                cache: isCache || false,
                success:function(data){
                    fn && fn(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    // lobby.console('getRemoteJsonData:get data error')
                }
            });
        },
        /**
         * 格式化日期
         * @param date 日期字符串或时间戳
         * @param format 格式化如yyyy-MM-dd
         * @returns 格式化后的日期
         */
        formatDate : function(date, format){
            var _this = new Date(date);
            var o = {
                "M+" : _this.getMonth()+1, //month
                "d+" : _this.getDate(), //day
                "h+" : _this.getHours(), //hour
                "m+" : _this.getMinutes(), //minute
                "s+" : _this.getSeconds(), //second
                "q+" : Math.floor((_this.getMonth()+3)/3), //quarter
                "S" : _this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (_this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        },
        Urls:{
        }
    };
    return Helper;
})
