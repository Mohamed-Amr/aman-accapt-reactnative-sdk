
class PayParams{
    publicKey
    merchantId
    merchantName;
    reference;
    countryCode = "EG"; // 国家码 大写
    payAmount=0;  // 支付金额
    currency; // 币种
    productName;
    productDescription;
    callbackUrl;
    //optional
    paymentType;// pay method
    expireAt; // expire time(unit: minutes)
    userClientIP;
    userInfo; //not must
}
