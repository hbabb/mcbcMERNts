[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / updateComment

# Function: updateComment()

> **updateComment**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

This function allows authenticated users to update a comment. It takes a comment
ID and a blog post ID as parameters and the updated comment as the request body.
It checks if the user is authenticated and has the "admin" role or if the user
is the original commenter. If the user does not have permission to update the
comment, it returns a 403 (Forbidden) response with an error message. If the
comment is updated successfully, it returns a 200 (OK) response with the updated
comment.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:447](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L447)
