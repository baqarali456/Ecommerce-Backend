class ApiError extends Error{
    constructor(
      statuscode,
      message = "something went wrong",
      errors = [],
    ){
        super(message)
     this.statuscode = statuscode;
     this.message = message;
     this.data = null;
     this.success = false;
     this.errors = errors;
    }
}
export {ApiError}