const generic = require('../../helpers/generic');

const NoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.NoIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        return handlerInput.responseBuilder
            .speak(messages.REJECTION)
            .getResponse();
    },
};

module.exports = NoIntent;