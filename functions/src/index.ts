import * as functions from 'firebase-functions';
import * as wordhandler from './stories/word-handler';
import * as dialogflowresponse from './dialogflow-response';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request: any, response: any) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const intentMap = new Map<string, (request: any) => Promise<string>>();
  intentMap.set('Word Add', wordhandler.addWord);
  intentMap.set('Word Ask', wordhandler.askWord);
  intentMap.set('Word Delete', wordhandler.deleteWord);
  intentMap.set('Word Search', wordhandler.searchWord);

  const intent = request.body.queryResult.intent.displayName
  const source = request.body.originalDetectIntentRequest.source

  const intentFulfillment = intentMap.get(intent);
  if (intentFulfillment) {
    intentFulfillment(request.body).then(text => {
      const responseBody = dialogflowresponse.formatResponse([text], source)
      console.log('Dialogflow Response body: ' + JSON.stringify(responseBody));
      return response.send(responseBody);
    })
      .catch(err => {
        console.log(`Dialogflow error: ${err}`);
        return response.status(500).send(
          dialogflowresponse.formatResponse(["Désolé, il y a eu une erreur"], source)
        );
      });

  }
  else {
    console.log(`Dialogflow error: intent ${intent} not found`)
    return response.status(500).send(
      dialogflowresponse.formatResponse(["Désolé, il y a eu une erreur"], source)
    );
  }
});