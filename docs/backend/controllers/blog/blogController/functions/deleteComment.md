[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / deleteComment

# Function: deleteComment()

> **deleteComment**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Delete a comment from a blog post. Only the original commenter or an admin can
delete a comment.

This function takes a blog post ID and a comment ID as parameters. It first
checks if the blog ID and comment ID are valid. If they are not, it returns a
400 (Bad Request) response with an error message.

If the IDs are valid, it fetches the blog post with the given ID from the
database. If the blog post is not found, it returns a 404 (Not Found) response
with an error message.

If the blog post is found, it fetches the comment with the given ID from the
blog post. If the comment is not found, it returns a 404 (Not Found) response
with an error message.

If the comment is found, it checks if the user has permission to delete the
comment. The user must be the original commenter or an admin. If the user does
not have permission, it returns a 403 (Forbidden) response with an error
message.

If the user has permission, it finds the index of the comment to delete in the
blog post's comments array. It then uses the splice() method to remove the
comment from the array.

Finally, it saves the updated blog post to the database and returns a 200 (OK)
response with a success message.

## Parameters

• **req**:
[`AuthenticatedRequest`](../../../../middleware/authMiddleware/interfaces/AuthenticatedRequest.md)

Express request object with authenticated user information

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:545](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L545)
