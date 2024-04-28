import HttpManager from "../http/HttpManager";
import hmacSHA512 from 'crypto-js/hmac-sha512';

export default class OPay{

    #defaultUrl = "https://www.opaycheckout.com/";
    #createOrderUrl = "/api/v1/international/cashier/create";
    #cashierStatus = "/api/v1/international/cashier/status";

    createOrder=async (payParams)=>{
        let requestParams = {
            merchantName: payParams.merchantName,
            country: payParams.countryCode.toUpperCase(),
            reference: payParams.reference,
            amount: {
                total: payParams.payAmount,
                currency: payParams.currency
            },
            product: {
                name: payParams.productName,
                description: payParams.productDescription
            },
            returnUrl: this.#defaultUrl,
            callbackUrl: payParams.callbackUrl,
            cancelUrl:this.#defaultUrl,
            userClientIP: payParams.userClientIP,
            expireAt:payParams.expireAt,
            payMethod:payParams.paymentType,
            userInfo: payParams.userInfo
        }

        let header = {
            merchantId: payParams.merchantId,
            publicKey:payParams.publicKey,
        }

        let response = await new HttpManager().post(this.#createOrderUrl,header,requestParams,OPay.isSandBox,requestParams.country)
        return response
    }



    getCashierStatus = async (cashierParams)=>{
        let requestParams={
            country:cashierParams.countryCode.toUpperCase(),
            orderNo:cashierParams.orderNo,
            reference:cashierParams.reference
        }
        let publicKey = hmacSHA512(JSON.stringify(requestParams),cashierParams.privateKey).toString()
        let header = {
            merchantId : cashierParams.merchantId,
            publicKey : publicKey
        }
        let response = await new HttpManager().post(this.#cashierStatus,header,requestParams,OPay.isSandBox,requestParams.country)
        return response

    }
}

OPay.isSandBox=true;