const generic = require('../../helpers/generic');

const YesIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();

        //Get the list of the Proximity offices.
        proximity_offices = await generic.getProximityOffices();
        
        //Get the session attribute of the value stored.
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // Condition in order to check if OfficeName has been set previously.
        // If true - return "tell me more content"
        // else return to help
        if (sessionAttributes.officeName) {
            return handlerInput.responseBuilder.speak(proximity_offices[sessionAttributes.officeName]).getResponse();
          } else {
            return handlerInput.responseBuilder
              .speak(messages.HELP)
              .getResponse();
          }
    },
};

module.exports = YesIntent;