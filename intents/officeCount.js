var generic = require('../helpers/generic');


const OfficeCountIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeCountIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        proximity_offices = await generic.getProximityOffices();

        let returnMessage = messages.OFFICE_COUNT_RESPONSE;
        returnMessage = returnMessage.replace(/{count}/g,Object.keys(proximity_offices).length);

        return handlerInput.responseBuilder.speak(returnMessage).reprompt(messages.KNOW_MORE).getResponse();
    },
};

module.exports = OfficeCountIntent;