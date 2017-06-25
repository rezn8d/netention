class HUDView extends NView {
    constructor() {
        super();
    }
    build(me, target) {
        // Set Theme
        $(target).addClass(me.DefaultTheme);

        $('#user').on('click', function () {
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

        var rightMenu = $('#right-dropdown');

        function faButton(id, fa, label=id, desc=label) {
            return $('<i id="' + id + '" title="' + desc + '" class="btn view-btn fa fa-2x ' + fa + '"/>');
        }

        var buttons = target.find('#left-menu');

        buttons.prepend([
            faButton('go', 'fa-plus'),
            faButton('feed', 'fa-th-list'),
            faButton('map', 'fa-globe'),
            faButton('graph', 'fa-code-fork'),
            faButton('timeline', 'fa-clock-o'),
        ]);
            target.addClass(me.DefaultTheme);
        $('#theme-switcher').on('change', function() {
                        console.log('clicked');
                if (target.hasClass("dark")) {
                    console.log('is dark');
                        target.removeClass('dark').addClass('light');
                } else {
                    console.log('is light');
                        target.removeClass('light').addClass('dark');
                }
        });

        if (me.AllowInstantMessaging === true) {
            var messageBtn = $("<li><a href='#message'><div class='fa fa-envelope'></div> Messages<span class='badge right'>12</span></a></li>").prependTo(rightMenu);
        }
        if (me.AllowUserHomepage === true) {
            var messageBtn = $("<li><a href='#home'><div class='fa fa-home'></div> My Home</a></li>").prependTo(rightMenu);
        }

    }
}
