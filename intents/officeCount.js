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
        let message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";
        return handlerInput.responseBuilder.speak(message + messages.KNOW_MORE).getResponse();
    },
};

module.exports = OfficeCountIntent;