const generic = require('../helpers/generic');

const OfficeConnectIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeConnectIntent');
    },
    async handle(handlerInput) {
        var officeSlot = "";
        var message = "";
        var contact = "";

        // Get contact details of the Office
        // The validation have been done against the status code in order to avoid an exception thrown if the field is not present.
        // The status code can be either "ER_SUCCESS_MATCH" or "ER_SUCCESS_NO_MATCH" but is always present.
        if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            contact = await generic.getProximityOfficeContact(officeSlot);
            message = "You can contact " + officeSlot + " on " + contact;
        }
        //If non-existant. return Does not exist.
        else {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
            message = "I'm Sorry but " + officeSlot + " does not exist.";
        }
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeConnectIntent;

