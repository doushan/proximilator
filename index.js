/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');

// Core Intents
const LaunchRequest = require('./intents/core/launchRequest');
const CancelIntent = require('./intents/core/cancel');
const HelpIntent = require('./intents/core/help');
const NoIntent = require('./intents/core/no');
const YesIntent = require('./intents/core/yes');
const UnhandledIntent = require('./intents/core/unhandled');
const StopIntent = require('./intents/core/stop');
const SessionEndedRequest = require('./intents/core/sessionEndedRequest');


// Custom Intents
const OfficeAltitude = require('./intents/officeAltitude');
const OfficeConnect = require('./intents/officeConnect');
const OfficeCount = require('./intents/officeCount');
const OfficeCountry =  require('./intents/officeCountry');
const OfficeInfo = require('./intents/officeInfo');
const UserDistanceOffice = require('./intents/userDistanceOffice');
const UserNearestOffice = require('./intents/userNearestOffice');
const OfficeDistance =  require('./intents/officeDistance');

// Helpers
const GetAddressError = require('./helpers/getAddressError');

// Register Request Handlers
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        // register launch request
        LaunchRequest,

        // register custom intents
        OfficeAltitude,
        OfficeConnect,
        OfficeCount,
        OfficeCountry,
        OfficeInfo,
        UserDistanceOffice,
        UserNearestOffice,
        OfficeDistance,
        
        // register core intents
        CancelIntent,
        HelpIntent,
        NoIntent,
        YesIntent,
        StopIntent,
        UnhandledIntent,
        SessionEndedRequest,
    )
    .addErrorHandlers(GetAddressError)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();

