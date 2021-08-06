//scroll async    https://blog.logrocket.com/how-to-build-a-web-crawler-with-node/
//HISTORICAL DATA https://github.com/KevKipkemoi/nse_analysis/blob/master/data_scraper.py

import React,{useState,useEffect,useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  TextInput,
  View,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';

import
   {
      LineChart,
      BarChart,
      PieChart,
      ProgressChart,
      ContributionGraph,
      StackedBarChart
    } from 'react-native-chart-kit'

    import messaging from '@react-native-firebase/messaging';
    import auth from '@react-native-firebase/auth';
    import firestore from '@react-native-firebase/firestore';

    import database from '@react-native-firebase/database';
    const db=database();



const axios = require('axios');
const cheerio = require('cheerio');


import moment from 'moment';
import {Picker} from '@react-native-picker/picker';

const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CDS from './StockProcesses.js';

const getAccountCredentials=async()=>{

    try {
           let u=await AsyncStorage.getItem('userCredential');
           let credentialsJson=JSON.parse(u);
           return credentialsJson;
       }
    catch(e) {
      // read error
     }

}




function Message({navigation})
 {

    const [messages,SetMessages]=useState([]);


      useEffect(()=>{
           retrieveMessages();
      });

    const retrieveMessages=async()=>{
          let u=await AsyncStorage.getItem('userCredential');
          let userObject=JSON.parse(u);
          const userId=userObject['user']['uid'];



          db.ref('/Messages').orderByChild('userId').equalTo(userId)
          .once("value").then(querySnapShot=> {

                      let data = querySnapShot.val() ? querySnapShot.val() : {};
                      if (data!==undefined)
                          {
                                  let dataEntries=[];
                                  Object.keys(data).forEach(function(key){
                                         let eArr=data[key];
                                         eArr['docid']=key;
                                         dataEntries.push(eArr);

                                  });

                                SetMessages(dataEntries);

                          }
                      else
                        {
                            SetMessages([]);
                        }
              }).catch(error => {

                    SetMessages([]);
              });

     }

   return(<View style={[styles.container,{justifyContent:'flex-start'}]}>
              <TouchableOpacity onPress={()=>navigation.navigate('login')}
                      style={{alignSelf:'flex-end',height:30}}
                    >
                  <Ionicons name='ios-log-out'  color="#eee" size={28} style={{}}/>
              </TouchableOpacity>
             <View>
                  <Text style={{paddingVertical:12,color:'#FE9950',width:width-20,fontSize:18}}>My Messages </Text>
             </View>
              { messages.length>0?
                     <ScrollView>
                     {
                        <View style={{height:height*.78,width:width}}>
                              {
                                messages.map((item,i)=>
                                {
                                  return  <TouchableOpacity
                                                 key={Math.random().toString(36).substr(2, 9)}
                                                 style={[styles.notification,{width:width-10,marginTop:10,flexDirection:'row',justifyContent:'space-between',paddingVertical:10,paddingHorizontal:20}]} >
                                          <View>
                                              <Text style={{alignSelf:'flex-end',paddingHorizontal:20}}>~ {item.time}</Text>
                                              <Text style={{fontSize:18}}>{item.topic}</Text>
                                              <Text style={{marginTop:10}}>{item.message}</Text>
                                          </View>
                                          <View style={{paddingVertical:5}}>
                                              <Ionicons name='ios-close-circle' size={17}/>
                                          </View>
                                    </TouchableOpacity>
                                })
                             }
                       </View>
                    }
                 </ScrollView>
                :<View><Text style={{color:'#eee'}}>You Currently Have No Messages</Text></View>
             }
          </View>);


 }




const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      padding:10,
      useShadowColorFromDataset: false // optional
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////stocks////


 function Stocks({navigation})
  {

      useEffect(()=>{
          getNSEDATA();
          GetMyStocks();
      });

    const getNSEDATA=async()=>{
       //console.log('loading records....!!!!');
      try{
            const doc= await fetch('https://www.nse.co.ke');
            const responseData = await doc.text();
                    //console.log(responseData);

             var $ = cheerio.load(responseData);
             var ticker=$('#mainAct2');
             const companies=$('.itemt'); //.itemt, .itemr, .changediv

             let tiArray=[];
             let labels=[];
             let changes=[];
             let highlights=[];
             let gainers=[];
             let losers=[];

             $(companies).each(function(i,elem){
                    let company=$(elem).text();
                    let rate=$(elem).siblings('.itemr').text();
                    let change=$(elem).siblings('[valign=middle]').children('.changediv').find('.dchange').text() || $(elem).siblings('[valign=middle]').children('.changediv').find('.uchange').text();

                    String(change)[0]=='+'?gainers.push(`${company} ${change}`): losers.push(`${company} ${change}`);

                   tiArray.push({id:Math.random().toString(36).substr(2, 9),company:company,rate:rate,change:change});

                    labels.push(company);
                    let changeq=parseFloat(change.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));
                    changes.push(rate)
                    let notice=company+" "+rate+" "+change;
                    highlights.push(notice);
             });



                              SetLabels(labels);
                              SetValues(changes);

                            //  SetGainers(gainers);
                              //SetLosers(losers);


        }
        catch(err)
        {
           alert('error! '+err);
        }


    }



     const [ ongoingTransaction,SetongoingTransaction] =useState(false);
     const [ transactiontype,Setransactiontype] =useState("");
     const [values,SetValues] =useState([]);
     const [labels,SetLabels] =useState([]);
     const [mystocks,Setmystocks]=useState([]);
     const [balance,Setbalance]=useState([]);

      const data = {
          labels: labels,
          datasets: [
            {
              data: values
            }
          ]
     };

const purchaseStocks=async(data)=>{
    let value=data.value*data.units;

    if(value>balance)
    {
        ToastAndroid.showWithGravity(
             `Transaction failed! Please top up your account to a minimum of ${value}`,
             ToastAndroid.SHORT,
             ToastAndroid.CENTER
       );
        return
    }
    else{
          let mybalance=balance-value;

          let u=await AsyncStorage.getItem('userCredential');
          let userObject=JSON.parse(u);
          const userId=userObject['user']['uid'];

          db.ref('/MyShares')
         .push({userId:userId,company:data.company,values:data.value,units:data.units});

         db.ref(`/Balance/${userId}`)
        .set({userId:this.user_id,balance:mybalance,time:moment().format('DD-MM-Y HH:mm:ss')})
         ToastAndroid.showWithGravity(
              `Transaction Successful! ${value}`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
        );

        db.ref('/Transactions')
          .push({owner:userId,type:'Shares Acquired ',paymentOption:'IN APP',amount:data.value,time:moment().format('DD-MM-Y HH:mm:ss')})
          .then(() => console.log());

          db.ref('/Messages')
          .push({userId:this.user_id,topic:'Shares purchased',message:`${data.units} @ ${data.value} `,time:moment().format('DD-MM-Y HH:mm:ss')})
          .then(() => console.log());


    }
}



const sellStocks=async(data)=>{
    let value=data.value*data.units;


          let mybalance=balance+value;

          let u=await AsyncStorage.getItem('userCredential');
          let userObject=JSON.parse(u);
          const userId=userObject['user']['uid'];

          db.ref(`/MyShares/${docid}`).remove();

         db.ref(`/Balance/${userId}`)
        .set({userId:this.userId,balance:mybalance,time:moment().format('DD-MM-Y HH:mm:ss')})
         ToastAndroid.showWithGravity(
              `Transaction Successful! ${value}`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
        );

        db.ref('/Transactions')
          .push({owner:userId,type:'Shares sold ',paymentOption:'IN APP',amount:data.value,time:moment().format('DD-MM-Y HH:mm:ss')})
          .then(() => console.log());

          db.ref('/Messages')
          .push({userId:this.user_id,topic:'Shares purchased',message:`${data.units} @ ${data.value} `,time:moment().format('DD-MM-Y HH:mm:ss')})
          .then(() => console.log());



}





  const GetMyStocks=async()=>{

    let u=await AsyncStorage.getItem('userCredential');
    let credentialsJson=JSON.parse(u);
    let userId= await credentialsJson['user']['uid'];


    db.ref('/MyShares').orderByChild('userId').equalTo(userId)
    .once("value").then(querySnapShot=> {

                let data = querySnapShot.val() ? querySnapShot.val() : {};
                if (data!==undefined)
                    {
                            let dataEntries=[];
                            Object.keys(data).forEach(function(key){
                                   let eArr=data[key];
                                   eArr['docid']=key;
                                   dataEntries.push(eArr);

                            });

                          Setmystocks(dataEntries);
                    }
                else
                  {
                      Setmystocks([]);
                  }
        }).catch(error => {

              SetMessages([]);
        });

  }
  const stockTransaction=(type)=>{

    if(values.length>0)
      {
         SetongoingTransaction(true);
         Setransactiontype(type);
     }
     else{
             ToastAndroid.showWithGravity(
                  "No Listings Loaded yet! Please check your connection!",
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
            );
        }

  }


    return(<View style={styles.container}>
                { ongoingTransaction==true?
                  <View style={{width:width-10}}>
                  <TouchableOpacity
                      style={{paddingVertical:17}}
                      onPress={()=>SetongoingTransaction(false)}>
                        <Ionicons name='ios-arrow-back' color="tomato" size={26}/>
                  </TouchableOpacity>
                  <ScrollView>
                      {
                        transactiontype=='buy'?
                              labels.map((item,i)=>{
                                 return<View key={Math.random().toString(36).substr(2, 9)}
                                 style={{width:width,flexDirection:'row',justifyContent:'space-around',margin:4,backgroundColor:'#fff'}}>
                                            <Text>{item}</Text>
                                            <Text>{values[i]}</Text>
                                            <TouchableOpacity
                                                  onPress={()=>purchaseStocks({company:item,value:values[i],units:1})}
                                                  style={{backgroundColor:'#39C87A',
                                                        width:90,padding:10,flexDirection:'row',justifyContent:'space-around',borderRadius:4,margin:4}}
                                                  >
                                                  <Text style={{color:'#eee'}}>buy</Text>
                                                  <Ionicons name='ios-arrow-forward' size={18} color="#fff"/>
                                            </TouchableOpacity>
                                       </View>
                              })
                          :
                                mystocks.map((item,i)=>{
                                   return<View key={item.docid}
                                   style={{width:width,flexDirection:'row',justifyContent:'space-around',margin:4,backgroundColor:'#fff'}}>
                                              <Text>{item}</Text>
                                              <Text>{values[i]}</Text>
                                              <TouchableOpacity
                                                    onPress={()=>sellStocks({company:item,value:values[i],units:1,item:item.docid})}
                                                    style={{backgroundColor:'#C24B3D',
                                                          width:90,padding:10,flexDirection:'row',justifyContent:'space-around',borderRadius:4,margin:4}}
                                                    >
                                                    <Text style={{color:'#eee'}}>sell</Text>
                                                    <Ionicons name='ios-arrow-forward' size={18} color="#fff"/>
                                              </TouchableOpacity>
                                         </View>
                                })

                      }
                  </ScrollView>
                  </View>
                  :
                 <View style={{width:width,alignSelf:'center',marginBottom:10,paddingVertical:10}}>
                      <Text style={{color:'#eee',fontSize:14,paddingHorizontal:16,paddingVertical:6}}>Stock Listings</Text>
                      <TouchableOpacity onPress={()=>navigation.navigate('login')}
                                      style={{width:'100%',alignSelf:'flex-end',height:30,paddingHorizontal:10,paddingVertical:50}}
                                        >
                                      <Ionicons name='ios-log-out'  color="#eee" size={25} style={{paddingHorizontal:10}}/>
                              </TouchableOpacity>
                         {values.length>0?
                          <BarChart
                              style={{padding:10}}
                              data={data}
                              width={width-6}
                              height={height*.30}
                              yAxisLabel=""
                              chartConfig={chartConfig}
                              verticalLabelRotation={30}
                           />
                           :
                           <View>
                              <ActivityIndicator
                                 color = 'green'
                                 size = "large"
                                 style = {styles.activityIndicator}/>
                                 <Text style={{color:'#eee',alignSelf:'center'}}>Loading listings.......</Text>
                            </View>
                          }

                        <View style={{padding:18,height:80,flexDirection:'row',paddingVertical:10,margin:34}}>
                                                  <TouchableOpacity
                                                            onPress={()=>stockTransaction('buy')}
                                                            style={[styles.purchase,{backgroundColor:'#39C87A'}]}>
                                                            <Text style={[styles.funclabel,{alignSelf:'center'}]}>Buy</Text>
                                                  </TouchableOpacity>

                                                  <TouchableOpacity
                                                              onPress={()=>stockTransaction('sell')}
                                                            style={[styles.purchase,{backgroundColor:'#C24B3D'}]}>
                                                            <Text style={styles.funclabel}>sell</Text>
                                                  </TouchableOpacity>
                        </View>


                  <View style={{width:width,height:(height/3),paddingVertical:10}}>
                      <Text style={{color:'#fff',fontSize:16,paddingHorizontal:14,paddingVertical:8}}>My Stocks</Text>
                      {mystocks.length>0?
                         <ScrollView>
                             { mystocks.map((item,i)=>{

                                  return <TouchableOpacity
                                            key={item.docid}
                                            style={[styles.transactions,{flexDirection:'row',justifyContent:'space-between'}]}
                                            >
                                               <View style={{width:'50%'}}>
                                                     <Text>{item.company}</Text>
                                                     <Text style={{marginLeft:5}}>{item.units}</Text>
                                                </View>

                                     </TouchableOpacity>
                              })
                            }
                         </ScrollView>
                        :
                      <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#eee'}}>
                              <Text style={{color:'tomato'}}><Ionicons name='ios-information' size={18} color="tomato"/>You have not purchased any shares</Text>
                     </View>
                      }
                  </View>
              </View>
               }
            </View>);
  }






