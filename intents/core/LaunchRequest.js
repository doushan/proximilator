const generic = require('../../helpers/generic');

const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) { 
        let messages = await generic.getMessages();       
        return handlerInput.responseBuilder.speak(messages.WELCOME)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

module.exports = LaunchRequest;