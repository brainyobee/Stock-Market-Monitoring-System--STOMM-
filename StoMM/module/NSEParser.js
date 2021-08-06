//scroll async    https://blog.logrocket.com/how-to-build-a-web-crawler-with-node/
//HISTORICAL DATA https://github.com/KevKipkemoi/nse_analysis/blob/master/data_scraper.py

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  FlatList,
  Dimensions
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
const axios = require('axios');
const cheerio = require('cheerio');


const height=Dimensions.get('window').height;
const width=Dimensions.get('window').width;



export default class NSE extends React.Component{

   constructor(props)
    {
      super(props);
      this.state={apidata:'loading',tickers:[],highlights:""};
    }

    componentDidMount()
    {
        this.getNSEDATA();
    }


getNSEDATA=async()=>{
   console.log('loading records....!!!!');
  try{
  const doc= await fetch('https://www.nse.co.ke');
  const responseData = await doc.text();
          //console.log(responseData);

          var $ = cheerio.load(responseData);
          var ticker=$('#mainAct2');
          const companies=$('.itemt'); //.itemt, .itemr, .changediv

         let tiArray=[];
         let highlights=[];

         $(companies).each(function(i,elem){
                let company=$(elem).text();
                let rate=$(elem).siblings('.itemr').text();
                let change=$(elem).siblings('[valign=middle]').children('.changediv').find('.dchange').text() || $(elem).siblings('[valign=middle]').children('.changediv').find('.uchange').text();
                tiArray.push({id:Math.random().toString(36).substr(2, 9),company:company,rate:rate,change:change});
                let notice=company+" "+rate+" "+change;
                highlights.push(notice);
         });


        this.setState({tickers:tiArray,highlights:highlights});

    }
    catch(err)
    {
       alert('error! '+err);
    }


}



getTickers=()=>{

  return <LoopText textArray={this.state.highlights} duration={3000} />;
}

   render()
    {


        const renderItem = ({ item }) => (
          <TouchableOpacity
                style={{backgroundColor:'#eee',width:width-10,padding:10,flexDirection:'row',justifyContent:'space-around'}}
                key={Math.random().toString(36).substr(2, 9)}>
                  <Text style={{width:'30%',alignSelf:'flex-start'}}>{item.company}</Text><Text  style={{width:'30%'}}>{item.rate}</Text><Text>{item.change==""?"-":item.change}</Text>
          </TouchableOpacity>
        );


        return(<View style={{flex:1,height:height,width:width,justifyContent:'center',alignItems:'center'}}>
                 <Text>status  {this.state.apidata}</Text>
                 <View><Image source={{uri:"https://www.nse.co.ke/images/icon/nsemedia.jpeg"}} style={{height:50,width:50}}/></View>
                 <View style={{width:width,padding:10}}>
                       {this.getTickers()}
                 </View>
                 <View
                      style={{height:height*.50,width:width-10,
                              marginTop:10,borderTopRightRadius:10,borderTopLeftRadius:10}}>
                      <View style={{paddingVertical:14}}><Text style={{color:'darkblue',alignSelf:'center',textAlign:'center'}}>Today's Top Earners & Losers</Text></View>
                      {this.state.tickers.length==0?
                            <ActivityIndicator color='tomato' size={45} />
                             :
                            <FlatList
                                data={this.state.tickers}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        }
                  </View>
            </View>);
    }

}
