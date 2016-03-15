var Promise = require('bluebird');

var MailChimpAPI = require('mailchimp').MailChimpAPI;

var configs = require('../configs');

var apiKey = configs.mailchimp;

try { 
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}


function getList(){
    return new Promise(function (resolve, reject){
        api.call('campaigns', 'list', { start: 0, limit: 25 }, function (error, data) {
            if (error){
                console.log(error.message);
                return reject(error);
            } else {
                console.log(JSON.stringify(data)); // Do something with your data!
                return resolve(data);
            }
        });
    })
}


//mailchimp398e6f04945762903f0a9e3f1.c66459f491
/*api.call('campaigns', 'template-content', { cid: 'c66459f491' }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});*/
function send(){
    // return new Promise(function (resolve, reject){
    //     // api.campaigns_send()
    // })
}

module.exports = {
    send: function (email, letter){
        console.log(email, letter);
    }
    ,list: getList
    ,users: function(){
        return new Promise(function (resolve, reject){
            api.lists_clients({}, function (error, data){
                if (error){
                    console.log(error.message);
                    return reject(error);
                } else {
                    console.log(JSON.stringify(data)); // Do something with your data!
                    return resolve(data);
                }
            })
        })
    }
}