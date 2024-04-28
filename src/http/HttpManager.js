import {isAndroid} from "../utils/AppUtil";
import AmanHttpResponse, {ResponseStatus} from "../model/AmanHttpResponse"


export default class HttpManager{
    #ngOrOtherSandBoxHostUrl="http://aman-checkout-backend-sandbox.mimocodes.com/api/v1";
    #ngOrOtherReleaseHostUrl="http://aman-checkout-backend-sandbox.mimocodes.com/api/v1";

    #sandBoxUrl =  "http://aman-checkout-backend-sandbox.mimocodes.com/api/v1";
    #releaseUrl = "http://aman-checkout-backend-sandbox.mimocodes.com/api/v1";

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
            "MerchantReference": requestHeader.merchantReference,
            "ClientSource":isAndroid?"AndroidSDK":"IOSSDK",
        }
        console.log(`URL：${url}`)
        console.log(`headers=${JSON.stringify(headers)}`)
        console.log(`data=${JSON.stringify(data)}`)
        let response = await fetch(url,{
            method:'post',
            headers:headers,
            body:JSON.stringify(data)
        })
        let aManHttpResponse = new AmanHttpResponse()
        if(response.status===200){
            let jsonData = await response.json()
            if(jsonData){
                if(jsonData.code==='00000'&&jsonData.data){
                    aManHttpResponse.status = ResponseStatus.success
                    aManHttpResponse.data = jsonData.data
                    aManHttpResponse.code = jsonData.code
                    aManHttpResponse.message=jsonData.message
                    return oPayHttpResponse
                }else{
                    aManHttpResponse.status = ResponseStatus.error
                    aManHttpResponse.data = null
                    aManHttpResponse.code = jsonData.code
                    aManHttpResponse.message=jsonData.message
                    return aManHttpResponse
                }
            } else{
                aManHttpResponse.status = ResponseStatus.error
                aManHttpResponse.data = null
                aManHttpResponse.code = 200
                aManHttpResponse.message="Network error"
                return aManHttpResponse
            }
        }
        aManHttpResponse.status = ResponseStatus.error
        aManHttpResponse.data = null
        aManHttpResponse.code = response.status
        aManHttpResponse.message="Network error"
        return aManHttpResponse
    }
}