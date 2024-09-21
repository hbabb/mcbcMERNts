[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/user/UserController](../README.md) / logoutUser

# Function: logoutUser()

> **logoutUser**(`req`, `res`): `Promise`\<`void`\>

Log out a user This function takes an authenticated request object and a
response object. It logs out the user by removing the JWT from the user's token
array and saving the user to the database. The user's tokens array is an array
of objects, where each object has a token property that contains the JWT that is
used to authenticate the user. The function filters the tokens array to remove
the JWT that is currently being used to authenticate the user. If there is an
error logging out the user, the function returns a 500 (Internal Server Error)
response with an error message.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

An authenticated request object with the user document and the JWT

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

A response object

## Returns

`Promise`\<`void`\>

## Defined in

backend/controllers/user/UserController.ts:154
