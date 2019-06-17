var generic = require();
const OfficeAltitudeIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeAltitudeIntent');
    },
    async handle(handlerInput) {
        // var proximity_office = await generic.getProximityOfficesAltitude();
        // console.log("PROX OFFICESS", proximity_office);
        return handlerInput.responseBuilder.speak("ok ok ok ok").getResponse();
        // return handlerInput.responseBuilder.speak(proximity_office.split("||")[0] + " has the highest altitude at "+proximity_office.split("||")[1]+" meters above sea level").reprompt(messages.KNOW_MORE).getResponse();
    },
};

module.exports = OfficeAltitudeIntent;