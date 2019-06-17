const generic = require('../helpers/generic');


const UserDistanceOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserDistanceOfficeIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        messages = await generic.getMessages();
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

            console.log('Address successfully retrieved, now responding to user.', address);
            let countryCoordinates = await generic.getCountryCoordinates("MU");
            if(typeof address != "undefined"){

                countryCoordinates = await generic.getCountryCoordinates(address.countryCode);
            }
            console.log("countryCoordinates", countryCoordinates);

            var office = "";
            let message = "";
            let returnMessage = "";
            let response = "";
            // office = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            let officeDistance;
// console.log("OFFICECE",officeDistance);
            if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
                office = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
                officeDistance = await generic.getProximityUserDistance(countryCoordinates, office);
                message = messages.KNOW_MORE + " about " + office + "?";
                returnMessage = "You are " + officeDistance + " km from " + office;
                response = responseBuilder.speak(returnMessage).reprompt(message).getResponse();

            }
            else {
                office = handlerInput.requestEnvelope.request.intent.slots.office.value;
                returnMessage = "I'm Sorry but " + office + " does not exist.";
                response = responseBuilder.speak(returnMessage).getResponse();
            }
            officeValue = office;

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