"use strict";

/** manages the state of an input text prompt and its related pop-ups */
class Prompt {

    constructor(I, ele) {
        this.ele = ele;

        const that = this;
        LazyLoad.js("lib/codemirror/codemirror.min.js", ()=>{

            LazyLoad.css('lib/codemirror/codemirror.css');


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


            editor.addKeyMap({

                //TODO ctrl-enter

                'Esc': function(cm) {
                    cm.setValue('');
                    editor.fadeOut();
                }
            });



            var q;
            let queryMinUpdatePeriodMS = 100;
            const onQueryTextChanged = _.throttle(() => {

                const nextQ = editor.getValue();
                if (nextQ == q)
                    return; //same

                q = nextQ;
                //editor.setValue(editor.getLine(0)); //clear everything below first line

                //suggFeed.html('');





                // const update = _.debounce(()=>suggFeed.packery( 'appended' ), 100);
                //
                I.get(q, (x)=>{

                    const y = new NIcon(x).ele;

                    editor.addWidget({ch:30 , line: 2}, y[0]);


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

                    I.put({
                        I: 'x' + parseInt(10000000 * Math.random()), //TODO UUID
                        N: q
                    });
                }
            };

            ele.on('input', onQueryTextChanged);


            //clicking on the icon causes editor to focus
            ele.click(()=>{
                editor.focus();
            });
            editor.focus(); //auto-focus



        });


    }

}

