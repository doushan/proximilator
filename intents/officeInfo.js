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
        let proximity_offices = await generic.getProximityOffices();
        let officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let returnMessage = proximity_offices[officeSlot];
            
        return handlerInput.responseBuilder.speak(returnMessage).reprompt(messages.KNOW_MORE).getResponse();
    },
};

module.exports = OfficeInfoIntent;