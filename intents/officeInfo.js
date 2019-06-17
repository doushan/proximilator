const generic = require('../helpers/generic');


const OfficeInfoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeInfoIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        var office = "";
        proximity_offices = await generic.getProximityOffices();
        var message = "";
        if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            message = proximity_offices[officeSlot];
        } else {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
            message = "I'm sorry. but the " + officeSlot + " does not exist.";
        }
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeInfoIntent;