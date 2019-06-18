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
<<<<<<< HEAD
        
        return handlerInput.responseBuilder.speak(proximity_office.split("||")[0] + " has the highest altitude at "+proximity_office.split("||")[1]+" meters above sea level").reprompt(messages.KNOW_MORE).getResponse();
=======

        return handlerInput.responseBuilder.speak(proximity_office.split("||")[0] + " has the highest altitude at "+proximity_office.split("||")[1]+" meters above sea level. "+ messages.KNOW_MORE).reprompt(messages.KNOW_MORE + " on " + proximity_office.split("||")[0]).getResponse();
>>>>>>> 80b9597dc440a56a21e076f0c04a01a45fe5eca4
    },
};

module.exports = OfficeAltitudeIntent;