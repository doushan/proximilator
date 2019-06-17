var generic = require('../helpers/generic');

const OfficeDistanceIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeDistanceIntent');
    },
    async handle(handlerInput) {
        var messages = await generic.getMessages();
        var officeSlotFrom ="";
        var officeSlotTo = "";
        var distance= "";

        if (handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
            
        if(handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH"){
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            distance = await generic.getProximityOfficesDistance(officeSlotFrom, officeSlotTo);
        }
            returnMessage = "The distance between " + officeSlotFrom + " to " + officeSlotTo + " is " + distance + " kilometres";

        if (officeSlotFrom == officeSlotTo) {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = (messages.SUGGESTON_DISTANCE_OFFICE);
        }
        else if (officeSlotFrom == "" && officeSlotTo == "") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = "I'm Sorry but " + officeSlotFrom + " and " + officeSlotTo + " does not exist.";
        }
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