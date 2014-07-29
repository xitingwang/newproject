fis.config.set('roadmap.domain', 'http://172.17.0.66/lobby4');
fis.config.set('settings.optimizer.uglify-js.mangle.except', [ 'require' ]);
fis.config.set('modules.postpackager', '');
fis.config.set('roadmap.path', [
    {
        reg: /^\/js\/(.*)\.(js)$/i,
        //是组件化的，会被jswrapper包装
        isMod: false
    },
    {
        //前端模板
        reg: '**.tmpl',
        //当做类html文件处理，可以识别<img src="xxx"/>等资源定位标识
        isJsLike:true,
        release: false
    },
    {
        reg: 'lib/**.js',
        release: false
    },
    {
        reg: 'map.json',
        release: false
    }
]
);