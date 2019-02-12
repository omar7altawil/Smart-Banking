'use strict';
// =================================================================================
// Firebase
// =================================================================================
var admin = require("firebase-admin");
var serviceAccount = require("/home/omar/Desktop/bank/banking/firebase/smart-banking-d46e6-firebase-adminsdk-uvsrr-a0ff9aef00.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-banking-d46e6.firebaseio.com"
  });
var db = admin.database();
var ref = db.ref();


// =================================================================================
// App Configuration
// =================================================================================
const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({    
     'LAUNCH':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var userid=[];
        for (var key in Users) {
                        userid.push(Users[key]["userid"])
        } 
        var index=userid.indexOf(UserId)
        if(index > -1)
            this.toIntent("LoginIntent")
        else 
            this.followUpState('NewUser').ask("you are not registered with the banking skill,to register please contact: 0059915, whould you like to know more about banking skill?","whould you like to know more about banking skill?")
    },

            'NewUser': {
                    'AMAZON.YesIntent': function() {
                        this.tell("with banking skill you can get full controll over your bank activity using only your voice, for example you can ask me about,you balance, latest transaction , or even send money")
                    },
    
                    'AMAZON.NoIntent': function() {
                        this.tell("ok, see you soon")
                    },
                    
    },

    'LoginIntent':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        var Name=[];
        var logged_in=[];
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        Name.push(Users[key]["name"])
                        logged_in.push(Users[key]["logged_in"]) 
        } 
        var index=userid.indexOf(UserId)
        logged_in[index]
        if(logged_in[index]){
            this.ask("Hi Mr "+Name[index]+", welcome to smart banking, tell me how can i help you?","how may i help you?","i am here to help you")
        }
        else{
            db.ref(keys[index]).update({auth:1})
            this.followUpState("enterpassword").ask('Welcome Mr '+Name[index]+ ' to N B D smart banking, please enter your password to login, tell me when you are done.',"are you done yet?")
        }
    },
            'enterpassword': {
                    'DoneIntent':async function() {
                        var UserId=this.getUserId();
                        var Users;
                        Users=await ref.once("value").then((snapshot) =>{
                            return snapshot.val();});
                        var keys=[];
                        var userid=[];
                        var Name=[];
                        var logged_in=[];
                        var auth=[];
                        for (var key in Users) {
                                        keys.push(key)
                                        userid.push(Users[key]["userid"])
                                        Name.push(Users[key]["name"])
                                        logged_in.push(Users[key]["logged_in"]) 
                                        auth.push(Users[key]["auth"]) 
                        } 
                        var index=userid.indexOf(UserId)
                        // if(auth[index]==0){
                            db.ref(keys[index]).update({logged_in:true})
                            this.ask("you have been authorized to use N B D smart banking service, welcome, how can i help you?","I didn't understand please repeat that","how can i help you?","i am here to help you")
                        // }
                        // else if(auth[index]==3)
                        //     this.tell("sorry you are not authorized because you have entered a wrong password, please try again later")
                        // else if(auth[index]==4)
                        //     this.tell("sorry you are not authorized because you have not entered the password, please try again later")
                        // else
                        //     this.tell("an error has occurred, please contact us")
                        //     db.ref(keys[index]).update({auth:0})
                        }
    },
    'MyblanceIsIntent':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        var Name=[];
        var logged_in=[];
        var balance=[];
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        Name.push(Users[key]["name"])
                        logged_in.push(Users[key]["logged_in"]) 
                        balance.push(Users[key]["balance"]) 
        } 
        var index=userid.indexOf(UserId)
        if(logged_in[index])
            this.ask( "your balance right now is "+balance[index]+"$")
        else
            this.toIntent("LoginIntent")
    },
    'transactionIntent':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        var logged_in=[];
        var transaction=[];
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        logged_in.push(Users[key]["logged_in"]) 
                        transaction.push(Users[key]["transaction"]) 
        } 
        var index=userid.indexOf(UserId)
        var latest=transaction[index].length-1;
        if(logged_in[index]){
            this.followUpState("tran").ask("your latest transaction was "+ transaction[index][latest]+", do you want to see more?","say yes for more")
        }
        else
            this.toIntent("LoginIntent")
    },
                'tran': {
                    'AMAZON.YesIntent':async function() {
                        var UserId=this.getUserId();
                        var Users;
                        Users=await ref.once("value").then((snapshot) =>{
                            return snapshot.val();});
                        var keys=[];
                        var userid=[];
                        var transaction=[];
                        for (var key in Users) {
                                        keys.push(key)
                                        userid.push(Users[key]["userid"])
                                        transaction.push(Users[key]["transaction"]) 
                        } 
                        var tran=""
                        var index=userid.indexOf(UserId)
                        for(var key in transaction[index])
                            tran=tran+","+transaction[index][key]
                        this.ask("here is a list of all your transaction,"+tran+", can i help you with something else?","how can i help you?")
                    },
                    'AMAZON.NoIntent': function() {
                        this.ask("yes sir")
                    },
    },

    'ordersIntent':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        var logged_in=[];
        var order=[];
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        logged_in.push(Users[key]["logged_in"]) 
                        order.push(Users[key]["order"]) 
        } 
        var index=userid.indexOf(UserId)
        var latest=order[index].length-1;
        if(logged_in[index]){
            this.followUpState("ord").ask("your latest order was "+ order[index][latest]+",do you want to see more?","say yes for more")
        }
        else
            this.toIntent("LoginIntent")
    },
                'ord': {
                    'AMAZON.YesIntent':async function() {
                        var UserId=this.getUserId();
                        var Users;
                        Users=await ref.once("value").then((snapshot) =>{
                            return snapshot.val();});
                        var keys=[];
                        var userid=[];
                        var order=[];
                        for (var key in Users) {
                                        keys.push(key)
                                        userid.push(Users[key]["userid"])
                                        order.push(Users[key]["order"]) 
                        } 
                        var ord=""
                        var index=userid.indexOf(UserId)
                        for(var key in order[index])
                            ord=ord+","+order[index][key]
                        this.ask("here is a list of all your orders,"+ord+",,, can i help you with something else?","how can i help you?")
                    },
                    'AMAZON.NoIntent': function() {
                        this.ask("yes sir")
                    },
    },
    'sendIntent':async function(amount,to) {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        var logged_in=[];
        var the_pattern="";
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        logged_in.push(Users[key]["logged_in"]) 
        } 
        var index=userid.indexOf(UserId)
        if(logged_in[index]){
            for(var i=0;i<3;i++)
                the_pattern=the_pattern+Math.round(Math.random())
                for(var i=0;i<3;i++){
                        the_pattern=the_pattern.replace("1","long press ,")
                        the_pattern= the_pattern.replace("0","short press ,")
                }
            var text="send "+amount.value+" to "+to.value;
            db.ref(keys[index]).update({auth:2})
            db.ref(keys[index]+"/send").update({parttern:the_pattern,sendText:text,amount:amount.value})
            this.followUpState("enterpattern").ask("to "+text+" please enter the following pattern,"+the_pattern,"please say done when you finish","are you done?","say done")
        }
        else
            this.toIntent("LoginIntent")
    },
               'enterpattern': {
                    'DoneIntent':async function() {
                        var UserId=this.getUserId();
                        var Users;
                        Users=await ref.once("value").then((snapshot) =>{
                            return snapshot.val();});
                        var keys=[];
                        var userid=[];
                        var check=[];
                        var sendText=[];
                        var transaction=[];
                        var amount=[];
                        var balance=[]
                        for (var key in Users) {
                                        keys.push(key)
                                        userid.push(Users[key]["userid"])
                                        balance.push(Users[key]["balance"])
                                        check.push(Users[key]["send"]["check"])
                                        sendText.push(Users[key]["send"]["sendText"])
                                        amount.push(Users[key]["send"]["amount"])
                                        transaction.push(Users[key]["transaction"]) 
                        } 
                        var index=userid.indexOf(UserId)
                        var am=amount[index]
                        var latest=transaction[index].length;
                        // if(check[index]){
                            db.ref(keys[index]).update({balance:balance[index]-am})
                            db.ref(keys[index]+"/transaction").update({[latest]:sendText[index]})
                            db.ref(keys[index]+"/send").update({parttern:"",sendText:"",check:false,amount:0})
                            this.ask("The transaction"+sendText+" is Completed, and "+am+" dollar will be deducted from your account, can i help you with something else?","How can I help you?","i am here to help you")
                        // }
                        // else
                        //     this.ask("The transaction"+sendText+" is Denied,please try again","How can I help you?")
                        }
    },
    'orderIntent':async function(order,from) {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var size=[3,4,5,6]
        var keys=[];
        var userid=[];
        var logged_in=[];
        var the_pattern="";
        for (var key in Users) {
                        keys.push(key)
                        userid.push(Users[key]["userid"])
                        logged_in.push(Users[key]["logged_in"]) 
        } 
        var index=userid.indexOf(UserId)
        if(logged_in[index]){
            for(var i=0;i<size[Math.floor(Math.random()*size.length)];i++)
                the_pattern=the_pattern+Math.round(Math.random())
            for(var i=0;i<3;i++){
                the_pattern=the_pattern.replace("1","long press ,")
                the_pattern= the_pattern.replace("0","short press ,")
            }
            var text="order  4 pizza from zomato";
            this.followUpState("enterpattern").ask("to "+text+" please enter the following pattern,"+the_pattern,"please say done when you finish","are you done?","say done")
        }
        else
            this.toIntent("LoginIntent")
    },
    'LogoutIntent':async function() {
        var UserId=this.getUserId();
        var Users;
        Users=await ref.once("value").then((snapshot) =>{
            return snapshot.val();});
        var keys=[];
        var userid=[];
        for (var key in Users) {
                keys.push(key)
                userid.push(Users[key]["userid"])
        } 
        var index=userid.indexOf(UserId)
            db.ref(keys[index]).update({logged_in:false,auth:0})
            this.tell('Thanks you for using smart banking,,,I hope to see you again soon.')
    },
    'AMAZON.HelpIntent': function() {
            this.ask('how can i help you?,you can ask me to check you balance, or to send money',"how can i help you?")
    },

});

module.exports.app = app;