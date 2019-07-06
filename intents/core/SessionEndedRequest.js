const generic = require('../../helpers/generic');

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        const {
            requestEnvelope
        } = handlerInput
        const request = requestEnvelope.request
        console.log(`${request.reason}: ${request.error.type}, ${request.error.message}`)
        return handlerInput.responseBuilder.getResponse();
    },
};

module.exports = SessionEndedRequest;