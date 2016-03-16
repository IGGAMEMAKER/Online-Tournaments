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

var list_id = '7b99e93346';//a904cfeefe

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

function subscribe_user(mail, data){
    // return call('lists', 'subscribe', {})
}

users()
// .then(console.log)
// .catch(console.error)
update_field_of_subscriber({
    "MONEY": 100
} , "23i03g@mail.ru")

module.exports = {
    send: function (email, letter){
        console.log(email, letter);
    }
    ,list: getList
    ,users: function(){
        users()
        .then(console.log)
        .catch(console.error)
    }
}