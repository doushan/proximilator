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
        let returnMessage = "";
        let officeSlotFrom = "";
        let officeSlotTo = "";
        let distance = "";

        // Get the OfficeFrom value.
        // If the office does not exist/is not present. Value will remain ""
        // The validation have been done against the status code in order to avoid an exception thrown if the field is not present.
        // The status code can be either "ER_SUCCESS_MATCH" or "ER_SUCCESS_NO_MATCH" but is always present.

        if (handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }

        if (handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            
            // Calculate the distance between both
            distance = await generic.getProximityOfficesDistance(officeSlotFrom, officeSlotTo);
        }
        returnMessage = "The distance between " + officeSlotFrom + " to " + officeSlotTo + " is " + distance + " kilometres";

        // If the officeFrom == Office to. Return Message they are the same.
        if (officeSlotFrom == officeSlotTo) {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = (messages.SUGGESTON_DISTANCE_OFFICE);
        }

        // If both of the values are non-existant. Return the message they both do not exist.
        else if (officeSlotFrom == "" && officeSlotTo == "") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = "I'm Sorry but " + officeSlotFrom + " and " + officeSlotTo + " does not exist.";
        }

        // If only one is non-existent. Tell the user which one it is.
        else if (officeSlotTo == "") {
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = "I'm Sorry but " + officeSlotTo + " does not exist.";
        }
        else if (officeSlotFrom == "") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            returnMessage = "I'm Sorry but " + officeSlotFrom + " does not exist.";

        }
        return handlerInput.responseBuilder.speak(returnMessage).getResponse();
    },
};

module.exports = OfficeDistanceIntent;