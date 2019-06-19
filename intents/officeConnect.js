const generic = require('../helpers/generic');


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
        var contact = "";

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // if there is session and value is present in input, overwrite the session one to the new value.
        if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH" && sessionAttributes.officeName) {
            // incase the values are the same. return the message
            if (sessionAttributes.officeName == handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name) {
                contact = await generic.getProximityOfficeContact(sessionAttributes.officeName);
                message = "You can contact " + sessionAttributes.officeName + " on " + contact;
            }
            //set the new session value to the input value
            else {
                officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;

                sessionAttributes.officeName = officeSlot;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                contact = await generic.getProximityOfficeContact(officeSlot);
                message = "You can contact " + officeSlot + " on " + contact;
            }
        }
        //If present in session, get the value.
        else if (sessionAttributes.officeName) {
            contact = await generic.getProximityOfficeContact(sessionAttributes.officeName);
            message = "You can contact " + sessionAttributes.officeName + " on " + contact;
        }

        //If non-existant. return Does not exist.
        else {
            officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
            message = "I'm Sorry but " + officeSlot + " does not exist.";
        }
        return handlerInput.responseBuilder.speak(message).getResponse();
    },

};

module.exports = OfficeConnectIntent;

