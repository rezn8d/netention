"use strict";

/** manages the state of an input text prompt and its related pop-ups */
class Prompt {

    constructor(me, ele) {
        this.ele = ele;
        this.me = me;

        const that = this;

        this.var = { };


        LazyLoad.js('lib/editable.js', ()=>{

            var editable = new Editable({
                // // here you can pass an iframe window if required
                // window: window,
                //
                // // activate the default behaviour for merge, split and insert
                // defaultBehavior: true,
                //
                // // fire selection events on mouse move
                // mouseMoveSelectionChanges: false,

                // control the 'spellcheck' attribute on editable elements
                browserSpellcheck: false
            });

            const doc = D();
            that.doc = doc;
            doc.addClass('editor prompt');
            const editor = E('span').attr('contenteditable','true'); //.attr('style', 'height:100%; width: 100%;').attr('contenteditable', 'true');


            doc.click(()=>{
                //TODO save last location so it can be restored here. otherwise by default, 'editor' refers to the first of the lines this editable.js creates
                editor.focus();
            });


            editable.add(editor);
            doc.append(editor);
            ele.append(doc);


            //'focus', 'blur', 'cursor', 'selection', 'newline' == shift+enter
            editable.on('change', elem => {
                //const x = editable.getContent(elem);
                // let row = $(elem).index();
                // that.update(row, x);
                //const allContent = doc.html();
            });
            var currentFocus;
            editable.on('focus', nextFocus => {

                //console.log(currentFocus, nextFocus);

                if (currentFocus && currentFocus!==nextFocus) {
                    const currentRow = $(currentFocus).index();
                    const currentRowValue = editable.getContent(currentFocus);

                    //console.log(currentRow, currentRowValue);
                    that.update(currentRow, currentRowValue);
                }

                currentFocus = nextFocus;

            });

            editable.on('insert', (elem, direction, cursor) => {
                if (direction === 'after') {
                    const e = E('br');
                    cursor.insertAfter(e[0]);
                } else if (direction === 'before') {
                    // your code...
                    console.log('insert before', direction);
                }
            });

            //editor.attr('contenteditable', true);

            // editor.focus(() => {
            //     //editor.attr('contenteditable', 'true');
            //     ele.css({
            //        'pointerEvents': 'none'
            //     });
            //
            // }, () => {
            //     //editor.attr('contenteditable', 'false');
            //     ele.css({
            //         'pointerEvents': 'all'
            //     });
            // });

            var widgets = [];

            function reset() {
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

            // editor.addKeyMap({
            //
            //     //TODO ctrl-enter
            //
            //     'Enter': cm => {
            //
            //
            //         if (cm.lineCount() === 1 && widgets.length === 0) {
            //
            //
            //             const x = document.createElement('div');
            //             const xx = toolbar($(x));
            //             if (menu)
            //                 menu.append(x);
            //             else
            //                 cm.addLineWidget(0, x);
            //
            //             widgets.push($(x));
            //
            //             cm.refresh();
            //             //cm.addLineWidget(3, E('button').text('wtf')[0]);
            //
            //             setTimeout(() => {
            //                 cm.setCursor(cm.lastLine(), 0);
            //             });
            //
            //         }
            //
            //         return CodeMirror.Pass;
            //     },
            //
            //     'Ctrl-Enter': cm => {
            //
            //
            //         const val = cm.getValue().trim();
            //         reset();
            //         me.put({I: uuid(), N: val});
            //         {
            //
            //             //add finder
            //         }
            //
            //         return CodeMirror.Pass;
            //     },
            //     'Down': cm => {
            //         // if (!multiline) {
            //         //     $(ele[0]).addClass('multiline');
            //         //     multiline = true;
            //         //     f.remove();
            //         // }
            //         return CodeMirror.Pass;
            //     },
            //
            //     'Esc': cm => {
            //         reset();
            //     }
            // });


            var q;
            let queryMinUpdatePeriodMS = 100;
            const onQueryTextChanged = _.throttle(() => {

                const nextQ = editable.html();
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

            //ele.on('input', onQueryTextChanged);


            // //clicking on the icon causes editor to focus
            // ele.click(() => {
            //     editor.focus();
            // });
            //editor.focus(); //auto-focus


            //});

            editor.focus();

        });

// add and initialize a block element to be made editable

        //let loading = $('<h1>LOADING EDITOR</h1>');
        //ele.append(loading);


        //LazyLoad.js('lib/wysiwyg-editor.min.js', ()=>{

        //LazyLoad.js("lib/codemirror/codemirror.min.js", () => {
        //
        //    LazyLoad.css('lib/wysiwyg-editor.min.css');
        //LazyLoad.css('lib/codemirror/codemirror.css');

        //loading.remove();


        // const editor = that.editor = CodeMirror(ele[0], {
        //     lineNumbers: false,
        //     viewportMargin: Infinity,
        //     cursorBlinkRate: 500 //disable blinking
        // });




    }

    setRow(row, newValue) {
        let c = this.doc.children();
        if (c) {
            let child = $(c.get(row));
            child.replaceWith(newValue);
        }
    }

    update(row, v) {

        const that = this;
        // function setVar(v, x) {
        //     //console.log('setVar', v, x);
        //     that.var[v] = x; //can leak memory watch out
        // }

        const w = v.replace(/https?:\/\/([\w\d-\.]+)?[\w\d-\.]+\.{1}[\w]{1,4}((\/{1})?)([a-zA-Z0-9&-@_\+.‌​~#?\/=]*[\w])?/gi,
            (x)=> { console.log(row, x); });

        // if (v!=w) {
        //     var ww = $('<span contenteditable="true" data-editable="id-1" spellcheck="false" class="js-editable"/>').html(w);
        //     ww.find('.var').each((i, x)=>{
        //         console.log(this, i, x);
        //         x = $(x);
        //         x.html(that.var[x.text()]).attr('var', null);
        //     });
        //
        //     this.setRow(row, ww);
        // }


        // let w = v.replace('http://', '<button>http://</button>');
        // if (w!=v)
        //     this.setRow(row, w );
    }

//     update(q) {
//         // if (!q.length) {
//         //     reset();
//         // }
//
//         //editor.setValue(editor.getLine(0)); //clear everything below first line
//
//         //suggFeed.html('');
//
//
//         // const update = _.debounce(()=>suggFeed.packery( 'appended' ), 100);
//         //
//         // this.me.get(q, (x) => {
//         //
//         //     const y = new NIcon(x).ele;
//         //     f.append(y);
//         //
//         //
//         //     //editor.append(y);
//         //     //update();
//         // });
//
//         //$('#query_status').html('Suggesting: ' + qText);
//
// //                $.get('/suggest', {q: qText}, function (result) {
// //
// //                    if (!result.length) {
// //                        suggestions.html('');
// //                    } else {
// //                        suggestions.html(_.map((result), (x) =>
// //                            D('suggestion').text(x).click(() => {
// //                                ele.val(x);
// //                                update(x);
// //                            })
// //                        ));
// //                    }
// //                });
//
//     }

}


class PromptTest extends NView {

    build(me, target) {


        const p = new Prompt(me, target);

    }
}
