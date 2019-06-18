const generic = require('../helpers/generic');


const OfficeInfoIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'OfficeInfoIntent');
    },
    async handle(handlerInput) {
        let messages = await generic.getMessages();
        var office = "";
        proximity_offices = await generic.getProximityOffices();
        var message = "";

        //Get the session attribute of the value stored.
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
<<<<<<< HEAD
        // console.log("sessionAttributes.officeName", sessionAttributes.officeName);
=======
>>>>>>> 80b9597dc440a56a21e076f0c04a01a45fe5eca4

        if (sessionAttributes.officeName) {
            message = proximity_offices[sessionAttributes.officeName];
            console.log("sessionAttributes.officeName", sessionAttributes.officeName);
        } else {
<<<<<<< HEAD
=======
            console.log("ggggggggggggggggggggggggggggggggggg");
>>>>>>> 80b9597dc440a56a21e076f0c04a01a45fe5eca4
            if (handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
                officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.resolutions.resolutionsPerAuthority[0].values[0].value.name;
                message = proximity_offices[officeSlot];
            }
            else {
                officeSlot = handlerInput.requestEnvelope.request.intent.slots.office.value;
                message = "I'm sorry. but the " + officeSlot + " does not exist.";
            }
        }
            
        return handlerInput.responseBuilder.speak(message).getResponse();
    },
};

module.exports = OfficeInfoIntent;