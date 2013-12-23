/**
 * 通用工具模块
 * 
 * @author Sun
 * @version 0.1 2013-12-21
 */
(function() {
    /**
     * 快速扫描(GET请求)某个页面获取DOM结构
     * 会阻止其他资源的加载(如link, script, img), 以避免直接追加到页面上造成巨大的流量浪费
     * 
     * @param  {String} url 
     * @return {jQuery} 页面的DOM结构
     */
    function fastScan(url) {
        var dfd = $.Deferred();
        $.get(url).done(function(html) {
            var dryHtml = html.replace(/(src|href)/gi, 'data-src')
                              .replace(/(<script)/gi, '<script type="defer/script"');
            dfd.resolve($('<div></div>').html(dryHtml));
        });
        return dfd.promise();
    }

    $.fastScan = fastScan;
})();