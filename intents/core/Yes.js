const generic = require('../../helpers/generic');


const YesIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent');
    },
    async handle(handlerInput) {
        // messages = await generic.getMessages();
        let messages = await generic.getMessages();
        proximity_offices = await generic.getProximityOffices();
        return handlerInput.responseBuilder.speak(proximity_offices[officeValue]).getResponse();
        // return handlerInput.responseBuilder.speak(messages.HELP).getResponse();
    },
};

module.exports = YesIntent;