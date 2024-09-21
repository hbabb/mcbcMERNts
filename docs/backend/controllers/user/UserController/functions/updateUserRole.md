[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/user/UserController](../README.md) / updateUserRole

# Function: updateUserRole()

> **updateUserRole**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

This function is an admin-only function that updates the role of a user in the
database. It is used by the admin to update the role of a user in the database.
The function first checks if the user is an admin and if the user is not an
admin, it returns a 403 (Forbidden) response with an error message. If the user
is an admin, it updates the role of the user with the given ID to the given
role. The function logs messages to the console to help with debugging.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

backend/controllers/user/UserController.ts:334
