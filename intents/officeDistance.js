var generic = require('../helpers/generic');

const OfficeDistanceIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeDistanceIntent');
    },
    async handle(handlerInput) {
        // Get the list of messages
        let messages = await generic.getMessages();

        let officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        // If the officeFrom == Office to. Return Message they are the same.
        if (officeSlotFrom == officeSlotTo) {
            return handlerInput.responseBuilder.speak(messages.SUGGESTON_DISTANCE_OFFICE).getResponse();
        }

        let distance = await generic.getProximityOfficesDistance(officeSlotFrom, officeSlotTo);

        let returnMessage = "The distance between " + officeSlotFrom + " to " + officeSlotTo + " is " + distance + " kilometres";

        return handlerInput.responseBuilder.speak(returnMessage).getResponse();
    },
};

module.exports = OfficeDistanceIntent;