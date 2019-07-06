const generic = require('../../helpers/generic');

const HelpIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        return handlerInput.responseBuilder
            .speak(messages.HELP)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};


module.exports = HelpIntent;