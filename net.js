class Connection {

    constructor(id) {
        this.id = id;
        this.onActivity(-1);
    }

    /** async publish to this connection */
    share(x) {

    }

    /** call this when there is activity.  the actual callee will be overridden
     * amount in range 0..1.0 indicating the approximate strength of the activity level
     * set to -1 to indicate disconnect
     * */
    onActivity(amount) {

    }

}
