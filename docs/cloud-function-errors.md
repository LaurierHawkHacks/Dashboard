# Cloud Function Error Code Dictionary

This is a collection of all the different error codes in our cloud functions and with how to debug it.

## User Functions

### function `verifyRSVP`
- 1102: Error writing document as proof of RSVP verification into Firestore. Collection name: `rsvps`

## Team Functions

### function `getTeamByUser`
- 1201: Error querying team for user.
	- Debug:
		- Firestore rules, are they blocking read/write?
		- Firestore collection name, is the code using the right collection?
		- Inspect `error` field in the function log. Look for code `1201`.
		- If nothing helps, is Firebase down?
- 1202: Error searching if team name is available.
    - Debug:
		- Firestore rules, are they blocking read/write?
		- Firestore collection name, is the code using the right collection?
		- Inspect `error` field in the function log. Look for code `1202`.
		- If nothing helps, is Firebase down?
- 1203: Error checking for duplicate team entry.
    - Debug:
		- Firestore rules, are they blocking read/write?
		- Firestore collection name, is the code using the right collection?
		- Inspect `error` field in the function log. Look for code `1203`.
		- If nothing helps, is Firebase down?
- 1204: Attempt to create a team with the same name as an existing team.
    - This is not an error but it will return a status 400 (bad request) to the client.
- 1205: Attempt to create a team when requesting user already belongs to an existing team.
    - This is not an error but it will return a status 400 (bad request) to the client.
- 1206: Error checking if requesting user already belongs to a team.
    - Debug:
		- Firestore rules, are they blocking read/write?
		- Firestore collection name, is the code using the right collection?
		- Inspect `error` field in the function log. Look for code `1206`.
		- If nothing helps, is Firebase down?
- 1207: Error saving team in firestore.
    - When the code has reached this portion of the code, it involves a 2 steps for storing the team data into firestore.
        1. gets the requesting user application for first and last name information.
        2. tries to save the team data in firestore `teams` collection
    - Debug:
		- Firestore rules, are they blocking read/write?
		- Firestore collection name, is the code using the right collection?
		- Inspect `error` field in the function log. Look for code `1207`.
		- If nothing helps, is Firebase down?
- 1208: Error while trying to fetch the team requesting user belongs for invitations
- 1209: Failed to get team for requesting user - deleteTeam
- 1210: Failed to delete team
