/**
 * cst网站数据逻辑
 * 主要实现提取原始页面(如论坛帖子页面)中的数据重新组装到自己的页面上
 *
 * TODO 暂时以实现功能为目的, 优化什么都是浮云, 考虑引入RequireJS和Backbone
 * 
 * @author Sun
 * @version 0.1 2013-12-21
 */
(function() {
    var config = {
        tokenUrl: 'http://bbs.cstong.net/index.php?m=bbs&c=forumlist',
        tokenRegExp: /TOKEN\s*:\s*'(\w+)'/,
        extraToken: function(string) {
            return string.match(config.tokenRegExp)[1];
        },

        focusPageApi: 'http://bbs.cstong.net/index.php?m=cst&c=Api&a=loadFocusPage',
        pageSize: 20,

        forumlistUrl: 'http://bbs.cstong.net/index.php?m=bbs&c=forumlist'
    };

    /**
     * 获取token, 用于发送post请求
     */
    function getToken() {
        var dfd = $.Deferred();
        var promise = $.ajax({
            type: 'GET',
            url: config.tokenUrl,
            cache: false
        });
        promise.done(function(html) {
            dfd.resolve(config.extraToken(html));
        });
        return dfd.promise();
    }

    /**
     * 获取焦点数据(JSON数据接口)
     */
    function getFocusPage(topic, page) {
        return $.ajax({
            type: 'POST',
            url: config.focusPageApi,
            data: {
                tab: topic,
                page: page,
                pageSize: config.pageSize
            },
            dataType: 'json'
        });
    }

    // 获取聚焦数据
    // TODO 没实现UI
    // getToken().done(function(token) {
    //     $.ajaxSetup({
    //         data: {
    //             csrf_token: token
    //         }
    //     });
    //     getFocusPage('all', 1).done(function(data) {
    //         console.log(data);
    //         console.log(data.page, data.total, data.count);
    //     });
    // });

    /**
     * 将帖子图片替换成小图(节约流量), 可点击替换成大图
     */
    function clearPostImg($el, selector) {
        $el.find(selector).each(function() {
            var src = $(this).data().src;
            if (src.indexOf('attachment/thumb') != -1) {
                src = src.replace('attachment/thumb', 'attachment/thumb/mini');
            } else {
                src = src.replace('attachment', 'attachment/thumb/mini');
            }
            this.src = src;
        }).removeAttr('onclick onload style')
          .click(function() {
              this.src = $(this).data().src;
          });
    }

    /**
     * 组装活跃板块列表的HTML结构
     */
    function getForumIntroHtml($forumline) {
        var html = '';

        if ($forumline.length > 0) {
            var forumimage = $forumline.find('.forumimage').wrap('<div></div>').parent().html();
            var forumname = $forumline.find('.forumname').wrap('<div></div>').parent().html();

            html += '<div class="span4 intro-wrapper">';
            html +=     '<div class="forum-intro">';
            html +=         '<div>' + forumimage + '</div>';
            html +=         '<h2 class="forumname-hd">' + forumname + '</h2>';
            html +=     '</div>';
            html += '</div>';
        }

        return html;
    }

    /**
     * 请求论坛首页获取活跃板块的数据
     */
    function getForumlist() {
        var $forumListhd = $('.forum-list .slide-bd');

        $.fastScan(config.forumlistUrl).done(function($el) {
            var $forumitems = $el.find('.forumitem');
            var $html = $('<div></div>');

            for (var i = 0, length = $forumitems.length; i < length; i+=3) {
                var $forumitem1n = $forumitems.eq(i);
                var $forumitem2n = $forumitems.eq(i + 1);
                var $forumitem3n = $forumitems.eq(i + 2);

                var $row = $('<div class="row-fluid"></div>');
                $row.append(getForumIntroHtml($forumitem1n));
                $row.append(getForumIntroHtml($forumitem2n));
                $row.append(getForumIntroHtml($forumitem3n));

                $html.append($row);
            }

            $forumListhd.html($html.html());
            $forumListhd.find('img').each(function() {
                this.src = $(this).data().src;
            });
            $forumListhd.find('a').each(function() {
                this.href = $(this).data().src;
            });
            $forumList.find('.forum-intro').eq(0).click();
        });
    }

    var $forumList = $('.forum-list');
    $forumList.on('click', '.forumname a', function(event) {
        $(this).parents('.forum-intro').click();
        return false;
    });
    // 点击活跃板块滑动到板块帖子列表
    $forumList.on('click', '.forum-intro', function(event) {
        var forumUrl = $(this).find('.forumname a').attr('href');
        $('.topic-list .post-list').empty();
        $.fastScan(forumUrl).done(function($el) {
            $el.find('.thread_posts_list .reply, .thread_posts_list .lastreply').remove();
            // XXX 只提取了前10篇帖子
            $el.find('#J_posts_list tr:gt(9)').remove();
            $el.find('.threadimgole').parent().each(function() {
                $(this).css('height', 'auto');
            });
            $('.topic-list .post-list').html($el.find('#J_posts_list').html())
                                      .find('img').each(function() {
                                         this.src = $(this).data().src;
                                      })
                                      .end()
                                      .find('.title a').each(function() {
                                         this.href = $(this).data().src;
                                      });
        });
    });

    var $topicList = $('.topic-list');
    var $topic = $('.topic');
    $topicList.on('click', '.title a', function(event) {
        $(this).parents('tr').click();
        return false;
    });
    // 点击板块帖子滑动到帖子页面
    $topicList.on('click', 'tr', function(event) {
        $topicList.find('.next').click();
        $topic.find('.slide-hd .header').text($topicList.find('.slide-hd .header').text());

        var threadUrl = $(this).find('.title a').attr('href');
        $topic.find('.post').empty();
        $.fastScan(threadUrl).done(function($el) {
            // XXX 只提取了前11条跟帖(包含楼主)
            $el.find('.floor:gt(10)').remove();
            $topic.find('.post').html($el.find('.floor'))
                                .find('.J_avatar, .cstface').each(function() {
                                    this.src = $(this).data().src;
                                });
            clearPostImg($topic.find('.post'), '.J_post_img');
        });
    });

    getForumlist();
})();