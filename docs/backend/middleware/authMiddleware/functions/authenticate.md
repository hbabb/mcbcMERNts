[**mcbcmernts**](../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../modules.md) /
[backend/middleware/authMiddleware](../README.md) / authenticate

# Function: authenticate()

> **authenticate**(`req`, `res`, `next`): `Promise`\<`void`\>

Middleware that authenticates a user using a JSON Web Token. The token is
expected to be in the Authorization header of the request. The token is verified
and then used to find the user in the database. If the user is found, the
request is passed to the next middleware. If the user is not found or the token
is invalid, a 401 response is returned.

## Parameters

• **req**: [`AuthenticatedRequest`](../interfaces/AuthenticatedRequest.md)

The Express request object.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

The Express response object.

• **next**: `NextFunction`

The next middleware function to call.

## Returns

`Promise`\<`void`\>

## Defined in

backend/middleware/authMiddleware.ts:20
