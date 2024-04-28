import {isAndroid} from "../utils/AppUtil";
import OPayHttpResponse, {ResponseStatus} from "../model/OPayHttpResponse"


export default class HttpManager{
    //尼日和其他地区的域名
    #ngOrOtherSandBoxHostUrl="https://testapi.opaycheckout.com";
    #ngOrOtherReleaseHostUrl="https://liveapi.opaycheckout.com";

    //埃及地区的域名
    #sandBoxUrl =  "https://sandboxapi.opaycheckout.com";
    #releaseUrl = "https://api.opaycheckout.com";

    #getHostUrl=(isDebug,countryCode)=>{
        if("EG"===countryCode){
            return isDebug ? this.#sandBoxUrl : this.#releaseUrl;
        }
        return isDebug ? this.#ngOrOtherSandBoxHostUrl : this.#ngOrOtherReleaseHostUrl;
    }

    post = async (url,requestHeader={},data={},isDebug,countryCode)=>{
        if(!url.startsWith("http")){
            url=this.#getHostUrl(isDebug,countryCode)+url;
        }
        let headers={
            "Content-Type":"application/json; utf-8",
            "Authorization":`Bearer ${requestHeader.publicKey}`,
            "MerchantId": requestHeader.merchantId,
            "ClientSource":isAndroid?"AndroidSDK":"IOSSDK",
        }
        console.log(`请求地址：${url}`)
        console.log(`headers=${JSON.stringify(headers)}`)
        console.log(`data=${JSON.stringify(data)}`)
        let response = await fetch(url,{
            method:'post',
            headers:headers,
            body:JSON.stringify(data)
        })
        let oPayHttpResponse = new OPayHttpResponse()
        if(response.status===200){
            let jsonData = await response.json()
            if(jsonData){
                if(jsonData.code==='00000'&&jsonData.data){
                    oPayHttpResponse.status = ResponseStatus.success
                    oPayHttpResponse.data = jsonData.data
                    oPayHttpResponse.code = jsonData.code
                    oPayHttpResponse.message=jsonData.message
                    return oPayHttpResponse
                }else{
                    oPayHttpResponse.status = ResponseStatus.error
                    oPayHttpResponse.data = null
                    oPayHttpResponse.code = jsonData.code
                    oPayHttpResponse.message=jsonData.message
                    return oPayHttpResponse
                }
            } else{
                oPayHttpResponse.status = ResponseStatus.error
                oPayHttpResponse.data = null
                oPayHttpResponse.code = 200
                oPayHttpResponse.message="Network error"
                return oPayHttpResponse
            }
        }
        oPayHttpResponse.status = ResponseStatus.error
        oPayHttpResponse.data = null
        oPayHttpResponse.code = response.status
        oPayHttpResponse.message="Network error"
        return oPayHttpResponse
    }
}