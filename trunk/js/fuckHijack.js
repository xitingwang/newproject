(function () {
    var UUID = {
        "generate32": function () {
            var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
            var dc = new Date();
            var t = dc.getTime() - dg.getTime();
            var h = '';
            var _uuid = UUID;
            var tl = _uuid.generateBits(t, 0, 31);
            var tm = _uuid.generateBits(t, 32, 47);
            var thv = _uuid.generateBits(t, 48, 59) + '1'; // version 1, security version is 2
            var csar = _uuid.generateBits(_uuid.rand(4095), 0, 7);
            var csl = _uuid.generateBits(_uuid.rand(4095), 0, 7);

            var n = _uuid.generateBits(_uuid.rand(8191), 0, 7) +
                _uuid.generateBits(_uuid.rand(8191), 8, 15) +
                _uuid.generateBits(_uuid.rand(8191), 0, 7) +
                _uuid.generateBits(_uuid.rand(8191), 8, 15) +
                _uuid.generateBits(_uuid.rand(8191), 0, 15); // this last number is two octets long
            return tl + h + tm + h + thv + h + csar + csl + h + n;
        },
        "generateBits": function (val, start, end) {
            var base16 = this.returnBase(val, 16);
            var quadArray = [];
            var quadString = '';
            var i = 0;
            for (i = 0; i < base16.length; i++) {
                quadArray.push(base16.substring(i, i + 1));
            }
            for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
                if (!quadArray[i] || quadArray[i] == '') quadString += '0';
                else quadString += quadArray[i];
            }
            return quadString;
        },

        "returnBase": function (number, base) {
            var convert = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            if (number < base) var output = convert[number];
            else {
                var MSD = '' + Math.floor(number / base);
                var LSD = number - MSD * base;
                if (MSD >= base) var output = this.returnBase(MSD, base) + convert[LSD];
                else var output = convert[MSD] + convert[LSD];
            }
            return output;
        },

        "rand": function (max) {
            return Math.floor(Math.random() * max);
        }
    };

    function ajaxRequest(url, data) {
        if (url) {
            var dataTxt = [];
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    dataTxt.push(i + '=' + data[i])
                }
            }
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET", url + '?' + encodeURIComponent(dataTxt.join('&')), true);
            xmlhttp.send();
        }
    }
    var trimStr=function (text) {
        return (text || "").replace(/^\s+|\s+$/g, "");
    }
    /**处理cookie
     * 浏览器不能存储超过30个cookie
     * 另外在同一域下不能存储超过20个cookie
     * 最后cookie的名/值不能大于4K
     * @example
     * set dealCookie('name','test',{});
     * get dealCookie('name')
     * */
    var dealCookie=function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie) {
                var cookies = document.cookie.split(';');
                for (var i = 0, len = cookies.length; i < len; i++) {
                    var cookie = trimStr(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        try {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        }
                        catch (e) {
                            dealCookie(name, null);
                            cookieValue = null;
                        }
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }

    var uid = UUID.generate32();
    var _doc = document;
    var _write = _doc.write;
    var _white_list = {
        'duowan.com': 1,
        'yy.com': 1,
        'google.com': 1,
        'google-analytics.com': 1,
        'googleadservices.com': 1,
        'baidu.com': 1
    };
    /**
     *劫持上报j
     * @param {string} hijackUrl 被劫持的url
     * @param {string} inserturl 劫持插入的url
     * @param {string} locationurl 当前域名
     * @param {string} content 辅助分析文本：插入的内容
     **/
    var _hijack_stat = function (hijackUrl, inserturl, locationurl, content) {
        locationurl=locationurl||'',inserturl=inserturl||'',locationurl=locationurl||'',content=content||'';
        locationurl = locationurl.replace(/http:\/\/|https:\/\//i, '').slice(0, locationurl.lastIndexOf('/')).replace(/\//g,"_");
        hijackUrl = hijackUrl.slice(hijackUrl.lastIndexOf('/') + 1, hijackUrl.lastIndexOf('?'));
        content = encodeURIComponent(content);
        var mid=dealCookie('mid');
        if(!mid){
            mid= UUID.generate32();
            dealCookie('mid',mid,{expires:2*365,path:'/'})
        }
        args = {
            act: '/event',
            product: 'fuckhijack',
            session_id: uid,
            eid: 'startup/' + locationurl + '/' + hijackUrl,
            eid_desc: '防劫持/劫持的域名路径/被劫持域名资源',
            dty:'pas',
            content: content,
            mid:mid
        };
        ajaxRequest('http://stat.game.yy.com/data.do', args);
    }
    var _RE_SCRIPTS = /<script.*?src\=["']?([^"'\s>]+)/ig;
    var _RE_DOMAIN = /(.+?)\.([^\/]+).+/;
    _doc.write = function (str) {
        try {
            var s, safes = [], unkowns = [];
            while (s = _RE_SCRIPTS.exec(str)) {
                if (_white_list[(_RE_DOMAIN.exec(s) || [])[2]]) {
                    safes.push(s[1]);
                } else {
                    unkowns.push(s[1]);
                }
            }
            if (unkowns.length > 0) {
                var content = '';
                content += 'hijackUrl:' + unkowns[0];
                content += ';behijackUrl:' + safes[0];
                content += ';txt:' + str
                _hijack_stat(safes[0]||'', unkowns[0], location.href, content);
            }
            try {
                var str1;
                for (var i = 0, l = safes.length; i < l; i++) {
                    str1 = document.createElement('script');
                    if(safes&&safes[i]){
                        str1.src=safes[i];
                        document.head.appendChild(str1)
                    }
                }
//                if (str1.length > 0) {
//                    _write.call(this, str1.join(''));
//                }
            } catch (ex) {
                _write(str);
            }
        } catch (ex) {
            console.log(ex)
            _hijack_stat(ex.name + ":" + ex.message, location.href);
        }
    };
})();