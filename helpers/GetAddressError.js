const generic = require('./generic');
const PERMISSIONS = ['read::alexa:device:all:address'];
const GetAddressError = {
    canHandle(handlerInput, error) {
        return error.name === 'ServiceError';
    },
    async handle(handlerInput, error) {
        messages = await generic.getMessages();
        if (error.statusCode === 403) {
            return handlerInput.responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(messages.LOCATION_FAILURE)
            .reprompt(messages.LOCATION_FAILURE)
            .getResponse();
    },
};

module.exports = GetAddressError;