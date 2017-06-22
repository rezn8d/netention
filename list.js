class TableView extends NView {

    constructor() {
        super();
    }

    build(I, target) {

        const y = D();
        y.query = (q) => {
            console.log('query', q, I.mem);
            I.mem.get(q, x => y.append($('<h1>' + x + '</h1>')));
        };
        target.html(y);
        return y;

    }
}
