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
                $(this).find(".fa-caret-down.right").removeClass("fa-caret-down").addClass("fa-caret-up");
            } else {
                $(this).parent(".sub-menu").children("ul").show();
                $(this).find(".fa-caret-up.right").removeClass("fa-caret-up").addClass("fa-caret-down");
            }
        });

        var rightMenu = $('#right-dropdown');

        function faButton(id, fa, action, label = id, desc = label) {
            return $('<i id="' + id + '" title="' + desc + '" class="btn view-btn fa fa-2x ' + fa + '"/>').click(()=>{
                setTimeout(action);
            });
        }

        var buttons = $('#left-menu');

        const that = this;

        const VIEW = $('#view');

        // CREATE ADD NOBJECT BUTTON
        buttons.prepend([
            faButton('go', 'fa-plus', ()=>{

                that.spawnNobject(me);

            })
        ]);

        if (me.IncludeList === true) {
            buttons.append([
                faButton('feed', 'fa-th-list', ()=>{
                    LazyLoad.js('list.js', () => new ListView().build(me, VIEW));
                })
            ]);
        }

        if (me.IncludeMap === true) {
            buttons.append([
                faButton('map', 'fa-globe', ()=>{
                    LazyLoad.js('map3d.js', () => new CesiumView().build(me, VIEW) );
                })
            ])
        }

        if (me.IncludeTimeline === true) {
            buttons.append([
                faButton('timeline', 'fa-clock-o', ()=>{
                    LazyLoad.js('voyager.js', () => new VoyagerView().build(me, VIEW) );
                })
            ]);
        }

        if (me.IncludeGraph === true) {
            buttons.append([
                faButton('graph', 'fa-code-fork', () => {
                    LazyLoad.js('spacegraph.js', () => new SpaceGraphView().build(me, VIEW) );
                })
            ]);
        }



        $('#left-menu .view-btn').on('click', function() {
            $('#left-menu i').removeClass('active');
            $(this).addClass('active');
        });


        // THEME SWITCHER
        target.addClass(me.DefaultTheme);
        $('#theme-switcher').on('click', function () {
            if (target.hasClass("dark")) {
                target.removeClass('dark').addClass('light');
            } else {
                target.removeClass('light').addClass('dark');
            }
        });

        // FONT SIZE SLIDER
        function NSlider(opt) {
            var src = opt.src;
            var mod = opt.mod;
            opt = opt || {};

            if (!opt.element) opt.element = $('<div class="nslider"></div>');
            if (!opt.min) opt.min = 0;
            if (!opt.max) opt.max = 1;
            if (!opt.start) opt.start = 1;
            if (!opt.label) opt.label = '';

            $('<div class="label">' + opt.label + '</div>').appendTo(opt.element);
            var slider = $('<input class="' + opt.label + '" type="range">').appendTo(opt.element);
            var begin = (opt.start / opt.max) * 100;

            slider.attr('min', 0);
            slider.attr('max', 300);
            slider.attr('step', 1);
            slider.attr('value', begin);

            slider.on("change", function () {
                var newValue = slider.val();
                // var percent = (newValue / 100).toFixed(2);
                // var sum = (opt.max * percent);
                $('body').css('font-size', (newValue + "%"));
                $('#font-size-dropdown .badge').html(newValue + "%");
            });

            return opt.element;
        }

        NSlider({
            //'label': 'font size'
        }).appendTo($('#font-size-dropdown'));

        $('#font-size').on('click', function () {
            $('#font-size-dropdown').toggle();
        });

        if (me.AllowInstantMessaging === true) {
            var messageBtn = $("<li><a href='#message'><div class='fa fa-envelope'></div> Messages<span class='badge right'>12</span></a></li>").prependTo(rightMenu);
        }
        if (me.AllowUserHomepage === true) {
            var messageBtn = $("<li><a href='#home'><div class='fa fa-home'></div> My Home</a></li>").prependTo(rightMenu);
        }



        // // FONT SIZE SLIDER
        // function NSlider(opt) {
        //     var src = opt.src;
        //     var mod = opt.mod;
        //     opt = opt || {};
        //
        // } //end build

    }

    spawnNobject(me) {
        const x = me.nobject();

        var prompt;

        const win = newWindow(undefined, {
            onStart: function (w) {
                prompt = new Prompt(me, w, w.left);
            },
            onClose: function () {

                //x.N = prompt.editor.getLine(0) || x.I;
                //x.D = prompt.editor.getValue();

                if (x)
                    me.put(x); //save if not deleted
            }
        });

        win.below.css({'textAlign': 'right'});

        const shareButton = $('<button><i class="fa fa-share-alt"></i></button>');
        win.below.append(shareButton);

        const saveButton = $('<button><i class="fa fa-floppy-o"></i></button>');
        win.below.append(saveButton);

        win.right.append($('<button>').text('x1'));
        win.right.append($('<button>').text('x2'));

        win.centerOnScreen();
    }

}
