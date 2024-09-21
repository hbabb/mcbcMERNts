[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / getBlogBySlug

# Function: getBlogBySlug()

> **getBlogBySlug**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Get a blog post by its slug.

This function takes a slug as a request parameter and fetches the corresponding
blog post from the database. It then returns the blog post as a JSON response.

The function first logs the slug to the console for debugging purposes. It then
fetches the blog post from the database using the findOne() method and sanitizes
the slug input to prevent any MongoDB injection attacks. The sanitized slug is
passed as a query object to the findOne() method.

The function then checks if the blog post was found. If the blog post was not
found, it returns a 404 (Not Found) response with an error message.

If the blog post was found, it returns the blog post as a JSON response using
the res.json() method.

## Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`,
`Record`\<`string`, `any`\>\>

Express request object

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:122](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L122)
