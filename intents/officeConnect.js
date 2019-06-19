const generic = require('../helpers/generic');


const OfficeConnectIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeConnectIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();

        let officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let contact = await generic.getProximityOfficeContact(officeSlot);

        let message_know_more = messages.KNOW_MORE_OFFICE.replace(/{office}/g,officeSlot);

        let returnMessage = messages.OFFICE_CONNECT_RESPONSE;
        returnMessage = returnMessage.replace(/{office}/g,officeSlot);
        returnMessage = returnMessage.replace(/{contact}/g,contact);
            
        return handlerInput.responseBuilder.speak(returnMessage).reprompt(message_know_more).getResponse();
    },
};

module.exports = OfficeConnectIntent;