class ListView extends NView {

    constructor() {
        super();
    }

    build(me, target) {

        LazyLoad.js('lib/isotope.pkgd.min.js', ()=>{

            //me.info('Isotope ready');  target[0]

            const c = $(target[0]).html('<div id="list"></div>');
            $('#list').attr('style', 'width: 100%; height: 100%');

            //viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

        /*
            function genImages() {
                // Create post image previews
                $('.post').each(function () {
                    var target = $(this),
                        link;
                    target.html('');
                    //console.log(target);
                    if (target.hasClass('image-link')) {
                        link = target.attr('href');
                        $('<span class="rollover"><i class="fa fa-2x fa-search"></i></span><div class="videoWrapper"><img data-original="' + link + '" class="lazy" alt="image"></div>').appendTo(target);

                    } else {
                        link = target.attr('data-vid');
                        $('<span class="rollover"><i class="fa fa-2x fa-play"></i></span><div class="videoWrapper"><img class="youtube lazy" data-original="https://img.youtube.com/vi/' + link + '/0.jpg" data-params="modestbranding=1&showinfo=0&controls=0&vq=hd720" alt="YouTube video"></div>').appendTo(target)
                    //    $('<span class="rollover"><i class="fa fa-2x fa-play"></i></span><div class="videoWrapper"><img class="youtube lazy" data-original="https://i.ytimg.com/vi/' + link + '/sddefault.jpg" data-params="modestbranding=1&showinfo=0&controls=0&vq=hd720" alt="YouTube video"></div>').appendTo(target)
                    //    $('<span class="rollover"><i class="fa fa-2x fa-play"></i></span><div class="videoWrapper"><img class="youtube lazy" data-original="/WMH/timeline/video/' + link + '.jpg" data-params="modestbranding=1&showinfo=0&controls=0&vq=hd720" alt="YouTube video"></div>').appendTo(target)
                    }
                });

                $(".post-media img.lazy").lazyload({
                    effect: "fadeIn",
                    threshold: 200
                });

                $grid.isotope();
            }
        */
        
        var qsRegex,
            buttonFilter,
            $grid = $('#list').isotope({
                itemSelector: '.post',
                //layoutMode: 'masonry',
                //isFitWidth: true,
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                },
                transitionDuration: 0,
                filter: function () {
                    var $this = $(this);
                    var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
                    var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
                    return searchResult && buttonResult;
                }
            }),
            buttonFilter = ".featured";
    
        //init Isotope
        $grid.isotope();

        //genImages();

        //$('.timeline-filter').click(function () {

            //buttonFilter = $(this).attr('data-filter');

            //$grid.isotope();

            //genImages();
        //});


        // use value of search field to filter
        var $quicksearch = $('#quicksearch').keyup( debounce( function() {
          qsRegex = new RegExp( $quicksearch.val(), 'gi' );
          $grid.isotope();
        }) );


        // debounce so filtering doesn't happen every millisecond
        function debounce( fn, threshold ) {
          var timeout;
          return function debounced() {
            if ( timeout ) {
              clearTimeout( timeout );
            }
            function delayed() {
              fn();
              timeout = null;
            }
            setTimeout( delayed, threshold || 100 );
          };
        }



        }); // end lazyload

    }
}
