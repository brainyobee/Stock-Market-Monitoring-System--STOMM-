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



const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;
//LOGIN SCREEN
export default LoginScreen= ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setphoneNumber] = useState("");
  const [fullName, setFullname] = useState("");


  const setUserID=async(id)=>{
      await AsyncStorage.setItem('userId', JSON.stringify(id));

  }



  const login=async(navigation)=>{
       if(fullName=="")
         {
             ToastAndroid.showWithGravity(
               "password field is empty!",
               ToastAndroid.SHORT,
               ToastAndroid.CENTER
             );

         }

        else if(email=="")
              {
                  ToastAndroid.showWithGravity(
                      "email field is empty!",
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER
                    );
              }
         else if(password!==cpassword)
              {
                ToastAndroid.showWithGravity(
                    "Your passwords do not match!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
              }
         else if(password=="")
              {
                  ToastAndroid.showWithGravity(
                  "password field is empty!",
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );

            }
         else{

                        setLoading(true);
                         auth()
                         .createUserWithEmailAndPassword(email, password)
                         .then((response) =>{
                                response.user.updateProfile({
                               displayName:fullName,phoneNumber:phoneNumber,
                             }).catch((err)=>{
                                 let errormsg='Registration failed!! '+JSON.stringify(err);
                                 alert(errormsg);
                             });

                              ToastAndroid.showWithGravity(
                                                "Registration Successful!!",
                                                ToastAndroid.SHORT,
                                                ToastAndroid.CENTER
                                              );

                               setLoading(false);

                               response.user.sendEmailVerification();

                         }).then(()=>{
                               saveCredentials({name:fullName,email:email});
                         }).
                         then(()=>{
                                navigation.navigate('limitaccount');
                         })
                         .catch((error) => {

                           setLoading(false);
                           alert('Registration Failed! please check your internet connection!  '+error);

                     });

            }

  }

async function saveCredentials(value){
        try {
        await AsyncStorage.setItem('userCredential',JSON.stringify(value));
      } catch(e) {
        // save error
      }
}


  return (
    <SafeAreaView style={styles.container}>
        <View style={{paddingVertical:12,width:width,paddingHorizontal:16}}>
                            <TouchableOpacity
                                  onPress={()=>navigation.navigate('home')}
                                  style={{width:30,height:50}}>
                                      <Ionicons name='ios-chevron-back-circle' size={29} color='#62bdff' style={{alignSelf:'center'}}/>
                            </TouchableOpacity>
             <Text style={{fontSize:24,color:'green'}}>STOM</Text>
        </View>
        <View style={styles.content}>

              {loading==true?<View style={{alignSelf:'center',marginTop:20,paddingVertical:25}}>
                                  <Text style={{marginTop:80,fontSize:17,alignSelf:'center',textAlign:'center',color:'#fff'}}>Logging you in ... </Text>
                                  <ActivityIndicator color="yellow" size='large' style={{marginTop:50}}/>
                              </View>:
               <View>

                    <View><Text style={{alignSelf:'center',color:'#62bdff',marginTop:52,fontSize:18}}>Trading Account Registration </Text></View>
                    <View style={styles.boxView}>
                         <TextInput
                              label="Full Name"
                              autoCompleteType="email"
                              placeholder="Full Name"
                              selectionTextColor='#0073cf'
                              placeholderTextColor="#eee"
                              style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',borderBottomWidth:0.4,width:280,marginTop:20,textAlign:'center'}}
                              onChangeText={text => setFullname(text)}
                          />
                    </View>

                    <View style={styles.boxView}>
                         <TextInput
                              label="Phone Number"
                              autoCompleteType="email"
                              placeholder="Phone Number"
                              selectionTextColor='#0073cf'
                              placeholderTextColor="#eee"
                              style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',borderBottomWidth:0.4,width:280,marginTop:20,textAlign:'center'}}
                              onChangeText={text => setphoneNumber(text)}
                          />
                    </View>


                    <View style={styles.boxView}>
                         <TextInput
                              label="Email"
                              autoCompleteType="email"
                              placeholder="Email address"
                              selectionTextColor='#0073cf'
                              placeholderTextColor="#eee"
                              style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',borderBottomWidth:0.4,width:280,marginTop:20,textAlign:'center'}}
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

                    <View style={styles.boxView}>
                            <TextInput
                                    label="password"
                                    secureTextEntry={true}
                                    style={{color:'#fff',alignSelf:'center',backgroundColor:'#939EB9',width:280,marginTop:30,textAlign:'center'}}
                                    onChangeText={text => setcPassword(text)}
                                    autoCompleteType="password"
                                    placeholder="Confirm Your password"
                                    placeholderTextColor="#eee"
                                    selectionTextColor='#0073cf'
                               />
                      </View>

                    <TouchableOpacity
                        onPress={()=>login(navigation)}
                        style={{width:110,paddingVertical:9,marginTop:35,borderRadius:6,borderWidth:0.7,alignSelf:'center',backgroundColor:'#eee'}}>
                          <Text style={{color:'#0073cf',textAlign:'center'}}>Create Account</Text>
                    </TouchableOpacity>

                    <View style={{marginTop:35,flexDirection:'row',justifyContent:'center',width:240,alignSelf:'center'}}>
                          <Text style={{color:'#fff',marginRight:10}}> Registered?</Text>
                          <TouchableOpacity
                                onPress={()=>navigation.navigate('login')}
                                style={{flexDirection:'row'}}>
                              <Text style={{color:'#fff',alignSelf:'center',borderBottomColor:'#62bdff',borderBottomWidth:StyleSheet.needlehairlineWidth,marginRight:6,borderBottomWidth:0.6}}>Login to account </Text>
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
