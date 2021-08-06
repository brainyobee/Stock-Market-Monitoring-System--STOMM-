import React,{useState} from 'react';

import {
  StyleSheet,
   ToastAndroid,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StatusBar,
    Linking,
    Alert,
    View,
    PermissionsAndroid,
    Dimensions,
    SafeAreaView,
    FlatList,
    TextInput,
} from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';




const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;


export default class AccountLimitation extends React.Component {

  constructor(props)
    {
       super(props);
       this.state={email:'',name:''};
    }


   async componentDidMount()
      {

       await this.verifyAccount();


      }


verifyAccount=async()=>{


    try {
           let u=await AsyncStorage.getItem('userCredential');
           let credentialsJson=JSON.parse(u);
           this.setState({name:credentialsJson.name,email:credentialsJson.email});
    } catch(e) {
      // read error
    }

}



   render()
     {
          return (<View style={styles.container}>
                  <View style={{width:width}}>
                        <TouchableOpacity
                                onPress={()=>this.props.navigation.navigate('login')}
                                >
                              <Ionicons name='ios-arrow-back'  size={22} color="#fff" />
                        </TouchableOpacity>
                   </View>
                   <View style={{paddingVertical:15,flex:1,marginTop:100}}>
                      <Text style={{fontSize:18,color:'#fff'}}>Hello,  {this.state.name} </Text>
                      <Text style={{fontSize:18,color:'#fff'}}>Please Check your inbox at your registered e-mail [ {this.state.email} ] and verify your account information to access Stom.</Text>
                      <Text style={{fontSize:18,color:'#fff',marginTop:15}}>Cheers!</Text>
                  </View>
              </View>);
    }



}


const styles=StyleSheet.create({
    container:{
       backgroundColor:'#303846',
       height:height,
       width:width,
       padding:26
     },
     label:{
       textAlign:'center',
       color:'#de4d41'
     },
     resetButton:{
       margin:12,
       borderColor:'#f5e7ea',
       borderWidth:0.6,
       paddingVertical:8,
       width:130,
       borderRadius:17,
       alignSelf:'flex-start'
     }
});
