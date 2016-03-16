var Promise = require('bluebird');

var MailChimpAPI = require('mailchimp').MailChimpAPI;

var configs = require('../configs');

var apiKey = configs.mailchimp;

try { 
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

function call(section, method, params){
    return new Promise(function (resolve, reject){
        api.call(section, method, params, function (error, data) {
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

function getList(){
    // return new Promise(function (resolve, reject){
    //     api.call('campaigns', 'list', { start: 0, limit: 25 }, function (error, data) {
    //         if (error){
    //             console.log(error.message);
    //             return reject(error);
    //         } else {
    //             console.log(JSON.stringify(data)); // Do something with your data!
    //             return resolve(data);
    //         }
    //     });
    // })
    return call('campaigns', 'list', { start: 0, limit: 25 })
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

var list_id = '1dabb9957a';//7b99e93346//a904cfeefe

function users(){
    return call('lists', 'members', { id: list_id } )
}

function update_field_of_subscriber(merge_vars, email){
    // return call()
    return call('lists', 'update-member', { 
        id: list_id
        , email: { email:email }
        , merge_vars: merge_vars
    })
}

function subscribe_user(email, data){
    return call('lists', 'subscribe', {
        apikey: apiKey,
        id:list_id
        , email : { email:email }
        , merge_vars : data
        , send_welcome : false
    })
}


var subscribers = [
    { 
        email: { email:'23i03g@mail.ru' }
        // ,email_type: "html"
        , merge_vars: {
            MONEY:100
        }
    }
    ,{
        email: { email: 'mail@online-tournaments.org' }
        // , email_type: "html"
        , merge_vars: {
            MONEY:120
        }
    }
    //alexeyking2012@yandex.ru'
];


function addSubscribers(subscribers1){

    return call('lists', 'batch-subscribe', {
        id: list_id
        , batch: subscribers
        ,"double_optin": true
        ,"update_existing": true
        ,"replace_interests": true
        ,send_welcome: true
    })
}


// subscribe_user('23i03g@mail.ru' , { MONEY:100 })
addSubscribers()
.then(console.log)
.catch(console.error)

// update_field_of_subscriber({
//     "MONEY": 100
// } , "23i03g@mail.ru")

module.exports = {
    send: function (email, letter){
        console.log(email, letter);
    }
    ,list: getList
    ,users: function(){
        users()
    }
}