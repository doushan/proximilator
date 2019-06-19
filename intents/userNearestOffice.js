const generic = require('../helpers/generic');
const PERMISSIONS = ["read::alexa:device:all:address"];

const UserNearestOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserNearestOfficeIntent' || request.intent.name === 'UserFurthestOfficeIntent');
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
            let countryCoordinates = {"lat": -20.2640544, "long": 57.4803621}
            if(typeof requestEnvelope.context.Geolocation != "undefined"){
                const {coordinate} = requestEnvelope.context.Geolocation;
                countryCoordinates = {"lat": coordinate.latitudeInDegrees, "long": coordinate.longitudeInDegrees}
            }
            
            let nearestOffice = await generic.getNearestOffice(countryCoordinates, handlerInput.requestEnvelope.request.intent.name == 'UserNearestOfficeIntent');
            
            
            // set session attribute for user office info
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();            
            sessionAttributes.officeName = nearestOffice['office'];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            let message_know_more = messages.KNOW_MORE_OFFICE.replace(/{office}/g,nearestOffice['office']);
            let returnMessage;
            
            let response;
            if(parseInt(nearestOffice['distance']) < 1){
                returnMessage = messages.OFFICE_NEAREST_RESPONSE_WITHIN_1KM;
                returnMessage = returnMessage.replace(/{office}/g,nearestOffice['office']);
            } else {
                returnMessage = messages.OFFICE_NEAREST_RESPONSE;
                returnMessage = returnMessage.replace(/{office}/g,nearestOffice['office']);
                returnMessage = returnMessage.replace(/{distance}/g,nearestOffice['distance']);
            }

            return responseBuilder.speak(returnMessage + " " + message_know_more).reprompt(message_know_more).getResponse();

        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    },
};

module.exports = UserNearestOfficeIntent;