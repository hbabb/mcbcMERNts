[**mcbcmernts**](../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../modules.md) /
[backend/utils/inputValidation](../README.md) / validateBlogInput

# Function: validateBlogInput()

> **validateBlogInput**(`data`): `ValidationResult`\<`any`\>

Validate the input for a blog post

This function takes a blog post object as input and validates it against a Joi
schema. The schema requires the following fields:

- title: a string with a minimum length of 5 characters and a maximum length of
  200 characters. This is to ensure that the title is not too short or too long.
- content: a string with a minimum length of 10 characters. This is to ensure
  that the content of the blog post is not empty.
- tags: an array of strings. This is to allow the user to specify tags for the
  blog post.
- author: a string. This is to specify the author of the blog post.
- slug: a string. This is to specify the slug for the blog post.

The function returns a Joi validation result object. If the input is valid, the
result object will have a value property with the validated input. If the input
is invalid, the result object will have an error property with an array of error
details.

## Parameters

• **data**: `any`

The blog post object to validate

## Returns

`ValidationResult`\<`any`\>

The Joi validation result object

## Defined in

backend/utils/inputValidation.ts:27
