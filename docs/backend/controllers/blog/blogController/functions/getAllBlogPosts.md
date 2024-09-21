[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / getAllBlogPosts

# Function: getAllBlogPosts()

> **getAllBlogPosts**(`req`, `res`): `Promise`\<`void`\>

Controller function to get all blog posts from the database This function is
called when the client (i.e. the frontend) makes a GET request to the /blog
route The function uses the Blog model to query the MongoDB database and
retrieve all blog posts It then sends the retrieved blog posts back to the
client in the response

## Parameters

• **req**: `any`

The request object

• **res**: `any`

The response object

## Returns

`Promise`\<`void`\>

## Defined in

backend/controllers/blog/blogController.ts:15
