/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

let messages;
let proximity_offices;
let proximity_offices_country;
const PERMISSIONS = ['read::alexa:device:all:address'];

// Helper Functions
const getMessages = async () => {
  let final = {};
  await axios.get('https://spreadsheets.google.com/feeds/list/1lgsc6VYu3cXbhnrcIFp1IhqQyIcIKWSPvZr4wxvOvKk/1/public/values?alt=json')
      .then(function(response) {
          var results = response.data;
          results.feed.entry.forEach((item)=>{
            final[item.gsx$key.$t] = item.gsx$value.$t;
          });
      })
      .catch(function(error) {
          console.log(error);
      });
  return final;
}

const getProximityOffices = async () => {
  let final = {};
  await axios.get('https://spreadsheets.google.com/feeds/list/1lgsc6VYu3cXbhnrcIFp1IhqQyIcIKWSPvZr4wxvOvKk/2/public/values?alt=json')
      .then(function(response) {
          var results = response.data;
          results.feed.entry.forEach((item)=>{
            final[item.gsx$officename.$t] = item.gsx$details.$t;
          });
      })
      .catch(function(error) {
          console.log(error);
      });
  return final;
}

const getProximityOfficesCountry = async () => {
  let final = {};
  await axios.get('https://spreadsheets.google.com/feeds/list/1lgsc6VYu3cXbhnrcIFp1IhqQyIcIKWSPvZr4wxvOvKk/2/public/values?alt=json')
      .then(function(response) {
          var results = response.data;
          results.feed.entry.forEach((item)=>{
            final[item.gsx$country.$t] = item.gsx$officename.$t;
          });
      })
      .catch(function(error) {
          console.log(error);
      });
  return final;
}


const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        messages = await getMessages();
        console.log("LAUNCHED REQUEST....");
        return handlerInput.responseBuilder.speak(messages.WELCOME)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

const ProximilatorIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'ProximilatorIntent';
    },
    async handle(handlerInput) {
      messages = await getMessages();
      proximity_offices = await getProximityOffices();
      proximity_offices_country = await getProximityOfficesCountry();
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

            console.log('Address successfully retrieved, now responding to user.');

            let response;
            if (address.addressLine1 === null && address.stateOrRegion === null) {
                response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
            } else {
                const ADDRESS_MESSAGE = `${proximity_offices[proximity_offices_country[address.countryCode]]}`;
                response = responseBuilder.speak(ADDRESS_MESSAGE).getResponse();
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

const OfficeLocatorIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'OfficeLocatorIntent';

    },
    async handle(handlerInput) {
      messages = await getMessages();
      proximity_offices = await getProximityOffices();
        const {
            requestEnvelope,
            responseBuilder
        } = handlerInput;
        let response;
        try {
            var officeSlot = requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            console.log("OFFICE", officeSlot);
            if (!proximity_offices.hasOwnProperty(officeSlot.toLowerCase())) {
                response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
            } else {
                const OFFICE_MESSAGE = `${proximity_offices[officeSlot.toLowerCase()]}`;
                response = responseBuilder.speak(OFFICE_MESSAGE).getResponse();
            }
        } catch (error) {
            response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
        }


        return response;




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
            .reprompt(messages.HELP)
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
        ProximilatorIntent,
        OfficeLocatorIntent,
        SessionEndedRequest,
        HelpIntent,
        CancelIntent,
        StopIntent,
        UnhandledIntent,
    )
    .addErrorHandlers(GetAddressError)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();