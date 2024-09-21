[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / createBlogPost

# Function: createBlogPost()

> **createBlogPost**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Create a new blog post (editor only)

This function takes a blog post as a JSON object in the request body and creates
a new blog post in the database. It checks if the request is authenticated and
if the user has the "editor" role. If the request is invalid, it returns a 400
(Bad Request) response with an error message. If the request is valid, it
creates the blog post and returns a 201 (Created) response with the new blog
post.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:170](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L170)
