const generic = require('../helpers/generic');


const OfficeAltitudeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeAltitudeIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();

        // Get the list of the Proximity offices with the highest altitudes.
        var proximity_office = await generic.getProximityOfficesAltitude();

        // Set the session attribute of officeName, which will be used in the yes intent(Reprompt of know more).
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.officeName = proximity_office.split("||")[0];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        

        //{office} + " has the highest altitude at "+{office_altitude}+" meters above sea level."
        let returnMessage = messages.OFFICE_ALTITUDE_RESPONSE;
        returnMessage = returnMessage.replace(/{office}/g,proximity_office.split("||")[0]);
        returnMessage = returnMessage.replace(/{office_altitude}/g,proximity_office.split("||")[1]);

        return handlerInput.responseBuilder.speak(returnMessage + messages.KNOW_MORE+"?").reprompt(messages.KNOW_MORE + " on " + proximity_office.split("||")[0] + "?").getResponse();
    },
};

module.exports = OfficeAltitudeIntent;