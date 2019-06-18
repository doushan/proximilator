var generic = require('../helpers/generic');


const OfficeCountIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeCountIntent');
    },
    async handle(handlerInput) {
        let message = await generic.getMessages();
        proximity_offices = await generic.getProximityOffices();
        message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeCountIntent;