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

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';


const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;
//LOGIN SCREEN
export default LoginScreen= ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const setUserID=async(id)=>{
      await AsyncStorage.setItem('userId', JSON.stringify(id));

  }




  const login=(navigation)=>{

      if(email=="")
            {
              ToastAndroid.showWithGravity(
                  "email field is empty!",
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );
            }
     else if(password=="")
          {
            ToastAndroid.showWithGravity(
                "You have not entered your password!",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
          }
    else{
                      setLoading(true);
                      auth()
                      .signInWithEmailAndPassword(email, password)
                      .then((response) => {

                          auth().onAuthStateChanged(function(){


                            if(response.user.emailVerified==true)
                             {

                                  ToastAndroid.showWithGravity(
                                        "Authenticated Successfully!",
                                        ToastAndroid.SHORT,
                                        ToastAndroid.CENTER
                                  );
                                  saveCredentials(response);
                                  navigation.navigate('profile');
                            }
                            else
                               {

                                 saveCredentials({name:response.user.displayName,email:email});
                                 navigation.navigate('limitaccount');
                              }


                          });

                               setLoading(false);
                               ToastAndroid.showWithGravity(
                                      "Logging you in!",
                                      ToastAndroid.SHORT,
                                      ToastAndroid.CENTER
                                );



                                  //var user = firebase.auth().currentUser;


                      })
                      .catch(error => {
                           setLoading(false);
                           alert('Could not log you in, please confirm your credentials and network connection!');
                      })


            }

  }


  async function saveCredentials(value){
          try {
          await AsyncStorage.setItem('userCredential',JSON.stringify(value));
        } catch(e) {
          // save error
          console.log('error saving')
        }
  }


  return (
    <SafeAreaView style={styles.container}>

        <View style={{paddingVertical:22,width:width,paddingHorizontal:16}}>
                <TouchableOpacity
                      onPress={()=>navigation.navigate('home')}
                      style={{width:30,height:50}}>
                          <Ionicons name='ios-chevron-back-circle' size={29} color='#62bdff' style={{alignSelf:'center'}}/>
                </TouchableOpacity>
              <Text style={{fontSize:24,color:'green'}}>STOM</Text></View>
        <View style={styles.content}>

              {loading==true?<View style={{alignSelf:'center',marginTop:20,paddingVertical:25}}>
                                  <Text style={{marginTop:80,fontSize:17,alignSelf:'center',textAlign:'center',color:'#fff'}}>Logging you in ... </Text>
                                  <ActivityIndicator color="yellow" size='large' style={{marginTop:50}}/>
                              </View>:
               <View>

                    <View><Text style={{alignSelf:'center',color:'#62bdff',marginTop:52,fontSize:18}}> Login to your Account </Text></View>
                    <View style={styles.boxView}>
                         <TextInput
                              label="Email"
                              autoCompleteType="email"
                              placeholder="Email address"
                              selectionTextColor='#0073cf'
                              placeholderTextColor="#eee"
                              style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',borderBottomWidth:0.4,width:280,marginTop:70,textAlign:'center'}}
                              onChangeText={text => setEmail(text)}
                          />
                    </View>
                    <View style={styles.boxView}>
                          <TextInput
                               label="password"
                               secureTextEntry={true}
                               style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',width:280,marginTop:30,textAlign:'center'}}
                               onChangeText={text => setPassword(text)}
                               autoCompleteType="password"
                               placeholder="Your password"
                               placeholderTextColor="#eee"
                               selectionTextColor='#0073cf'
                           />
                    </View>

                    <TouchableOpacity
                        onPress={()=>login(navigation)}
                        style={{width:110,paddingVertical:9,marginTop:35,borderRadius:6,borderWidth:0.7,alignSelf:'center',backgroundColor:'#eee'}}>
                          <Text style={{color:'#0073cf',textAlign:'center'}}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity

                          >
                    </TouchableOpacity>
                    <View style={{marginTop:55,flexDirection:'row',justifyContent:'center',width:240,alignSelf:'center'}}>
                          <Text style={{color:'#fff',marginRight:10}}> Create account?</Text>
                          <TouchableOpacity
                                onPress={()=>navigation.navigate('registration')}
                                style={{flexDirection:'row'}}>
                              <Text style={{padding:4,color:'#fff',alignSelf:'center',borderBottomColor:'#62bdff',borderBottomWidth:StyleSheet.needlehairlineWidth,marginRight:6,borderBottomWidth:0.6}}>registration </Text>
                              <Ionicons name='ios-arrow-forward-outline' size={20} color='#62bdff' />
                          </TouchableOpacity>
                    </View>
              </View>}

        </View>
    </SafeAreaView>
  );
}


const styles=StyleSheet.create({
    container:{
    backgroundColor:'#303846',
      height:height,
      width:width
    }
});
