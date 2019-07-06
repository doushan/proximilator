const generic = require('../../helpers/generic');

const UnhandledIntent = {
    canHandle() {
        return true;
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        return handlerInput.responseBuilder
            .speak(messages.UNHANDLED)
            .reprompt(messages.UNHANDLED)
            .getResponse();
    },
};

module.exports = UnhandledIntent;