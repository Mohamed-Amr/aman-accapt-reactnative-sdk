import HttpManager from "../http/HttpManager";
import hmacSHA512 from 'crypto-js/hmac-sha512';

export default class OPay{

    #defaultUrl = "https://www.amanaccept.com/";
    #createOrderUrl = "/create-payment-order";
    #paymentStatus = "/check-payment-status";

    createOrder=async (paymentParameters)=>{
        let requestParams = {
            publicKey: paymentParameters.publicKey,
            merchantReference: paymentParameters.merchantReference,
            orderReference: paymentParameters.orderReference,
            amount: paymentParameters.Amount,
            fees: paymentParameters.Amount,
            currency: paymentParameters.currency,
            country: paymentParameters.countryCode.toUpperCase(),
            productList: {
                id: paymentParameters.productID,
                name: paymentParameters.productName,
                price: paymentParameters.productPrice,
                quantity: paymentParameters.productQuantity,
                image: paymentParameters.productImage
            },
            customer: {
                name: paymentParameters.customerName,
                phoneNumber: paymentParameters.customerPhoneNumber,
                emailAddress: paymentParameters.customerEmailAddress,
                address: paymentParameters.customerAddress,
            },
            returnUrl: this.#defaultUrl,
            callbackUrl: paymentParameters.callbackUrl,
            cancelUrl:this.#defaultUrl,
            maxPaymentsCount: 1,
            type: 1,
            platformType = "ReactNative",
            platformVersion = "1.0.5",
            addressRequired: paymentParameters.addressRequired,
            expireAt:paymentParameters.expireAt,
            paymentMethod:paymentParameters.paymentMethod,
        }

        let header = {
            merchantReference: paymentParameters.merchantReference,
            publicKey: paymentParameters.publicKey,
        }

        let response = await new HttpManager().post(this.#createOrderUrl,header,requestParams,Aman.isSandBox,requestParams.country)
        return response
    }



    getPaymentStatus = async (PaymentParameters)=>{
        let hash_string = util.format('{TransactionReference:%s,Currency:%s', AmanPaymentParameters.orderReference, AmanPaymentParameters.currency);
        let hash_signature = hmacSHA512(hash_string,AmanPaymentParameters.privateKey).toString();
        let requestParams={
            reference:PaymentParameters.orderReference,
            currency:PaymentParameters.currency,
            hash:hash_signature
        }
        let publicKey = hmacSHA512(JSON.stringify(requestParams),PaymentParameters.privateKey).toString()
        let header = {
            merchantReference : PaymentParameters.merchantReference,
            publicKey : PaymentParameters.publicKey
        }
        let response = await new HttpManager().post(this.#paymentStatus,header,requestParams,Aman.isSandBox,requestParams.country)
        return response

    }
}

Aman.isSandBox=true;