var generic = require("../helpers/generic");
const PERMISSIONS = ["read::alexa:device:all:address"];

const OfficeCountryIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (request.type === "IntentRequest" && request.intent.name === "OfficeCountryIntent");
  },
  async handle(handlerInput) {
    let messages = await generic.getMessages();
    let distance;    

    let country = handlerInput.requestEnvelope.request.intent.slots.country.value;
    let proximity_office = await generic.getProximityOfficesCountryName(country);

    // if country found else no country found for proximity office
    if(proximity_office == '') {
      // get user location
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

        let nearestOffice = await generic.getNearestOffice(countryCoordinates, true);
        proximity_office = nearestOffice['office'];
        distance = nearestOffice['distance'];
      } catch (error) {
        if (error.name !== 'ServiceError') {
            const response = responseBuilder.speak(messages.ERROR).getResponse();
            return response;
        }
        throw error;
      }
    }

    let message_know_more = messages.KNOW_MORE_OFFICE.replace(/{office}/g,proximity_office);
    let returnMessage;

    if(typeof distance == 'undefined'){
      returnMessage = messages.OFFICE_COUNTRY_FOUND_RESPONSE;
      returnMessage = returnMessage.replace(/{office}/g,proximity_office);
      returnMessage = returnMessage.replace(/{country}/g,country);
    } else {
      returnMessage = messages.OFFICE_COUNTRY_NOTFOUND_RESPONSE;
      returnMessage = returnMessage.replace(/{country}/g,country);
      returnMessage = returnMessage.replace(/{office}/g,proximity_office);
      returnMessage = returnMessage.replace(/{distance}/g,distance);
    }
     
    // set session attribute for user office info
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();   
    sessionAttributes.officeName = proximity_office;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);  

    return handlerInput.responseBuilder
    .speak(returnMessage + ' ' + message_know_more)
    .reprompt(message_know_more)
    .getResponse();
  }
};

module.exports = OfficeCountryIntent;
