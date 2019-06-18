/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');

// Core Intents
const LaunchRequest = require('./intents/core/LaunchRequest');
const CancelIntent = require('./intents/core/Cancel');
const HelpIntent = require('./intents/core/Help');
const NoIntent = require('./intents/core/No');
const YesIntent = require('./intents/core/Yes');
const UnhandledIntent = require('./intents/core/Unhandled');
const StopIntent = require('./intents/core/Stop');
const SessionEndedRequest = require('./intents/core/SessionEndedRequest');


// Custom Intents
const OfficeAltitude = require('./intents/OfficeAltitude');
const OfficeConnect = require('./intents/OfficeConnect');
const OfficeCount = require('./intents/OfficeCount');
const OfficeCountry =  require('./intents/OfficeCountry');
const OfficeInfo = require('./intents/OfficeInfo');
const UserDistanceOffice = require('./intents/UserDistanceOffice');
const UserNearestOffice = require('./intents/UserNearestOffice');
const OfficeDistance =  require('./intents/OfficeDistance');

// Helpers
const GetAddressError = require('./helpers/GetAddressError');

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

