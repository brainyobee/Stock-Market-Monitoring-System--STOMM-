import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import database from '@react-native-firebase/database';
const db=database();



const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;



/*
forgotPassword = (Email) => {
   firebase.auth().sendPasswordResetEmail(Email)
     .then(function (user) {
       alert('Please check your email...')
     }).catch(function (e) {
       console.log(e)
     })
 }

*/




//firestore().collection('Users').doc('ABC');





export default class CDS {

     constructor(user_id)
      {
          this.balance=0;
          this.transactions=[];
          this.equities=[];
          this.accountMinimum=3250;
          this.user_id=user_id;
          this.enSureBalance();

      }

async enSureBalance(){
    await  this.getbalance();
}

showBalance=async()=>{

    let mybalance=parseInt(this.balance);
    return mybalance
}


 getAccountCredentials=async()=>{

        try {
               let u=await AsyncStorage.getItem('userCredential');
               let credentialsJson=JSON.parse(u);
               return credentialsJson['user']['uid'];
          }
        catch(e)
          {
              alert('');
         }
 }


async getbalance(){

  db.ref('/Balance').orderByChild('userId').equalTo(this.user_id)
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
                        this.balance=balance;

                  }
              else
                {
                    db.ref('/Balance')
                   .push({userId:this.user_id,balance:0,time:moment().format('DD-MM-Y HH:mm:ss')})
                    this.balance=0;


                }
      }).catch(error => {
          console.log("error::  "+error)
          return 0;
      });

}


addStock=(dataObject)=>{

     db.ref('/Shares')
     .push({companyName:dataObject.company,companyAlias:dataObject.alias,value:dataObject.value,unit:dataObject.unit,price:dataObject.price})

     db.ref('/Messages')
     .push({userId:this.user_id,topic:'Stocks Purchase',message:`Aquired ${unit} Shares @ KES ${data.price} `,time:moment().format('DD-MM-Y HH:mm:ss')})
     .then(() => console.log());

}

getStocks=()=>{
    /*  firestore()
        .collection('Equities')
        .doc(this.user_id)
        .get()
        .then(querySnapshot => {

              if (documentSnapshot.exists) {
                  console.log('User data: ', documentSnapshot.data());
                }
            //   this.balance=
        });

*/

  }




loadtransactions=()=>{

  db.ref('/Transactions').orderByChild('owner').equalTo(this.user_id)
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

                        console.log('data- transactions--   '+typeof dataEntries)
                        return dataEntries;

                  }
              else
                {
                    console.log('data--------------   '+JSON.stringify(data))
                   return [];

                }
      }).catch(error => {
          console.log("error::  "+error)
          return [];
      });


}



loadMessages=()=>{

  db.ref('/Messages').orderByChild('userId').equalTo(this.user_id)
  .once("value").then(querySnapshot=> {

              let data = querySnapShot.val() ? querySnapShot.val() : {};
              if (data!==undefined)
                  {

                    let dataEntries=[];
                    Object.keys(data).forEach(function(key){
                           let eArr=data[key];
                           eArr['docid']=key;
                           dataEntries.push(eArr);

                    });

                     return dataEntries;

                  }
              else
                {
                   return [];

                }
      }).catch(error => {
          console.log("error::  "+error)
      });


}



withdraw=async(data)=>{

  //{owner:user_id,type:type,paymentOption:paymentOption,amount:amount}

      let deductablebalance=this.balance-this.accountMinimum;
      if(deductablebalance<data.amount)
          {
            alert(`transaction failed, the least you can withdraw is  ${deductablebalance}. Account cushion [ KES ${this.accountMinimum} ] applies `);
          }
      else
        {
                  let balance=this.balance-data.amount;
                  try
                    {
                        db.ref('/Balance').orderByChild('userId').equalTo(this.user_id).set({userId:this.user_id,balance:balance,time:moment().format('DD-MM-Y HH:mm:ss')});
                        db.ref('/Transactions')
                          .push(data)
                          .then(() => console.log());

                          db.ref('/Messages')
                          .push({userId:this.user_id,topic:'Funds Withdrawal',message:`KES ${data.amount} withdrawn`,time:moment().format('DD-MM-Y HH:mm:ss')})
                          .then(() => console.log());

                          ToastAndroid.showWithGravity(
                               "Funds Processed successfully!!",
                               ToastAndroid.SHORT,
                               ToastAndroid.CENTER
                              );

                      return {success:'Successful'};
                   }
                catch(err){
                     alert('transaction failed, please check your conection');
                 }

        }


}




deposit=async(data)=>{

  //{owner:user_id,type:type,paymentOption:paymentOption,amount:amount,time:time}

            try
              {
                  let new_balance=this.balance+data.amount;
                  db.ref('/Balance').orderByChild('userId').equalTo(this.user_id).set({userId:this.user_id,balance:balance,time:moment().format('DD-MM-Y HH:mm:ss')});

                  db.ref('/Transactions')
                  .push(data)
                  .then(() => console.log());

                  db.ref('/Messages')
                  .push({userId:this.user_id,topic:'Funds Deposit',message:`Deposited the amount ${data.amount}`,time:moment().format('DD-MM-Y HH:mm:ss')})
                  .then(() => console.log());

                   return {status:'success'};
                   alert('successful!');
             }
          catch(err){
                 return {status:'error'};
                 alert('error  '+err);
           }


}


//https://rnfirebase.io/firestore/usage

      buy=()=>{

                let purchase_permitted=false;
                let shareValue="";
                let total_payable=(shareValue*totalshares)+this.accountMinimum;
                if(total_payable<mybalance)
                  {
                     purchase_permitted=true;
                  }

                if(purchase_permitted==false)
                    {
                       ToastAndroid.showWithGravity(
                                          "Please top up your account to complete transaction.",
                                          ToastAndroid.LONG,
                                          ToastAndroid.CENTER
                                        );
                    }
                else{

                       let new_balance=mybalance-total_payable;
                       this.updateBalance(new_balance);
                   }


      }



}
