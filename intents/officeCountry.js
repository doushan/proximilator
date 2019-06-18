var generic = require("../helpers/generic");

let messages;
let officeValue = "";
const PERMISSIONS = ["read::alexa:device:all:address"];

const OfficeCountryIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === "IntentRequest" &&
      request.intent.name === "OfficeCountryIntent"
    );
  },
  async handle(handlerInput) {
    let messages = await generic.getMessages();
    var country = "";
    let messageMore = "";
    var countryMessage = handlerInput.requestEnvelope.request.intent.slots.country.value;

    if (handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
      country =  handlerInput.requestEnvelope.request.intent.slots.country.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      proximity_office = await generic.getProximityOfficesCountryName(country);
      message = proximity_office + " is found in " + countryMessage + ".";
      messageMore = messages.KNOW_MORE + " about " + proximity_office + "?";

      // Set the session attribute of officeName, which will be used in the yes intent(Reprompt of know more).
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      sessionAttributes.officeName = proximity_office;

      officeValue = proximity_office;
    } else {
      messages = await generic.getMessages();
      proximity_offices = await generic.getProximityOffices();
      proximity_offices_country = await generic.getProximityOfficesCountry();

      const {
        requestEnvelope,
        serviceClientFactory,
        responseBuilder
      } = handlerInput;

      const consentToken = requestEnvelope.context.System.user.permissions && requestEnvelope.context.System.user.permissions.consentToken;
      if (!consentToken) {
        return responseBuilder
          .speak(messages.NOTIFY_MISSING_PERMISSIONS)
          .withAskForPermissionsConsentCard(PERMISSIONS)
          .getResponse();
      }

      try {
        const { deviceId } = requestEnvelope.context.System.device;
        const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
        const address = await deviceAddressServiceClient.getFullAddress(
          deviceId
        );
        let countryCoordinates = await generic.getCountryCoordinates("MU");

        if (typeof address != "undefined") {
          countryCoordinates = await generic.getCountryCoordinates(
            address.countryCode
          );
        }
        //console.log("countryCoordinates",countryCoordinates);
        //          let nearestOffice = await getNearestOffice(countryCoordinates,handlerInput.requestEnvelope.request.intent.name == 'UserNearestOfficeIntent');
        //        console.log("nearestOffice",nearestOffice);
        // let response;
        // if (address.addressLine1 === null && address.stateOrRegion === null) {
        //     response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
        // } else {
        // const ADDRESS_MESSAGE = `${proximity_offices[proximity_offices_country[address.countryCode]]}`;

        let nearestOffice = await generic.getNearestOffice(
          countryCoordinates,
          true
        );

        officeValue = nearestOffice["office"];

        messageMore = messages.KNOW_MORE + " about " + officeValue + "?";
        message = "No Office is found in " + countryMessage + " . But there is an office nearby you, named " + officeValue + ". And it is " + nearestOffice["distance"] + " km from you";
      } catch (error) {
        if (error.name !== "ServiceError") {
          const response = responseBuilder.speak(messages.ERROR).getResponse();
          return response;
        }
        throw error;
      }
    }
    return handlerInput.responseBuilder
      .speak(message + ' ' + messageMore)
      .reprompt(messageMore)
      .getResponse();
  }
};

module.exports = OfficeCountryIntent;
