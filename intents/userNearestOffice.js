const generic = require('../helpers/generic');


const UserNearestOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserNearestOfficeIntent' || request.intent.name === 'UserFurthestOfficeIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        // messages = await generic.getMessages();
        proximity_offices = await generic.getProximityOffices();
        proximity_offices_country = await generic.getProximityOfficesCountry();
        const {
            requestEnvelope,
            serviceClientFactory,
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
            const {
                deviceId
            } = requestEnvelope.context.System.device;
            const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
            const address = await deviceAddressServiceClient.getFullAddress(deviceId);

            let countryCoordinates = await generic.getCountryCoordinates("MU");
console.log("ADRESSSS",address);
            if(typeof address != "undefined"){
                countryCoordinates = await generic.getCountryCoordinates(address.countryCode);
            }

            let nearestOffice = await generic.getNearestOffice(countryCoordinates, handlerInput.requestEnvelope.request.intent.name == 'UserNearestOfficeIntent');

            officeValue = nearestOffice['office'];
            nearestOfficeValue = nearestOffice['distance'];

            let message = messages.KNOW_MORE + " about " + nearestOffice['office'] + "?";

            let response;
            if(parseInt(nearestOffice['distance']) < 10){
                response = responseBuilder.speak(nearestOffice['office'] + " is very near to you").reprompt(message).getResponse();
            } else if(parseInt(nearestOffice['distance']) < 20){
                response = responseBuilder.speak(nearestOffice['office'] + " is near to you").reprompt(message).getResponse();
            }else {
                response = responseBuilder.speak(nearestOffice['office'] + " is " + nearestOffice['distance'] + " km from you").reprompt(message).getResponse();

            }


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

module.exports = UserNearestOfficeIntent;