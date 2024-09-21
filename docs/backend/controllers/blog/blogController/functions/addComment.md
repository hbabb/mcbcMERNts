[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / addComment

# Function: addComment()

> **addComment**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Add a comment to a blog post

This function takes a blog post ID as a request parameter and a comment object
as the request body. It adds the comment to the blog post with the given ID.

The function first checks if the request is authenticated and if the blog post
ID is valid. If the blog post ID is not valid, it returns a 400 (Bad Request)
response with an error message.

The function then checks if the comment is empty. If the comment is empty, it
returns a 400 (Bad Request) response with an error message.

The function then fetches the blog post from the database using the blog post
ID. If the blog post is not found, it returns a 404 (Not Found) response with an
error message.

The function then adds the comment to the blog post and saves the blog post. If
the comment is added successfully, it returns a 200 (OK) response with a success
message.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:376](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L376)
