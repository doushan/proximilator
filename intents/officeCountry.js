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
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();       

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
  
    let messageMore = messages.KNOW_MORE + " about " + proximity_office + "?";
    let message;
    if(typeof distance == 'undefined'){
      message = proximity_office + " is found in " + country + ". ";
    } else {
      message = "No office is found in " + country + " . But there is an office nearby you, named " + proximity_office + " and it is " + distance + " km from you. ";
    }
     
    // set session attribute for user office info
    sessionAttributes.officeName = proximity_office;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);  

    return handlerInput.responseBuilder
    .speak(message + ' ' + messageMore)
    .reprompt(messageMore)
    .getResponse();
  }
};

module.exports = OfficeCountryIntent;
