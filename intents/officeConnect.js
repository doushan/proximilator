const generic = require('../helpers/generic');


const OfficeConnectIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeConnectIntent');
    },
    async handle(handlerInput) {
        let contact = await generic.getProximityOfficeContact(officeSlot);
        let officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        let message = "You can contact " + officeSlot + " on " + contact;
            
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeConnectIntent;