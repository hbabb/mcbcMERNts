[**mcbcmernts**](../../../../README.md) • **Docs**

---

[mcbcmernts](../../../../modules.md) /
[backend/utils/inputValidation](../README.md) / sanitizeInput

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Sanitize user input

This function takes a string as input and sanitizes it using the sanitize-html
library. The function is used to sanitize user input for security reasons.

The function is used to prevent cross-site scripting (XSS) attacks. XSS attacks
occur when an attacker injects malicious code into a web page that is executed
by the user's browser. This can happen if the web page contains user-generated
content that is not properly sanitized.

The sanitize-html library is used to sanitize the input string. The library
removes any HTML tags and attributes that are not explicitly allowed. This
prevents any malicious code from being injected into the web page.

The allowedTags option specifies the HTML tags that are allowed in the input
string. The allowedAttributes option specifies the HTML attributes that are
allowed for each tag.

In this case, the allowedTags option is set to ['b', 'i', 'em', 'strong', 'a'].
This means that the input string is allowed to contain the following HTML tags:

- b: bold text
- i: italic text
- em: emphasized text
- strong: strong text
- a: hyperlink

The allowedAttributes option is set to { 'a': ['href'] }. This means that the
input string is allowed to contain the href attribute for the a tag. The href
attribute specifies the URL of the hyperlink.

## Parameters

• **input**: `string`

The string to sanitize

## Returns

`string`

The sanitized string

## Defined in

backend/utils/inputValidation.ts:81
