const generic = require('../helpers/generic');
const PERMISSIONS = ["read::alexa:device:all:address"];

const UserDistanceOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserDistanceOfficeIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        const {
            requestEnvelope,
            responseBuilder
        } = handlerInput;

        const consentToken = requestEnvelope.context.System.user.permissions &&
            requestEnvelope.context.System.user.permissions.consentToken;
        if (!consentToken) {
            return responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
        }
        try {
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();            
            let countryCoordinates = {"lat": -20.2640544, "long": 57.4803621}
            if(typeof requestEnvelope.context.Geolocation != "undefined"){
                const {coordinate} = requestEnvelope.context.Geolocation;
                countryCoordinates = {"lat": coordinate.latitudeInDegrees, "long": coordinate.longitudeInDegrees}
            }
            let office = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            let officeDistance = await generic.getProximityUserDistance(countryCoordinates, office);
            

            // set session attribute for user office info
            sessionAttributes.officeName = office;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            let message_know_more = messages.KNOW_MORE + " about " + office + "?";
            let message = "You are " + officeDistance + " km from " + office;
            response = responseBuilder.speak(message + " " + message_know_more).reprompt(message_know_more).getResponse();
            return response;

        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    },
};

module.exports = UserDistanceOfficeIntent;