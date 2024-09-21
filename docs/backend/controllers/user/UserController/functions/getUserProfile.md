[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/user/UserController](../README.md) / getUserProfile

# Function: getUserProfile()

> **getUserProfile**(`req`, `res`): `Promise`\<`void`\>

Get the profile of the user that is currently authenticated

This function takes an authenticated request object and a response object. It
returns the user document of the user that is currently authenticated in the
response object.

The function first logs a message to the console indicating that it is getting
the user profile. It then logs the user document to the console to help with
debugging. Finally, it returns the user document in the response object as a
JSON response. The user document is an object with the user's properties such as
username, email, and password.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

An authenticated request object with the user document of the user that is
currently authenticated

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

A response object to return the user document in

## Returns

`Promise`\<`void`\>

## Defined in

backend/controllers/user/UserController.ts:196
