
export default class OPayHttpResponse{
    status:Number;
    data:any;
    code:String;
    message;
}

export class ResponseStatus{
    static success:Number=0
    static error:Number=1;
}
