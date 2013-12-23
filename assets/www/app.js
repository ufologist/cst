/**
 * app框架页面逻辑
 * 主要实现滑动效果
 * 
 * @author Sun
 * @version 0.1 2013-12-21
 */
(function() {
    var $slideWrapper = $('.slide-wrapper');
    var $innerWrapper = $('.inner-wrapper');
    var $forumList = $('.forum-list');
    var $topicList = $('.topic-list');
    var $topic = $('.topic');

    // 记录回退键按了几次, 连续(计算间隔时间)2次才确认退出
    var quitFlag = 0;

    function offsetSlide($el) {
        var left = 0;
        $el.each(function() {
            // TODO 得出的值不是百分比, 因此不能动态布局
            left += $(this).width();
        });
        $innerWrapper.css('left', -left);
    }

    function exitApp() {
        if (navigator.app) {
            quitFlag += 1;

            if (quitFlag == 1) { // 按一次回退只提示
                cordova.exec(null, null, 'ToastPlugin', 'alert', [{
                    "text": "(╥﹏╥) 这是要退出的节奏吗?",
                    "duration": "short"
                }]);
            } else { // 按两次以上退出app
                cordova.exec(null, null, 'ToastPlugin', 'alert', [{
                    "text": "╮(╯_╰)╭ 逛完就关太伤App自尊了",
                    "duration": "long"
                }]);
                navigator.app.exitApp();
            }

            // 延时重置记录
            setTimeout(function() {
                quitFlag = 0;
            }, 3000);
        }
    }
    
    // remove click delays on browsers with touch UIs
    new FastClick(document.body);

    document.addEventListener('deviceready', function() {
        document.addEventListener('backbutton', function(event) {
            var $prev = $('.slide.active').find('.prev');
            if ($prev.length > 0) {
                $prev.click();
            } else {
                exitApp();
            }
            event.preventDefault();
        }, false);
    }, false);

    // 滑动到下一页
    // 偏移外层包装使其定位到下一个滑动页
    // 需要偏移的距离 = 下一个滑动页之前所有滑动页宽度之和
    $slideWrapper.on('click', '.next', function(event) {
        var $prevSlides = $(this).parents('.slide').removeClass('active')
                                 .next('.slide').addClass('active')
                                 .prevAll('.slide');
        offsetSlide($prevSlides);
    });
    // 滑动到上一页
    // 需要偏移的距离 = 上一个滑动页之前所有滑动页宽度之和
    $slideWrapper.on('click', '.prev', function(event) {
        var $prevSlides = $(this).parents('.slide').removeClass('active')
                                 .prev('.slide').addClass('active')
                                 .prevAll('.slide');
        offsetSlide($prevSlides);
    });

    // 点击论坛介绍滑动到论坛帖子列表页
    $forumList.on('click', '.forum-intro', function(event) {
        $forumList.find('.forum-intro').removeClass('active');
        $(this).addClass('active');

        $topicList.find('.slide-hd .header').text($(this).find('.forumname').text());
        $forumList.find('.next').click();
    });

    // 初始化帖子列表的滚动条
    $topicList.find('.slide-bd').height($topicList.outerHeight() - $topicList.find('.slide-hd').outerHeight())
    new iScroll($topicList.find('.slide-bd')[0], {
        checkDOMChanges: true
    });

    // 初始化帖子列表的滚动条
    $topic.find('.slide-bd').height($topic.outerHeight() - $topic.find('.slide-hd').outerHeight())
    new iScroll($topic.find('.slide-bd')[0], {
        checkDOMChanges: true
    });
})();