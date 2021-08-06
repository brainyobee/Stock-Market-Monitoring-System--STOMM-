module.exports=()=>
{
//fetching data from api
const isinno = 'KE3000009674';
let tickerdata = []
let ticker_url = "https://deveintapps.com/nseticker/api/v1/ticker";

Number.prototype.toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
 }



getData();
setInterval(getData,5000)
async function getData() {


        const response = await fetch(ticker_url, {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({'nopage': 'true', "isinno":isinno,})
        });
        const data = await response.json();



/*const date = data.message[1].updated_at.date
    const time = data.message[1].updated_at.time
    const status = data.message[1].updated_at.market_status*/

    //console.log('date ---  '+response);
    /*const allticker = data.message[0].snapshot;

    allticker.forEach(data => {
        const issuer = data.issuer;
        let price = data.price;
        if (price){
            price = data.price.toFixedNoRounding(2);
        }
        const change = data.change;


        const singletickers = document.createElement('div');
        singletickers.setAttribute('class', 'items');

        const singletickers2 = document.createElement('div');
        singletickers2.setAttribute('class', 'items');

        const issuerdata = document.createElement('span');
        issuerdata.setAttribute('class', 'issuerdata')
        issuerdata.textContent = issuer;
        const pricedata = document.createElement('span');
        pricedata.textContent = price;
        const changedata = document.createElement('span');
        if (change > 0) {
            changedata.setAttribute('class', 'changedata');
            pricedata.setAttribute('class', 'pricedata positive');
        } else if (change < 0) {
            changedata.setAttribute('class', 'changedata');
            pricedata.setAttribute('class', 'pricedata negative')
        } else {
            changedata.setAttribute('class', 'changedata');
            pricedata.setAttribute('class', 'pricedata nochange')
        }
        if (change === null) {
            changedata.textContent = '(0)';
        } else {
            changedata.textContent = '(' + change + ')';
        }

        if (price !== null) {
            displayticker.appendChild(singletickers)
            singletickers.append(issuerdata, pricedata, changedata)

        }

   });


     */
   }


}
