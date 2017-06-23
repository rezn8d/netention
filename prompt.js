"use strict";

/** manages the state of an input text prompt and its related pop-ups */
class Prompt {

    constructor(me, ele) {
        this.ele = ele;

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
                viewportMargin: Infinity
            });



            //const suggFeed = D();
            // suggFeed.packery({
            //     itemSelector: '.grid-item',
            //     gutter: 5
            // });
            // suggFeed.attr('style', 'width: 100%; height: auto');

            //editor.addLineWidget(1, suggFeed[0], {coverGutter: false, noHScroll: true})


            var multiline = false;

            var f;

            function reset() {

                if (f)
                    f.remove();

                f = D();

                multiline = false;
                // editor.setValue('');
                // editor.addLineWidget(2, f[0], {
                //
                // });
            }
            reset();

            function close() {
                $(ele).fadeOut();
                reset();
            }

            editor.addKeyMap({

                //TODO ctrl-enter

                'Enter': cm => {
                    if (!multiline) {
                        const val = cm.getValue().trim();
                        cm.setValue('');
                        {

                            //add finder
                        }
                    }
                    return CodeMirror.Pass;
                },
                'Down': cm => {
                    if (!multiline) {
                        $(ele[0]).addClass('multiline');
                        multiline = true;
                        f.remove();
                    }
                    return CodeMirror.Pass;
                },

                'Esc': cm => {

                    close();
                }
            });


            var q;
            let queryMinUpdatePeriodMS = 100;
            const onQueryTextChanged = _.throttle(() => {

                if (multiline)
                    return;

                const nextQ = editor.getValue().trim();
                if (nextQ == q)
                    return; //same

                q = nextQ;
                if (!q.length) {
                    reset();
                }

                //editor.setValue(editor.getLine(0)); //clear everything below first line

                //suggFeed.html('');


                // const update = _.debounce(()=>suggFeed.packery( 'appended' ), 100);
                //
                me.get(q, (x) => {

                    const y = new NIcon(x).ele;
                    f.append(y);


                    //editor.append(y);
                    //update();
                });

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
            }, queryMinUpdatePeriodMS, true, true);

            const querySubmit = () => {
                var q = ele.getValue()
                if (q = q.trim()) {
                    //update(q);
                    //I.info("share: " + q);

                    me.put({
                        I: 'x' + parseInt(10000000 * Math.random()), //TODO UUID
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

}

