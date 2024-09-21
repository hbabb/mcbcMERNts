[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/user/UserController](../README.md) / updateUserProfile

# Function: updateUserProfile()

> **updateUserProfile**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Update the profile of the user that is currently authenticated

This function takes an authenticated request object and a response object. It
updates the user document of the user that is currently authenticated with the
updates in the request body and saves the user document to the database. If the
user document is updated successfully, it returns the updated user document in
the response object as a JSON response. If there is an error updating the user
document, the function returns a 400 (Bad Request) response with an error
message.

The function first logs a message to the console indicating that it is updating
the user profile. It then logs the user document to the console to help with
debugging. Finally, it updates the user document with the updates in the request
body and saves the user document to the database. If the user document is
updated successfully, it returns the updated user document in the response
object as a JSON response. If there is an error updating the user document, the
function returns a 400 (Bad Request) response with an error message.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

An authenticated request object with the user document of the user that is
currently authenticated

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

A response object to return the user document in

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

backend/controllers/user/UserController.ts:234
