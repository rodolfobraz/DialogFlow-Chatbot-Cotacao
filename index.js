// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function cotacaoRate(agent) {
      let currency1 = agent.parameters["currency-name"];
      var currency2 = agent.parameters["currency-name1"];
      var bot_response;
      var url = `https://economia.awesomeapi.com.br/${currency1}-${currency2}`;
      return getRate(url)
        .then((response) => {
          bot_response =
            "A cotação é " + response.data[0].high;

          console.log(bot_response);
          agent.add(bot_response);
        })
        .catch((error) => {
          console.log("Algo deu errado!! ");
          console.log(error);
          agent.add(bot_response);
        });
    }

    function getRate(url) {
      const axios = require("axios");
      return axios.get(url);
    }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  intentMap.set('cotacao', cotacaoRate);
  agent.handleRequest(intentMap);
});