function Wallet({navigation})
{


    const [transactionloading,SetTransactionLoading] =useState(false);
    const [activetransaction,SetActiveTransaction] =useState("");
    const [amount,setAmount] =useState(0);
    const [paymethod, Setpaymethod] = useState();
    const [accountdetail, Setaccountdetail] = useState("");
    const [balance,SetBalance] =useState(0);


    useEffect(()=>{
        queryBalance();
    });


    const getAccountCredentials=async()=>{

        try {
               let u=await AsyncStorage.getItem('userCredential');
               let credentialsJson=JSON.parse(u);
               return credentialsJson;
           }
        catch(e) {
          // read error
         }

    }



     const queryBalance=async()=>{
           let u=await AsyncStorage.getItem('userCredential');
           let credentialsJson=JSON.parse(u);
           let userId= await credentialsJson['user']['uid'];

                 db.ref(`/Balance/${userId}`)
                 .once("value").then(querySnapShot=> {
                             //
                             if (querySnapShot.exists())
                                 {
                                       let data = querySnapShot.val() ? querySnapShot.val() : {};
                                       let dataEntries=[];
                                       Object.keys(data).forEach(function(key){
                                              let eArr=data[key];
                                              eArr['docid']=key;
                                              dataEntries.push(eArr);

                                       });

                                       let balance=dataEntries[0].balance;
                                       SetBalance(parseInt(balance));


                                 }
                             else
                               {
                                  db.ref(`/Balance/${userId}`)
                                  .set({userId:userId,balance:'0',time:moment().format('DD-MM-Y HH:mm:ss')})
                                   SetBalance(0);



                               }
                     }).catch(error => {
                         console.log("error::  "+error)

                     });

       }

    function setStatus(type)
      {
          SetTransactionLoading(true);
          SetActiveTransaction(type);
      }

const walletStyles=StyleSheet.create({
  textInput:{
    borderColor:'#f7f7f7',
    borderWidth:0.5,
    borderRadius:2,
    color:'#eee',
    alignContent:'center',
    width:'75%',
    marginTop:18,
    paddingHorizontal:8
  }
});






const pickerRef = useRef();

function open() {
    pickerRef.current.focus();
}

function close() {
    pickerRef.current.blur();
}

const getUser=async()=>{

     let u=await AsyncStorage.getItem('userCredential');
     let credentialsJson=JSON.parse(u);
     let userId= credentialsJson['user']['uid'];

     let cds= new CDS(userId);
     let messages=cds.loadMessages();
     GetMessages(messages);

 }



const depositFunds=async() =>{

    if(amount=="")
          {
                ToastAndroid.showWithGravity(
                     "You have not entered the amount to be deposited!",
                     ToastAndroid.SHORT,
                     ToastAndroid.CENTER
               );
               return;
          }
    else if(paymethod=="")
        {
              ToastAndroid.showWithGravity(
                   "You have not selected the payment method!",
                   ToastAndroid.SHORT,
                   ToastAndroid.CENTER
             );
             return;
        }
    else{

              let u=await AsyncStorage.getItem('userCredential');
              let userObject=JSON.parse(u);
              const userId=String(userObject['user']['uid']);


               let paydict={owner:userId,type:'DEPOSIT',paymentOption:paymethod,amount:amount,time:moment().format('DD-MM-Y HH:mm:ss')}
               depositVal(paydict);
               setAmount('');
               Setpaymethod('');
               function depositVal(data)
               {


                             try
                               {
                                   let mybal=balance;
                                   let new_balance=mybal+data.amount;
                                   console.log('user is id:: '+userId);
                                   db.ref(`/Balance/${userId}`)
                                   .set({userId:userId,balance:new_balance,time:moment().format('DD-MM-Y HH:mm:ss')});

                                   db.ref('/Transactions')
                                   .push(data)
                                   .then(() => console.log());

                                   db.ref('/Messages')
                                   .push({userId:userId,topic:'Funds Deposit',message:`Deposited the amount ${data.amount}`,time:moment().format('DD-MM-Y HH:mm:ss')})
                                   .then(() => console.log());

                                    ToastAndroid.showWithGravity(
                                         "Payments Processed successfully!!",
                                         ToastAndroid.SHORT,
                                         ToastAndroid.CENTER
                                        );
                              }
                           catch(err){

                                  alert('error  '+err);
                            }

               }



              SetTransactionLoading(false);
               SetActiveTransaction("");
       }


}



const addPaymentOption=async() =>{


  ////accountdetail

    if(paymethod=="")
          {
                ToastAndroid.showWithGravity(
                     "Please add account information!",
                     ToastAndroid.SHORT,
                     ToastAndroid.CENTER
               );
               return;
          }
    else if(accountdetail=="")
        {
              ToastAndroid.showWithGravity(
                   "You have not selected the payment method!",
                   ToastAndroid.SHORT,
                   ToastAndroid.CENTER
             );
             return;
        }
    else
      {

                let u=await AsyncStorage.getItem('userCredential');
                let userObject=JSON.parse(u);
                const userId=userObject['user']['uid'];

                db.ref('/PaymentGateway')
               .push({userId:userId,title:paymethod,accountNumber:accountdetail})

                ToastAndroid.showWithGravity(
                     "Payment Gateway Added Successfully!",
                     ToastAndroid.SHORT,
                     ToastAndroid.CENTER
               );;

                SetTransactionLoading(false);
                SetActiveTransaction("");
       }


}




async function getAccountCred(){

    try {
           let u=await AsyncStorage.getItem('userCredential');
           let credentialsJson=JSON.parse(u);
           return credentialsJson;
       }
    catch(e) {
      // read error
     }

}






//
const withdrawFunds=async() =>{

    if(amount=="")
          {
                ToastAndroid.showWithGravity(
                     "You have not entered the amount to be withdrawn!",
                     ToastAndroid.SHORT,
                     ToastAndroid.CENTER
               );
               return;
          }
    else if(paymethod=="")
        {
              ToastAndroid.showWithGravity(
                   "You have not selected the payment method!",
                   ToastAndroid.SHORT,
                   ToastAndroid.CENTER
             );
             return;
        }
    else{

              let u=await AsyncStorage.getItem('userCredential');
              let userObject=JSON.parse(u);
              const userId=userObject['user']['uid'];

               let paydict={owner:userId,type:'WITHDRAWAL',paymentOption:paymethod,amount:amount,time:moment().format('DD-MM-Y HH:mm:ss')}
               withdrawVal(paydict);
               setAmount('');
               Setpaymethod('');



function withdrawVal(data)
{
  const accountMinimum=2550;
  let validbalance=balance-accountMinimum;
  let deductablebalance=validbalance>0?validbalance:parseFloat(validbalance)*-1
  if(deductablebalance<data.amount)
      {
        alert(`transaction failed, the least you can withdraw is  ${deductablebalance}. Account cushion [ KES ${accountMinimum} ] applies `);
      }
  else
    {
              let balance=balance-data.amount;
              try
                {
                    db.ref(`/Balance/${userId}`).set({userId:userId,balance:balance,time:moment().format('DD-MM-Y HH:mm:ss')});
                    db.ref('/Transactions')
                      .push(data)
                      .then(() => console.log());

                      db.ref('/Messages')
                      .push({userId:userId,topic:'Funds Withdrawal',message:`KES ${data.amount} withdrawn`,time:moment().format('DD-MM-Y HH:mm:ss')})
                      .then(() => console.log());

                      ToastAndroid.showWithGravity(
                           "Funds Processed successfully!!",
                           ToastAndroid.SHORT,
                           ToastAndroid.CENTER
                          );

                  return {success:'Successful'};
               }
            catch(err){
                 alert('transaction failed, please check your conection '+err);
             }

    }

}



              SetTransactionLoading(false);
               SetActiveTransaction("");
       }


}










    const beginTransaction=()=>{
      if(activetransaction=='deposit')
          {
              return<View style={styles.container}>
                         <View style={{position:'absolute',top:10,width:width-40}}>
                              <TouchableOpacity
                                    style={{paddingVertical:26,alignSelf:'flex-start',paddingHorizontal:15}}
                                    onPress={()=>SetTransactionLoading(false)}
                                    >
                                   <Ionicons name='ios-chevron-back' size={27} color="tomato" />
                              </TouchableOpacity>
                          </View>
                          <Text style={{fontSize:19,color:'#eee'}}>Funds Deposit</Text>

                          <TextInput
                               label="Email"
                               autoCompleteType="email"
                               placeholder="Amount to Deposit"
                               selectionTextColor='#DE3C29'
                               placeholderTextColor="#eee"
                               style={walletStyles.textInput}
                               onChangeText={text => setAmount(text)}

                           />

                          <View style={{width:width-120,}}>
                               <Text style={{color:'#eee',marginTop:20}}> -- Select A Payment Method -- </Text>
                               <View style={{backgroundColor:'tomato',marginTop:8}}>
                                   <Picker
                                        style={{color:'#eee',borderColor:'#f7f7f7',borderRadius:16}}
                                        ref={pickerRef}
                                         selectedValue={paymethod}
                                         onValueChange={(itemValue, itemIndex) =>
                                           Setpaymethod(itemValue)
                                         }>
                                         <Picker.Item label="-- Select --" value="" />
                                         <Picker.Item label="MPESA" value="MPESA" />
                                         <Picker.Item label="PAYPAL" value="PAYPAL" />
                                         <Picker.Item label="BITCOIN" value="BITCOIN" />
                                   </Picker>
                               </View>
                           </View>
                          <TouchableOpacity
                                 style={{width:140,backgroundColor:'#eee',padding:9,borderRadius:19,marginTop:18}}
                                 onPress={()=>depositFunds()}
                                >
                              <Text style={{alignSelf:'center'}}>Continue <Ionicons name='ios-chevron-forward' size={15}  color="#000"  style={{paddingHorizontal:30}}/></Text>
                          </TouchableOpacity>
                    </View>

            }

            if(activetransaction=='withdraw')
                {
                    return<View style={styles.container}>
                                <View style={{position:'absolute',top:10,width:width-40}}>
                                     <TouchableOpacity
                                           style={{paddingVertical:26,alignSelf:'flex-start',paddingHorizontal:15}}
                                           onPress={()=>SetTransactionLoading(false)}
                                           >
                                          <Ionicons name='ios-chevron-back' size={27} color="tomato" />
                                     </TouchableOpacity>
                                </View>

                                <Text style={{fontSize:19,color:'#eee'}}>Funds Withdrawals</Text>
                                <TextInput
                                     label="Email"
                                     autoCompleteType="email"
                                     placeholder="Amount to Withdraw"
                                     selectionTextColor='#DE3C29'
                                     placeholderTextColor="#eee"
                                     style={walletStyles.textInput}
                                     onChangeText={text => setAmount(text)}

                                 />

                                <View style={{width:width-120,}}>
                                     <Text style={{color:'#eee',marginTop:20}}> -- Select A Payment Method -- </Text>
                                     <View style={{backgroundColor:'tomato',marginTop:8}}>
                                         <Picker
                                              style={{color:'#eee',borderColor:'#f7f7f7',borderRadius:16}}
                                              ref={pickerRef}
                                               selectedValue={paymethod}
                                               onValueChange={(itemValue, itemIndex) =>
                                                 Setpaymethod(itemValue)
                                               }>
                                               <Picker.Item label="-- Select --" value="" />
                                               <Picker.Item label="MPESA" value="MPESA" />
                                               <Picker.Item label="PAYPAL" value="PAYPAL" />
                                               <Picker.Item label="BITCOIN" value="BITCOIN" />
                                         </Picker>
                                     </View>
                                 </View>
                                <TouchableOpacity
                                       style={{width:140,backgroundColor:'#eee',padding:9,borderRadius:19,marginTop:18}}
                                       onPress={()=>withdrawFunds()}
                                      >
                                    <Text style={{alignSelf:'center'}}>Continue <Ionicons name='ios-chevron-forward' size={15}  color="#000"  style={{paddingHorizontal:30}}/></Text>
                                </TouchableOpacity>
                          </View>

                     }

                  else if(activetransaction=='addGateway')
                      {
                          return<View style={styles.container}>
                                      <View style={{position:'absolute',top:10,width:width-40}}>
                                           <TouchableOpacity
                                                 style={{paddingVertical:26,alignSelf:'flex-start',paddingHorizontal:15}}
                                                 onPress={()=>SetTransactionLoading(false)}
                                                 >
                                                <Ionicons name='ios-chevron-back' size={27} color="tomato" />
                                           </TouchableOpacity>
                                      </View>

                                      <Text style={{fontSize:19,color:'#eee'}}>Add A New Payment Gateway</Text>


                                      <View style={{width:width-120,}}>
                                           <Text style={{color:'#eee',marginTop:20}}> -- Select A Payment Method -- </Text>
                                           <View style={{backgroundColor:'tomato',marginTop:8}}>
                                               <Picker
                                                    style={{color:'#eee',borderColor:'#f7f7f7',borderRadius:16}}
                                                    ref={pickerRef}
                                                     selectedValue={paymethod}
                                                     onValueChange={(itemValue, itemIndex) =>
                                                       Setpaymethod(itemValue)
                                                     }>
                                                     <Picker.Item label="-- Select --" value="" />
                                                     <Picker.Item label="MPESA" value="MPESA" />
                                                     <Picker.Item label="PAYPAL" value="PAYPAL" />
                                                     <Picker.Item label="BITCOIN" value="BITCOIN" />
                                               </Picker>
                                           </View>
                                       </View>
                                       <TextInput
                                            label="Account Details"
                                            autoCompleteType="email"
                                            placeholder="Account, Wallet, or Phone Number number"
                                            selectionTextColor='#DE3C29'
                                            placeholderTextColor="#eee"
                                            style={walletStyles.textInput}
                                            onChangeText={text => Setaccountdetail(text)}

                                        />
                                      <TouchableOpacity
                                               style={{width:140,backgroundColor:'#eee',padding:9,borderRadius:19,marginTop:18}}
                                               onPress={()=>addPaymentOption()}
                                              >
                                            <Text style={{alignSelf:'center'}}>
                                                <Ionicons name='ios-add' size={15}  color="#000"  style={{paddingHorizontal:30}}/>
                                               Add Option
                                            </Text>
                                      </TouchableOpacity>
                                </View>

                        }

    }





    return(<View style={styles.container}>
                                          <TouchableOpacity onPress={()=>navigation.navigate('login')}
                                                  style={{alignSelf:'flex-end'}}
                                                >
                                              <Ionicons name='ios-log-out'  color="#eee" size={28} style={{}}/>
                                          </TouchableOpacity>
                {transactionloading==true?beginTransaction():
                <View>
                    <Text style={{color:'#eee',fontSize:20,margin:10,alignSelf:'center'}}>My Funds </Text>
                    <View style={{alignSelf:'center',marginTop:30,width:'60%',height:100,borderRadius:5,height:100,padding:15,paddingVertical:20,justifyContent:'center',backgroundColor:'#ced6c0'}}>
                          <Text style={{fontSize:16,alignSelf:'center'}}>My Balance</Text>
                          <Text style={{fontSize:27,margin:10,color:'#ff8753',alignSelf:'center',fontSize:19}}>KES {balance}</Text>
                    </View>
                    <View style={{width:width-20,height:height/2,marginTop:60}}>
                                                      <TouchableOpacity
                                                            onPress={()=>setStatus('deposit') }
                                                            style={styles.funcitem}>
                                                            <Text style={styles.funclabel}>
                                                            <Ionicons name='ios-cloud-upload' size={19} color="#fff"/>
                                                              Load Funds</Text>
                                                      </TouchableOpacity>


                                                      <TouchableOpacity
                                                              onPress={()=>setStatus('addGateway') }
                                                              style={styles.funcitem}>
                                                             <Text style={styles.funclabel}>
                                                             <Ionicons name='ios-add-circle-outline' size={19} color="#fff"/> Payment Option</Text>
                                                      </TouchableOpacity>

                                                      <TouchableOpacity
                                                              onPress={()=>setStatus('withdraw') }
                                                              style={styles.funcitem}
                                                            >
                                                            <Text style={styles.funclabel}><Ionicons name='ios-cloud-download' size={19} color="#fff"/> Withdraw</Text>
                                                      </TouchableOpacity>
                    </View>
              </View>
              }
          </View>);
}






 class Profile extends React.Component{

   constructor(props)
    {
          super(props);
          this.state={apidata:'loading',tickers:[],highlights:"",credentials:null,balance:0,firstname:'',fullname:'',user_id:'',transactions:[]};
    }



    async componentDidMount()
    {

         await this.getUser();
         let account=new CDS(this.state.user_id);
         this.showBalance();
         await this.getTransactions();


      }

showBalance=async()=>
{



  let u=await AsyncStorage.getItem('userCredential');
  let credentialsJson=JSON.parse(u);
  let userId= await credentialsJson['user']['uid'];

        db.ref(`/Balance/${userId}`)
        .once("value").then(querySnapShot=> {
                    //
                    if (querySnapShot.exists())
                        {
                              let data = querySnapShot.val() ? querySnapShot.val() : {};
                              let dataEntries=[];
                              Object.keys(data).forEach(function(key){
                                     let eArr=data[key];
                                     eArr['docid']=key;
                                     dataEntries.push(eArr);

                              });

                              let balance=dataEntries[0].balance;
                              this.setState({balance:parseInt(balance)});

                        }
                    else
                      {
                          db.ref(`/Balance/${userId}`)
                         .set({userId:userId,balance:0,time:moment().format('DD-MM-Y HH:mm:ss')})
                          this.setState({balance:0});


                      }
            }).catch(error => {
                console.log("error::  "+error)

            });



}

    getTransactions=()=>{

          db.ref('/Transactions').orderByChild('owner').equalTo(this.state.user_id)
          .once("value").then(querySnapShot=> {

                      let data = querySnapShot.val() ? querySnapShot.val() : {};
                      if (data!==undefined)
                          {
                                  let dataEntries=[];
                                  Object.keys(data).forEach(function(key){
                                         let eArr=data[key];
                                         eArr['docid']=key;
                                         dataEntries.push(eArr);

                                  });

                                this.setState({transactions:dataEntries});

                          }
                      else
                        {
                            this.setState({transactions:[]});
                        }
              }).catch(error => {

                    this.setState({transactions:[]});
              });


    }


  getUser=async()=>{
        try {

               let credentials=await AsyncStorage.getItem('userCredential');
               let credentialsJson=JSON.parse(credentials);
               this.setState({firstname:credentialsJson.user.displayName.split(' ')[0],fullname:credentialsJson.user.displayName,user_id:credentialsJson.user.uid});

           } catch(e)
           {
              //console.log('--------error-----------------   '+e);
           }

    }


   render()
    {

        return(<View style={styles.container}>
                    <View style={{paddingHorizontal:2,width:width-10,height:90,flexDirection:'row',justifyContent:'space-between'}}>
                           <View>
                                <Text style={{color:'#fff',fontSize:15,marginLeft:3}}>My Profile</Text>
                           </View>
                           <View style={{flexDirection:'row'}}>
                               <Ionicons name='ios-person-circle-outline'  color="#eee" size={30} style={{marginRight:12}}/>
                              <Text style={{color:'#fff',fontSize:12,marginTop:8}}>Hello, {this.state.firstname}</Text>
                          </View>
                          <TouchableOpacity onPress={()=>this.props.navigation.navigate('login')}>
                              <Ionicons name='ios-log-out'  color="#eee" size={28} style={{}}/>
                          </TouchableOpacity>
                    </View>
                    <View style={{marginTop:16,width:'100%',borderRadius:5,height:80,padding:15,paddingVertical:20,justifyContent:'center',backgroundColor:'#ced6c0'}}>
                        <Text style={{fontSize:16,alignSelf:'center'}}>My Balance</Text>
                        <Text style={{fontSize:27,margin:10,color:'#ff8753',alignSelf:'center',fontSize:19}}>KES {this.state.balance}</Text>
                    </View>

                    <Text style={{width:width-20,paddingVertical:4,paddingHorizontal:20,color:'#eee',fontSize:19,alignSelf:'flex-start'}}>My Account </Text>
                    <View style={{width:width-10,height:90,justifyContent:'space-around',flexDirection:'row',paddingVertical:10}}>
                          <Text style={{color:'#eee'}}>Name: {this.state.fullname}</Text>
                          <Text style={{color:'#eee'}}>Account: DELUXE</Text>
                    </View>

                    <TouchableOpacity
                            style={{backgroundColor:'#56D7A3',padding:9,borderRadius:6}}
                            >
                            <Text style={{color:'#eee'}}>Upgrade</Text>
                    </TouchableOpacity>

                    <View style={{width:width,height:height/3,padding:12}}>
                        <Text style={{color:'#eee',fontSize:20,paddingVertical:4}}>Transactions</Text>
                        { this.state.transactions.length>0?

                              <View>
                                <ScrollView>
                                {  this.state.transactions.map((item,i)=>
                                    {
                                         if(item.paymentOption=='MPESA')
                                              {
                                               return <TouchableOpacity
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                    style={styles.transactions}>
                                                    <Image source={require('.././pics/mpesa.png')}  style={{height:30,width:50,borderRadius:4}} />
                                                    {item.type=='DEPOSIT'?<Text style={{marginLeft:20,color:'#3FDF06'}}>+ KES ({item.amount})</Text>:
                                                     <Text style={{marginLeft:20,color:'#DF1A06'}}>- KES ({item.amount})</Text>
                                                     }
                                                    <Text style={{marginLeft:20,color:'#eee'}}>{item.time}</Text>
                                               </TouchableOpacity>
                                              }


                                        if(item.paymentOption=='BITCOIN')
                                        {
                                            return <TouchableOpacity
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                   style={styles.transactions}>
                                                  <Ionicons name='logo-bitcoin' size={24}  color="#eee" />
                                                  {item.type=='DEPOSIT'?<Text style={{marginLeft:20,color:'#3FDF06'}}>+ KES ({item.amount})</Text>:
                                                   <Text style={{marginLeft:20,color:'#DF1A06'}}>- KES ({item.amount})</Text>
                                                   }
                                                  <Text style={{marginLeft:20,color:'#eee'}}>{item.time}</Text>
                                             </TouchableOpacity>
                                         }

                                      if(item.paymentOption=='PAYPAL')
                                          {
                                             return <TouchableOpacity
                                                    key={Math.random().toString(36).substr(2, 9)}
                                                   style={styles.transactions}>
                                                  <FontAwesome name='paypal' size={24}  color="#eee" />
                                                  {item.type=='DEPOSIT'?<Text style={{marginLeft:20,color:'#3FDF06'}}>+ KES ({item.amount})</Text>:
                                                   <Text style={{marginLeft:20,color:'#DF1A06'}}>- KES ({item.amount})</Text>
                                                   }
                                                  <Text style={{marginLeft:20,color:'#eee'}}>{item.time} </Text>
                                             </TouchableOpacity>

                                          }
                                     })
                                 }
                              </ScrollView>
                            </View>:
                            <View style={{width:width-30,marginTop:20,backgroundColor:'#eee',padding:5,paddingVertical:15}}><Text style={{alignSelf:'center',fontSize:16}}>You have made no transactions!</Text></View>
                          }
                    </View>
            </View>);
    }

}

