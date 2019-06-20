# Proximilator

````
    ____   ____   ____  _  __  ____ __  ___ ____ __     ___   ______ ____   ____ 
   / __ \ / __ \ / __ \| |/ / /  _//  |/  //  _// /    /   | /_  __// __ \ / __ \
  / /_/ // /_/ // / / /|   /  / / / /|_/ / / / / /    / /| |  / /  / / / // /_/ /
 / ____// _, _// /_/ //   | _/ / / /  / /_/ / / /___ / ___ | / /  / /_/ // _, _/ 
/_/    /_/ |_| \____//_/|_|/___//_/  /_//___//_____//_/  |_|/_/   \____//_/ |_|  
                                                                        

Proximilator Voice App

This is a voice application for Alexa to get information about proximity offices. 

It has been written in NodeJs and uses AWS services.
````

### Prerequisites
You need to have location permissions allowed on Alexa for the skill to work.

### Folder Structure

````
|   index.js
|   package-lock.json
|   package.json
|   README.md
| 
+---helpers
|       generic.js
|       GetAddressError.js
|       
+---intents
   |   officeAltitude.js
   |   officeConnect.js
   |   officeCount.js
   |   officeCountry.js
   |   officeDistance.js
   |   officeInfo.js
   |   userDistanceOffice.js
   |   userNearestOffice.js
   |   
   \---core
           Cancel.js
           Help.js
           LaunchRequest.js
           No.js
           SessionEndedRequest.js
           Stop.js
           Unhandled.js
           Yes.js
````

### BOT Scenarios
The chatbot supports these scenarios.

#### Scenario #1 : Nearest Office or Furthest Office
User wants to know how far he is from a Proximity Office. He can also ask how he is from a specific office. Or which office is the furthest away from him.

Example 1 :

User wants to know how close he is to a Proximity office.

````
--- This would trigger the intent UserNearestOffice

User: What is my proximity to Proximity?

Proximilator: You are [N] kilometers from [NEAREST OFFICE]. Would you like to know more about [NEAREST OFFICE]?

````
Example 2 :

User wants to know how close he is to a specific Proximity office.

````
--- This would trigger the intent UserDistanceOffice

User: How far am i from [OFFICE]?

Proximilator: You are [N] kilometers from [OFFICE]. Would you like to know more about [OFFICE]?

````

Example 3 :

User wants to know the furthest away office from him.

````
--- This would trigger the intent UserFurthestOffice

User: Which Proximity office is furthest away from me?

Proximilator: You are [N] kilometers from [FURTHEST OFFICE]. Would you like to know more about [FURTHEST OFFICE]?

````

You might have noticed that in all 3 examples, Proximilator will prompt you if you want to know more about the office. You can accept or deny.
* Accepting will trigger the AMAZON.YesItent. 
* Denying will trigger the AMAZON.NoIntent.


#### Scenario #2 : Distance between Offices

User wants to know what is the distance between two Proximity offices.

Example 1:

how far is [OFFICE X] from [OFFICE Y] ?

````
 --- This would trigger `OfficeDistance` intent

User: how far is [OFFICE X] from [OFFICE Y]?  

Proximilator: [OFFICE X] is [N] kilometers from [OFFICE Y]

````

If the user did not provide a value for [OFFICE X] Or [OFFICE Y]. He will receive a prompt in order to satisfy the intent.

Example 2:

how far is [OFFICE X] from [NON-EXISTENT OFFICE]?

````
 --- This would trigger `OfficeDistance` intent

User: how far is [OFFICE X] from [NON-EXISTENT OFFICE]?  

Proximilator: [NON-EXISTENT OFFICE] does not exist. Please provide an existing office Name.

User: [OFFICE Y]

--- The flow then resumes

Proximilator: [OFFICE X] is [N] kilometers from [OFFICE Y]

````

Note: The user can provide both wrong values. And he will get reprompted until a correct value is not input. 


Example 3:

how far is [OFFICE X] from [OFFICE X]?

````
 --- This would trigger `OfficeDistance` intent

User: how far is [OFFICE X] from [OFFICE X]?  

Proximilator: It is the same office. Please try asking again with a different office.

````


#### Scenario #3 : Office is present in a country

The user wants to know if there is an office in a country. If there is an office the details
will be returned to him. Else suggest him the nearest office to him.

Example 1:

User asks if there is an office in a country and it is present.

````
 --- This would trigger `OfficeCountry` intent

User: Is there a Proximity office in [COUNTRY]?

Proximilator: Yes. [OFFICE] is Present. Would you like to know more about [OFFICE]?
````

Example 2:

User asks if there is an office in a country and it is not present.

````
--- This would trigger `OfficeCountry` intent

User: Is there a Proximity office in [COUNTRY]?

Proximilator: No office is found in [COUNTRY]. But there is an office nearby you, named [NEAREST OFFICE] and it is [N] km from you. Would you like to know more about [OFFICE]?

````

Incase the user did not provide a value for [COUNTRY]. He will be prompted to give a country.

You might have noticed that in all 2 examples, Proximilator will prompt you if you want to know more about the office. You can accept or deny.
* Accepting will trigger the AMAZON.YesItent. 
* Denying will trigger the AMAZON.NoIntent.


#### Scenario #4 : Highest Altitude

The user wants to know the highest altitude office present.

Example:

User asks which office has the highest altitude

````
 --- This would trigger `OfficeAltitude` intent

User: Which office has the highest altitude?

Proximilator: [OFFICE] has the highest altitude at [N] meters above sea level. Would you like to know more about [OFFICE]?

````

Proximilator will prompt you if you want to know more about the office. You can accept or deny.
* Accepting will trigger the AMAZON.YesItent. 
* Denying will trigger the AMAZON.NoIntent.


#### Scenario #5 : Office Count

The user wants to know how many offices are present.

Example:

````
 --- This would trigger `OfficeCount` intent

User: How many Proximity Offices are there?

Proximilator: There are [N] offices in the Proximity Global Network.

````

#### Scenario #6 : Office Information

The user wants to know information on a specific office.

Example 1:

````
 --- This would trigger `OfficeInfo` intent

User: Tell me more about [OFFICE]

Proximilator: [OFFICE] is ......

````

Example 2:
User asks for an office which does not exist

````
 --- This would trigger `OfficeInfo` intent

User: Tell me more about [NON-EXISTENT OFFICE]

Proximilator: [NON-EXISTENT OFFICE] does not exist. Please provide an existing office Name.

User: [OFFICE]

--- The flow then resumes

Proximilator: [OFFICE] is ......
````

#### Scenario #7 : Office Connect

The user wants to connect to a specific office

Example 1:

````
 --- This would trigger `OfficeConnect` intent

User: Connect me with [OFFICE]

Proximilator: You can contact [OFFICE] at [CONTACT INFO].

````

Example 2:
User asks for an office which does not exist

````
 --- This would trigger `OfficeConnect` intent

User: Connect me with [NON-EXISTENT OFFICE]

Proximilator: [NON-EXISTENT OFFICE] does not exist. Please provide an existing office Name.

User: [OFFICE]

--- The flow then resumes

Proximilator: You can contact [OFFICE] at [CONTACT INFO].

````

### Code Highlights

#### core

The core folder, is where we keep all the native AMAZON itents.

#### helpers

The helpers folder, is there you have the generic.js. The generic.js file is for functions that can be used in any intents.

#### messages

The messages and information, we are receiving it from a google spreadsheet.
