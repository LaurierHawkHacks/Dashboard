# Teams Cloud Functions

This document should cover everything you need to know about the teams cloud functions.

## Restrctions

Here are the rules for team creation:

-   A user can only be in one team at a time.
-   A general member of a team can't edit team.
-   A general member of a team can leave the team any time.
-   The owner of a team can edit the team, including deleting the team.
-   A team can only have a maximum number of 4 members.

## Data

This section describes the data structures and the corresponding collection they belong to in Firestore.

### Teams Collection `teams`

Stores the basic data of a team.

-   name `string` - the name of the team. This field must be unique.
-   createdAt `Firestore.Timestamp` - the time when the team was created
-   owner `string` - the uid of the user who created the team

### Members Collection `team-members`

Stores basic information of a member.

-   uid `string`
-   firstName `string`
-   lastName `string`
-   email `string`
-   teamId `string`

### Invitations Collection `team-invitations`

Stores all invitations to join a team.

-   invitedUserId `string` - the id of the user who is being invited
-   sentAt `Firestore.Timestamp` - the time the invitation email was sent
-   status `"pending" | "accepted" | "rejected"` - the status of the invitation
-   teamId `string` - the team that the user is being invite into

## Service Down Codes

### Code 1201

-   Failed to search Firetore for an existing team.

### Code 1202

-   Failed to search Firestore if requesting user owns/belongs to a team while creating a new team.

### Code 1203

-   Failed to create a new team.

### Code 1204

-   Failed to add the requesting user as a member of a newly created team.

### Code 1205

-   Failed to check if user has been accepted into the hackathon or not.

### Code 1206

-   Failed to get user auth records for email access.

### Code 1207

-   Failed to get user's team to send invitations.

### Code 1208

-   Failed to check if invitee has been accepted to HawkHacks
