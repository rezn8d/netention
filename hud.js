class HUDView extends NView {
    constructor() {
        super();
    }
    build(me, target) {
        // Set Theme
        $(target).addClass(me.DefaultTheme);

        $('#nt-user').on('click', function () {
            var mn = $('nav.right');
            if (mn.hasClass('visible')) {
                mn.removeClass('visible');
                $(this).removeClass('active');
            } else {
                mn.addClass('visible');
                $(this).addClass('active');
            }
        });

        target.find('.sub-menu ul').hide();
        target.find(".sub-menu a").click(function () {
            if ($(this).parent(".sub-menu").children("ul").is(":visible")) {
                $(this).parent(".sub-menu").children("ul").hide();
                $(this).find(".right").removeClass("fa-caret-down").addClass("fa-caret-up");
            } else {
                $(this).parent(".sub-menu").children("ul").show();
                $(this).find(".right").removeClass("fa-caret-up").addClass("fa-caret-down");
            }
        });

        var rightMenu = target.find('#nt-ri');

        function faButton(id, fa, label=id, desc=label) {
            return $('<i id="' + id + '" title="' + desc + '" class="nt-btn nt-view-btn fa fa-2x ' + fa + '"/>');
        }

        var buttons = target.find('.buttons');

        buttons.prepend([
            faButton('go', 'fa-code-fork').attr('style', 'touch-events: none'),
            faButton('feed', 'fa-th-list'),
            faButton('graph', 'fa-code-fork'),
            faButton('timeline', 'fa-clock-o'),
        ]);


        if (me.AllowInstantMessaging === true) {
            var messageBtn = $('<div id="notifications" class="nt-btn nt-view-btn" title="Updates (notifications / messages)"><i class="fa fa-2x fa-comments-o"></i><span class="visuallyhidden">Messages</span><span class="badge right">12</span></div>').prependTo(rightMenu);
        }

        if (me.AllowUserHomepage === true) {
            var messageBtn = $('<div id="home" class="nt-btn nt-view-btn" title="My Home"><i class="fa fa-2x fa-home"></i><span class="visuallyhidden">Homepage</span></div>').prependTo(rightMenu);
        }

    }
}
