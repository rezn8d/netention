"use strict";

/** manages the state of an input text prompt and its related pop-ups */
class Prompt {

    constructor(me, ele, menu=undefined) {
        this.ele = ele;
        this.me = me;

        const that = this;

        let loading = $('<h1>LOADING EDITOR</h1>');
        ele.append(loading);


        //LazyLoad.js('lib/wysiwyg-editor.min.js', ()=>{

        LazyLoad.js("lib/codemirror/codemirror.min.js", () => {
            //
            //    LazyLoad.css('lib/wysiwyg-editor.min.css');
            LazyLoad.css('lib/codemirror/codemirror.css');

            loading.remove();

            const editor = that.editor = CodeMirror(ele[0], {
                lineNumbers: false,
                viewportMargin: Infinity,
                cursorBlinkRate: 500 //disable blinking
            });

            var widgets = [];

            function reset() {
                editor.setValue('');
                editor.refresh();
                widgets.forEach(w => w.remove());
                widgets = [];
            }

            function toolbar(target) {
                target.append([
                    $('<button>what</button>'),
                    $('<button>where</button>'),
                    $('<button>when</button>'),
                    $('<button>who</button>'),
                    $('<button>why</button>'),
                    $('<button>how</button>')
                ]);
            }

            //const suggFeed = D();
            // suggFeed.packery({
            //     itemSelector: '.grid-item',
            //     gutter: 5
            // });
            // suggFeed.attr('style', 'width: 100%; height: auto');

            //editor.addLineWidget(1, suggFeed[0], {coverGutter: false, noHScroll: true})

            editor.addKeyMap({

                //TODO ctrl-enter

                'Enter': cm => {


                    if (cm.lineCount() === 1 && widgets.length === 0) {


                        const x = document.createElement('div');
                        const xx = toolbar($(x));
                        if (menu)
                            menu.append(x);
                        else
                            cm.addLineWidget(0, x);

                        widgets.push($(x));

                        cm.refresh();
                        //cm.addLineWidget(3, E('button').text('wtf')[0]);

                        setTimeout(() => {
                            cm.setCursor(cm.lastLine(), 0);
                        });

                    }

                    return CodeMirror.Pass;
                },

                'Ctrl-Enter': cm => {


                    const val = cm.getValue().trim();
                    reset();
                    me.put({I: uuid(), N: val});
                    {

                        //add finder
                    }

                    return CodeMirror.Pass;
                },
                'Down': cm => {
                    // if (!multiline) {
                    //     $(ele[0]).addClass('multiline');
                    //     multiline = true;
                    //     f.remove();
                    // }
                    return CodeMirror.Pass;
                },

                'Esc': cm => {
                    reset();
                }
            });


            var q;
            let queryMinUpdatePeriodMS = 100;
            const onQueryTextChanged = _.throttle(() => {

                const nextQ = editor.getValue();
                if (nextQ == q)
                    return; //same

                // console.log('lines',editor.lineCount(),editor.lastLine(), widgets);
                //
                // if (editor.lineCount()===1 && widgets.length > 0) {
                //     //remove any widgets when it has been reduced again to single line
                //     widgets.forEach(w => w.remove()); widgets = [];
                // }

                q = nextQ;
                that.update(q);
            }, queryMinUpdatePeriodMS, true, true);

            const querySubmit = () => {
                var q = ele.getValue()
                if (q = q.trim()) {
                    //update(q);
                    //I.info("share: " + q);

                    me.put({
                        I: uuid(),
                        N: q
                    });
                }
            };

            ele.on('input', onQueryTextChanged);


            //clicking on the icon causes editor to focus
            ele.click(() => {
                editor.focus();
            });
            editor.focus(); //auto-focus


        });


    }

    update(q) {
        if (!q.length) {
            reset();
        }

        //editor.setValue(editor.getLine(0)); //clear everything below first line

        //suggFeed.html('');


        // const update = _.debounce(()=>suggFeed.packery( 'appended' ), 100);
        //
        // this.me.get(q, (x) => {
        //
        //     const y = new NIcon(x).ele;
        //     f.append(y);
        //
        //
        //     //editor.append(y);
        //     //update();
        // });

        //$('#query_status').html('Suggesting: ' + qText);

//                $.get('/suggest', {q: qText}, function (result) {
//
//                    if (!result.length) {
//                        suggestions.html('');
//                    } else {
//                        suggestions.html(_.map((result), (x) =>
//                            D('suggestion').text(x).click(() => {
//                                ele.val(x);
//                                update(x);
//                            })
//                        ));
//                    }
//                });

    }

}

