[**mcbcmernts**](../../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../../modules.md) /
[backend/controllers/blog/blogController](../README.md) / getBlogById

# Function: getBlogById()

> **getBlogById**(`req`, `res`): `Promise`\<`Response`\<`any`,
> `Record`\<`string`, `any`\>\>\>

Get blog post by ID

This function takes a blog ID as a request parameter and fetches the
corresponding blog post from the database. It then returns the blog post as a
JSON response.

## Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`,
`Record`\<`string`, `any`\>\>

Express request object

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response object

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

## Defined in

[backend/controllers/blog/blogController.ts:67](https://github.com/Data-Point-Solutions/mcbcMERNts/blob/c075a2f91fc90c2c88df62270de0475f3bdb96de/backend/controllers/blog/blogController.ts#L67)