const styles=StyleSheet.create({
  container:{
    flex:1,
    height:height,
    width:width,
    //backgroundColor:'#e7e7e9',
    backgroundColor:'#303846',
    justifyContent:'center',
    alignItems:'center',
    padding:10,
  },
  notification:{
          backgroundColor:"#f2f9ff",
          padding:8,
          width:70,
          alignSelf:'center',
          borderRadius:9,

            shadowColor: "#000",
            shadowOffset: {
            width: 0,
            height: 5,
          },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation:9,
  },
  transactions:
    {width:width-20,
      borderRadius:2,flexDirection:'row',
      padding:12,
      backgroundColor:'#939EB9',
      marginTop:10,
    },
    funcitem:{
        padding:15,
        width:160,
        margin:10,
        backgroundColor:'#62bdff',
        borderRadius:5
      },
    purchase:{
        padding:6,
        width:90,
        height:40,
        margin:10,
        marginTop:68,
        borderRadius:5
      },
funclabel:{
  color:'#f1f1f1'
}
});







const Tab = createBottomTabNavigator();
export default function  Tabs() {

      return (
            <Tab.Navigator
              initialRouteName="profile"
              tabBarOptions={{
                activeTintColor:'#06AADF',
              }}
            >
                  <Tab.Screen
                    name="profile"
                    component={Profile}
                    options={{
                      tabBarLabel: 'profile',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-person-outline" color={color} size={size} />
                      ),
                    }}

                     listeners={({ navigation, route }) => ({
                              tabPress: e => {
                                  /* (route.state && route.state.routeNames.length > 0) {
                                      navigation.navigate('Device')
                                  }*/
                                //  setRoute(route);

                                },
                      })}

                  />

                  <Tab.Screen
                    name="message"
                    component={Message}
                    options={{
                      tabBarLabel: 'message',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-notifications-outline" color={color} size={size} />
                      ),
                    }}

                    listeners={({ navigation, route }) => ({
                             tabPress: e => {
                                   /* (route.state && route.state.routeNames.length > 0) {
                                       navigation.navigate('Device')
                                   }*/
                                   //setRoute(route);
                               },
                     })}
                  />


                  <Tab.Screen
                    name="stocks"
                    component={Stocks}
                    options={{
                      tabBarLabel: 'stocks',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-analytics-outline" color={color} size={size} />
                      ),
                    }}

                    listeners={({ navigation, route }) => ({
                             tabPress: e => {
                                 /* (route.state && route.state.routeNames.length > 0) {
                                     navigation.navigate('Device')
                                 }*/

                                //setRoute(route);

                               },
                     })}
                  />


                <Tab.Screen
                            name="wallet"
                            component={Wallet}
                            options={{
                              tabBarLabel: 'wallet',
                              tabBarIcon: ({ color, size }) => (
                                <Ionicons name="ios-logo-usd" color={color} size={size} />
                              ),
                            }}

                            listeners={({ navigation, route }) => ({
                                     tabPress: e => {
                                         /* (route.state && route.state.routeNames.length > 0) {
                                             navigation.navigate('Device')
                                         }*/

                                        //setRoute(route);

                                       },
                             })}
                          />
            </Tab.Navigator>);

}
