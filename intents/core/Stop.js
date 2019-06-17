const generic = require('../../helpers/generic');

const StopIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();

        return handlerInput.responseBuilder
            .speak(messages.STOP)
            .getResponse();
    },
};

module.exports = StopIntent;