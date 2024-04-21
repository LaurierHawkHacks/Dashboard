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
