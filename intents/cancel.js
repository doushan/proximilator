
let messages;
var generic = require('../generics/generic');

const CancelIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    async handle(handlerInput) {
        messages = await generic.getMessages();

        return handlerInput.responseBuilder
            .speak(messages.GOODBYE)
            .getResponse();
    },
};

module.exports = CancelIntent;


// const CancelIntent = {
//     canHandle(handlerInput) {
//         const {
//             request
//         } = handlerInput.requestEnvelope;

//         return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
//     },
//     handle(handlerInput) {
//         return handlerInput.responseBuilder
//             .speak(messages.GOODBYE)
//             .getResponse();
//     },
// };

// ORIGINAL CODE - ADDED ASYNC AND GET FOR MESSAGES