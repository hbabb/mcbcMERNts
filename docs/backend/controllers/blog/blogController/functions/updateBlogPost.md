[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / updateBlogPost

# Function: updateBlogPost()

> **updateBlogPost**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Update a blog post (editor only)

This function takes a blog post ID as a request parameter and a blog post object
as the request body. It updates the blog post with the given ID with the given
blog post object.

The function first checks if the request is authenticated and if the user has
the "editor" role. If the user is not authenticated or does not have the
"editor" role, it returns a 403 (Forbidden) response with an error message.

The function then checks if the blog post ID is valid. If the blog post ID is
not valid, it returns a 400 (Bad Request) response with an error message.

The function then validates the blog post object. If the blog post object is
invalid, it returns a 400 (Bad Request) response with an error message.

The function then updates the blog post with the given ID with the given blog
post object. If the blog post with the given ID does not exist, it returns a 404
(Not Found) response with an error message.

If the blog post is updated successfully, it returns a 200 (OK) response with
the updated blog post object.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:251](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L251)
