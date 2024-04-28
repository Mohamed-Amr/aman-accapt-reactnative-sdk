import React,{Fragment, PureComponent} from "react";
import WebView from "react-native-webview";
import {
    Alert,
    ProgressViewIOS,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Button,
    ProgressBarAndroid,
    ActivityIndicator,
    View,
    BackHandler
} from "react-native";
import OPay from "../pay/Opay";
import {ResponseStatus} from "../model/OPayHttpResponse";
import { LogBox } from 'react-native';
import {isAndroid,isIOS} from "opay-online-rn-sdk/src/utils/AppUtil";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class OPayPage extends PureComponent{

    constructor(props) {
        super(props);
        console.log(JSON.stringify(this.props))
        this.navigation = this.props.navigation
        const params = this.props.route.params;
        this.payParams = params.payParams;
        this.httpCallback= params.httpCallback;
        this.webPayCallback = params.webPayCallback;

        if(this.navigation){
            this.navigation.setOptions({
                headerShown:false
            })
        }
        this.state={
            url:'',
            webviewProgress:0,
        }
    }

    componentDidMount() {
        this.#crateOrder();
        isAndroid && BackHandler.addEventListener('hardwareBackPress',()=>{
            this.webPayCallback&&this.webPayCallback({
                orderStatus:"PENDING",
                orderNo:"",
                payNo:"",
                merchantId:"",
                merchantOrderNo:""
            })
        })
    }

    componentWillUnmount() {
        isAndroid && BackHandler.removeEventListener('hardwareBackPress')
    }

    render() {
        const {url,webviewProgress}=this.state;
        return <Fragment>
            <SafeAreaView>

                {
                    isIOS && url.length>0 && webviewProgress!=1 && <ProgressViewIOS
                        progressViewStyle={'bar'}
                        progress={webviewProgress}
                    />
                }
                {
                    isAndroid && url.length>0 &&  webviewProgress!=1 &&  <ProgressBarAndroid
                        styleAttr={'Horizontal'}
                        progress={webviewProgress}
                    />
                }

            </SafeAreaView>
            {
                url.length===0?
                    <View style={{flex:1,justifyContent: "center"}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                    :
                    <WebView
                        ref={ ref=>this.webview = ref}
                        style={{flex:1}}
                        source={{uri:url}}
                        onMessage={this.handleMessage}
                        onLoadStart={()=>{
                            this.setState({
                                webviewProgress:0
                            })
                        }}
                        onLoadProgress={({nativeEvent})=>{
                            this.setState({
                                webviewProgress:nativeEvent.progress
                            })
                        }}
                        onLoadEnd={()=>{}}
                        onError={
                            ()=>{}
                        }
                        renderError={()=>null}
                    />
            }

        </Fragment>
    }

    handleMessage=(event)=>{
        const message = event.nativeEvent.data;
        const h5Message = JSON.parse(message)
        this.webPayCallback && this.webPayCallback(h5Message)
        this.navigation && this.navigation.pop()
    }

    #crateOrder=()=>{
        new OPay().createOrder(this.payParams).then((response)=>{
            console.log(`result=${JSON.stringify(response)}`)
            if(response.status ===ResponseStatus.error){
                this.httpCallback && this.httpCallback(response)
                this.navigation && this.navigation.pop()
            }else{
                this.httpCallback && this.httpCallback(response)
                if(response.data.cashierUrl&&response.data.cashierUrl.length>0){
                    this.setState({
                        url:response.data.cashierUrl
                    })
                }else{
                    this.navigation && this.navigation.pop()
                }
            }
        })
    }

}