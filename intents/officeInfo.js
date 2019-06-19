const generic = require('../helpers/generic');


const OfficeInfoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeInfoIntent');
    },
    async handle(handlerInput) {
        let proximity_offices = await generic.getProximityOffices();
        let officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let message = proximity_offices[officeSlot];
            
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeInfoIntent;