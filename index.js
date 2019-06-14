/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

let messages;
let officeValue = "";
let nearestOfficeValue = "";
let proximity_offices;
let proximity_offices_country;
const PERMISSIONS = ['read::alexa:device:all:address'];

// require('./generics/generic');

var generic = require('./generics/generic.js');

// Helper Functions
const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        messages = await generic.getMessages();
        console.log("LAUNCHED REQUEST....");
        return handlerInput.responseBuilder.speak(messages.WELCOME)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

const OfficeConnectIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeConnectIntent');
    },
    async handle(handlerInput) {
        var officeSlot = "";
        var message = "";
        
        if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            contact = await generic.getProximityOfficeContact(officeSlot);
            message = "You can contact " + officeSlot + " on " + contact;
        }
        else {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
            message = "I'm Sorry but " + officeSlot + " does not exist.";
        }

        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

const OfficeCountIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeCountIntent');
    },
    async handle(handlerInput) {

        var message;

        proximity_offices = await generic.getProximityOffices();

        // if (handlerInput.requestEnvelope.request.intent.slots.country.resolutions == "undefined") {
        //     message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";
        // } else if(handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
        //     message = "This is a a tesst";
        // }

        message = "There are " + Object.keys(proximity_offices).length + " offices in the Proximity Global Network";

        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

const OfficeInfoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeInfoIntent');
    },
    async handle(handlerInput) {
        var office = "";
        proximity_offices = await generic.getProximityOffices();
        var message = "";
        if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            message = proximity_offices[officeSlot];
        } else {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
            message = "I'm sorry. but the " + officeSlot + " does not exist.";
        }
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

const OfficeAltitudeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeAltitudeIntent');
    },
    async handle(handlerInput) {
        var proximity_office = await generic.getProximityOfficesAltitude();
        console.log("PROX OFFICESS", proximity_office);
        return handlerInput.responseBuilder.speak(proximity_office.split("||")[0] + " has the highest altitude at "+proximity_office.split("||")[1]+" meters above sea level").reprompt(messages.KNOW_MORE).getResponse();
    },
};

const OfficeCountryIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeCountryIntent');
    },
    async handle(handlerInput) {

        var message = "";
        var country = "";
        let messageMore = "";
        var countryMessage = handlerInput.requestEnvelope.request.intent.slots.country.value;

        if (handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {

            country = handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            proximity_office = await generic.getProximityOfficesCountryName(country);
            message = proximity_office + " is found in " + countryMessage;
            messageMore = messages.KNOW_MORE + " about " + proximity_office + "?";
            officeValue = proximity_office;
        }
        else {

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
                let countryCoordinates = await generic.getCountryCoordinates("MU");


                if(typeof address != "undefined"){

     countryCoordinates = await generic.getCountryCoordinates(address.countryCode);
 }
//console.log("countryCoordinates",countryCoordinates);
  //          let nearestOffice = await getNearestOffice(countryCoordinates,handlerInput.requestEnvelope.request.intent.name == 'UserNearestOfficeIntent');
    //        console.log("nearestOffice",nearestOffice);
            // let response;
            // if (address.addressLine1 === null && address.stateOrRegion === null) {
            //     response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
            // } else {
                // const ADDRESS_MESSAGE = `${proximity_offices[proximity_offices_country[address.countryCode]]}`;



                let nearestOffice = await generic.getNearestOffice(countryCoordinates, true);

                officeValue = nearestOffice['office'];

                messageMore = messages.KNOW_MORE + " about " + officeValue + "?";
                message = "No Office is found in " + countryMessage + " . But there is an office nearby you, named " + officeValue + ". And it is " + nearestOffice['distance'] + " km from you";
            }

            catch (error) {
                if (error.name !== 'ServiceError') {
                    const response = responseBuilder.speak(messages.ERROR).getResponse();
                    return response;
                }
                throw error;
            }

        }
        return handlerInput.responseBuilder.speak(message).reprompt(messageMore).getResponse();
    }
};

const OfficeDistanceIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeDistanceIntent');
    },
    async handle(handlerInput) {
        var  messages = await generic.getMessages();
        var officeSlotFrom ="";
        var officeSlotTo = "";
        var distance= "";

        if (handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
            
        if(handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH"){
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            distance = await generic.getProximityOfficesDistance(officeSlotFrom, officeSlotTo);
        }
            returnMessage = "The distance between " + officeSlotFrom + " to " + officeSlotTo + " is " + distance + " kilometres";

        if (officeSlotFrom == officeSlotTo) {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = (messages.SUGGESTON_DISTANCE_OFFICE);
        }
        else if (officeSlotFrom == "" && officeSlotTo == "") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = "I'm Sorry but " + officeSlotFrom + " and " + officeSlotTo + " does not exist.";
        }
        else if (officeSlotTo == "") {
            officeSlotTo = handlerInput.requestEnvelope.request.intent.slots.officeto.value;
            returnMessage = "I'm Sorry but " + officeSlotTo + " does not exist.";
        }
        else if (officeSlotFrom == "") {
            officeSlotFrom = handlerInput.requestEnvelope.request.intent.slots.officefrom.value;
            returnMessage = "I'm Sorry but " + officeSlotFrom + " does not exist.";

        }

        return handlerInput.responseBuilder.speak(returnMessage).getResponse();
    
    },
};

const UserNearestOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserNearestOfficeIntent' || request.intent.name === 'UserFurthestOfficeIntent');
    },
    async handle(handlerInput) {
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

const UserDistanceOfficeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'UserDistanceOfficeIntent');
    },
    async handle(handlerInput) {
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

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        const {
            requestEnvelope
        } = handlerInput
        const request = requestEnvelope.request
        console.log(`${request.reason}: ${request.error.type}, ${request.error.message}`)
        return handlerInput.responseBuilder.getResponse();
    },
};

const YesIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent');
    },
    async handle(handlerInput) {
        messages = await generic.getMessages();
        proximity_offices = await generic.getProximityOffices();
        return handlerInput.responseBuilder.speak(proximity_offices[officeValue]).getResponse();
        // return handlerInput.responseBuilder.speak(messages.HELP).getResponse();
    },
};

const NoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.NoIntent');
    },
    async handle(handlerInput) {
        messages = await generic.getMessages();
        return handlerInput.responseBuilder
            .speak(messages.REJECTION)
            .getResponse();
        // return handlerInput.responseBuilder.speak(messages.REJECTION).getResponse();
    },
};

const UnhandledIntent = {
    canHandle() {
        return true;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.UNHANDLED)
            .reprompt(messages.UNHANDLED)
            .getResponse();
    },
};

const HelpIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.HELP)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

const CancelIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.GOODBYE)
            .getResponse();
    },
};

const StopIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.STOP)
            .getResponse();
    },
};

const GetAddressError = {
    canHandle(handlerInput, error) {
        return error.name === 'ServiceError';
    },
    handle(handlerInput, error) {
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


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequest,
        UserNearestOfficeIntent,
        YesIntent,
        NoIntent,
        UserDistanceOfficeIntent,
        OfficeCountIntent,
        OfficeCountryIntent,
        SessionEndedRequest,
        HelpIntent,
        OfficeInfoIntent,
        OfficeConnectIntent,
        OfficeDistanceIntent,
        CancelIntent,
        OfficeAltitudeIntent,
        StopIntent,
        UnhandledIntent,
    )
    .addErrorHandlers(GetAddressError)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();