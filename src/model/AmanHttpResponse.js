
export default class AmanHttpResponse{
    reference: String;
    orderReference: String;
    amount: Number;
    type: String;
    fees: Number;
    total: Number;
    currency: String;
    exchangeRate: Number;
    value: Number;
    totalValue: Number;
    cashierUrl: String;
    availablePaymentMethods: any;
    platformType: String;
    platformVersion: String;
}

export class ResponseStatus{
    static success:Number=0
    static error:Number=1;
}
