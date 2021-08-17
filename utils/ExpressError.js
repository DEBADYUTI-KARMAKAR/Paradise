class ExpressError extends Error{
    constructor(meggage, statusCode){
        super();
        this.message = meggage;
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;
