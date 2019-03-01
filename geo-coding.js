var async = require("async");
const readline = require('readline');
const request = require("request");
const baseurl = "http://open.mapquestapi.com/geocoding/v1/address";
const key = "FJAstyhJXWkFE1B1e1wf63HcLbc6C0nN"; //This is my registered key at MapQuest Co. , this will work but better get your own key
const timebaseurl = "http://api.timezonedb.com/v2.1/get-time-zone";
const timekey = "5EPVUH6PQXEY"; //This is my key registered in timezonedb.com, this will work but better get your own key
const baseweatherurl = "http://api.openweathermap.org/data/2.5/weather";
const weatherkey = "dd067c54cbf240f7fc5449900a72b8b8"; //This is my key registered in openweathermap.org, this will work but better get your own key

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function dowork(elem,cb){
        let pair = elem.split(':');
        let location_name = pair[0].trim();
        let postal_code = pair[1].trim();
        //console.log(location_name,postal_code); 
        let url = baseurl + "?key=" + key + "&location=" + location_name + "," + postal_code;
        request.get(url, function(error, response, body)  {
                        let json = JSON.parse(body);
                        let lat = json.results[0].locations[0].latLng.lat ;
                        let lng = json.results[0].locations[0].latLng.lng ;
                        let timeurl = timebaseurl + "?key=" + timekey + "&by=position" +  "&lat=" + lat + "&lng=" + lng + "&format=json" ;
                        function f1(cb) { request.get(timeurl, function(error, response, body)  {
                                  let timejson = JSON.parse(body);
                                  let currenttime = timejson.formatted;
                                  console.log(currenttime);
                        });cb()}
                        let weatherurl = baseweatherurl + "?APPID=" + weatherkey +  "&lat=" + lat + "&lon=" + lng ;
                        function f2() {request.get(weatherurl, function(error, response, body)  {
                                 let weatherjson = JSON.parse(body);
                                 console.log(body);
                        });}
                        async.waterfall([f1],function(err,result){f2()});
        cb();
        });
        //console.log(currenttime);

}
function cb(err){
// console.log("***************");
}
rl.question('Input: An array of location name and  postal code\nFormat: Bangalore:560000, Hyderabad:500030\n ', (answer) => {

        answer = answer.split(',');
        async.eachSeries(answer,dowork,function(err){console.log("*");});
        rl.close();
})
