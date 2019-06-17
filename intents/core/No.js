const generic = require('../../helpers/generic');

const NoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.NoIntent');
    },
    async handle(handlerInput) {
        // Get the messages
        let messages = await generic.getMessages();

        //Get the session attribute of the value stored.
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // Condition in order to check if OfficeName has been set previously.
        // If true - return rejection message
        // else return to help
        if (sessionAttributes.officeName) {
            return handlerInput.responseBuilder.speak(messages.REJECTION).getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(messages.HELP)
                .getResponse();
        }
    },
};

module.exports = NoIntent;