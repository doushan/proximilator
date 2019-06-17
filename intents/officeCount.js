

var generic = require('../generics/generic');
let message;

const OfficeCountIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeCountIntent');
    },
    async handle(handlerInput) {

        message = await generic.getMessages();

        proximity_offices = await generic.getProximityOffices();

        // if (handlerInput.requestEnvelope.request.intent.slots.country.resolutions == "undefined") {
        //     message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";
        // } else if(handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
        //     message = "This is a a tesst";
        // }

        message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";

        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeCountIntent;