import React,{useEffect,useState} from 'react';
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
  View,
  Dimensions
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import NSEParser from './module/NSEParser.js';
import Profile from './module/MyProfile.js';
import LoginScreen from './module/LoginScreen.js';
import RegistrationScreen  from './module/RegistrationScreen.js';
import { NavigationContainer } from '@react-navigation/native';

import AccountLimitation from './module/AccountLimitation.js';

import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import database from '@react-native-firebase/database';
const db=database();

//loader https://www.npmjs.com/package/react-native-loader-overlay

import
   {
      LineChart,
      BarChart,
      PieChart,
      ProgressChart,
      ContributionGraph,
      StackedBarChart
    } from 'react-native-chart-kit'
  const cheerio = require('cheerio');


  const height=Dimensions.get('window').height;
  const width=Dimensions.get('window').width;




///////////////////////////////Graphical representation ///////////////////////////////////////////


const HomeScreen=({navigation}) => {
const [tickers,SetTickers]=useState([]);
const [labels,SetLabels]=useState([]);
const  [values,SetValues] =useState([]);
const [changes,SetChanges]=useState([]);
const [gainers,SetGainers]=useState([]);
const [losers,SetLosers]=useState([]);



useEffect(()=>{


    if(gainers.length==0)
       {
          getNSEDATA();
        }

        //work();
  // NSEDATA();
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
                          SetGainers(gainers);
                          SetLosers(losers);


                        //  SetGainers(gainers);
                          //SetLosers(losers);


    }
    catch(err)
    {
       alert('error! '+err);
    }


}


/*
getNSEDATA=async()=>{
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

                labels.push(company+` ${change}`);
                let changeq=parseFloat(change.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));
                changes.push(changeq)
                let notice=company+" "+rate+" "+change;
                highlights.push(notice);
         });



                          SetLabels(labels);
                          SetChanges(changes);

                          SetGainers(gainers);
                          SetLosers(losers);


    }
    catch(err)
    {
       alert('error! '+err);
    }


}

*/



const isDarkMode=useColorScheme()==='dark'?true:false;
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <View style={{width:width,alignItems:'flex-end',paddingHorizontal:20,marginTop:10}}>
                            <TouchableOpacity
                                onPress={()=>navigation.navigate('login')}
                                style={{selfAlign:'right',paddingVertical:12,marginTop:30}}
                                ><Ionicons name='ios-log-in-outline'  size={28} color="#eee"/></TouchableOpacity>
                        </View>
        <View style={{paddingVertical:13,width:width,paddingHorizontal:16}}><Text style={{fontSize:24,color:'green',marginTop:12}}>STOM</Text></View>
        {values.length>0?
        <View style={{width:width-2,height:height*.51,paddingVertical:4,paddingHorizontal:0,backgroundColor:'#586c87'}}>
              <Text style={{color:'tomato',fontSize:15,marginBottom:17,padding:2}}>NSE Live Performance</Text>
                                    <LineChart
                                      data={{
                                        labels:labels,
                                        datasets: [
                                          {
                                            data:values
                                          }
                                        ]
                                      }}
                                      width={Dimensions.get("window").width-4} // from react-native
                                      height={height*.45}
                                      yAxisLabel=" "
                                      yAxisSuffix=" +-"
                                      yAxisInterval={1} // optional, defaults to 1
                                      chartConfig={{
                                        backgroundColor: "#000",
                                        backgroundGradientFrom: "#303846",
                                        backgroundGradientTo: "#303846",
                                        decimalPlaces: 2, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                          borderRadius:2,padding:2
                                        },
                                        propsForDots: {
                                          r: "6",
                                          strokeWidth: "2",
                                          stroke: "#ffa726"
                                        }
                                      }}
                                      bezier
                                      style={{
                                        backgroundColor:'#586c87',
                                        borderRadius:4,
                                        margin:2
                                      }}
                                    />
        </View>
        : <View style={{height:height*.51,}}>
            <ActivityIndicator
               color = 'tomato'
               size = "large"
               style = {styles.activityIndicator}/>
               <Text style={{color:'#eee'}}>Updating Listing.. Please Wait...</Text>
          </View>
        }
        <Text style={{paddingVertical:16,color:'tomato',fontSize:14,marginTop:30}}>Day's Top Gainers & Losers  {labels.length}</Text>
        {gainers.length>0?
        <View style={{width:width,flexDirection:'row',padding:10,justifyContent:'space-around',marginBottom:10}}>
                <View>
                {
                  gainers.map((item,i)=>{
                    return <TouchableOpacity
                            key={Math.random().toString(36).substr(2, 9)}
                        ><Text style={{color:'#eee'}}>{item}</Text></TouchableOpacity>
                  })
                }
              </View>
              <View>
                {
                  losers.map((item,i)=>{
                    return <TouchableOpacity
                            key={Math.random().toString(36).substr(2, 9)}
                        ><Text style={{color:'#eee'}}>{item}</Text></TouchableOpacity>
                  })
                }
            </View>
        </View>
        : <View>
            <ActivityIndicator
               color = 'green'
               size = "large"
               style = {styles.activityIndicator}/>
               <Text style={{color:'#eee'}}>Loading .......</Text>
          </View>
        }
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container:{
      flex:1,
      height:height,
      width:width,
      //backgroundColor:'#e7e7e9',
      backgroundColor:'#303846',
      justifyContent:'center',
      alignItems:'center',
      paddingHorizontal:30
  }
});




const Stack = createStackNavigator();

export default function FrontEndDash() {
  return (
    <NavigationContainer>
        <Stack.Navigator
              initialRouteName="home"
              screenOptions={{headerShown: false}}
            >
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="limitaccount"   component={AccountLimitation} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="registration" component={RegistrationScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}


/*









*/
