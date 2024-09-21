[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/user/UserController](../README.md) / registerUser

# Function: registerUser()

> **registerUser**(`req`, `res`): `Promise`\<`void`\>

Register a new user

This function takes a request object with a username, email, and password as the
request body. It creates a new user in the database and returns a JSON response
with the new user and a JSON Web Token (JWT) for the user.

This function is called when a user submits the registration form on the client
side. It is called by the Express router and passed the request object as an
argument. The request object contains the username, email, and password entered
by the user as the request body.

The function first checks if the request is valid. If the request is not valid,
it returns a 400 (Bad Request) response with an error message.

The function then creates a new user object with the input from the request
body. It uses the User model to create a new user document in the database. The
User model is defined in the user model file and has a schema that specifies the
properties of a user document. The new user object is created with the username,
email, and password entered by the user as the request body.

The function then saves the user to the database using the save() method of the
User model. This method saves the user document to the database and returns a
promise that is resolved when the user is saved. The promise is resolved with
the saved user document.

The function then generates a JWT for the user using the generateAuthToken()
method of the User model. This method generates a JWT for the user and returns a
promise that is resolved with the JWT.

Finally, the function returns a JSON response with the new user and the JWT. The
response is sent back to the client and contains the user document and the JWT.
The JWT is sent in the response as the "token" property of the response object.

## Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`,
`Record`\<`string`, `any`\>\>

Express request object with the new user information as the request body

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`void`\>

## Defined in

backend/controllers/user/UserController.ts:45
