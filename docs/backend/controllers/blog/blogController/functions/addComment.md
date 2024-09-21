# Function: addComment()

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / addComment

> **addComment**(`req`, `res`): `Promise`\<`any`\>

Controller to add a comment to a blog post This function is called when the
client (i.e. the frontend) makes a PUT request to the /blog/:id route The
function does the following:

1. Retrieves the blog post with the specified id from the MongoDB database
2. Adds the comment to the blog post
3. Saves the updated blog post back to the database
4. Sends the updated blog post back to the client in the response

## Parameters

• **req**: `any`

The request object

• **res**: `any`

The response object

## Returns

`Promise`\<`any`\>

## Defined in

backend/controllers/blog/blogController.ts:46
