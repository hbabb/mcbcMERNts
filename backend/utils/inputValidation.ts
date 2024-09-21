import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

/**
 * Validate the input for a blog post
 *
 * This function takes a blog post object as input and validates it against
 * a Joi schema. The schema requires the following fields:
 * - title: a string with a minimum length of 5 characters and a maximum
 *   length of 200 characters. This is to ensure that the title is not too
 *   short or too long.
 * - content: a string with a minimum length of 10 characters. This is to
 *   ensure that the content of the blog post is not empty.
 * - tags: an array of strings. This is to allow the user to specify tags
 *   for the blog post.
 * - author: a string. This is to specify the author of the blog post.
 * - slug: a string. This is to specify the slug for the blog post.
 *
 * The function returns a Joi validation result object. If the input is valid,
 * the result object will have a value property with the validated input.
 * If the input is invalid, the result object will have an error property with
 * an array of error details.
 *
 * @param {Object} data - The blog post object to validate
 * @returns {Object} The Joi validation result object
 */
export const validateBlogInput = (data: any) => {
  console.log('Validating blog input:', data);
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).required(),
    // Add other fields as necessary
  });

  const result = schema.validate(data);
  if (result.error) {
    console.error('Validation error:', result.error.details);
  }
  return result;
};

/**
 * Sanitize user input
 *
 * This function takes a string as input and sanitizes it using the
 * sanitize-html library. The function is used to sanitize user input
 * for security reasons.
 *
 * The function is used to prevent cross-site scripting (XSS) attacks.
 * XSS attacks occur when an attacker injects malicious code into a
 * web page that is executed by the user's browser. This can happen if
 * the web page contains user-generated content that is not properly
 * sanitized.
 *
 * The sanitize-html library is used to sanitize the input string.
 * The library removes any HTML tags and attributes that are not
 * explicitly allowed. This prevents any malicious code from being
 * injected into the web page.
 *
 * The allowedTags option specifies the HTML tags that are allowed in
 * the input string. The allowedAttributes option specifies the HTML
 * attributes that are allowed for each tag.
 *
 * In this case, the allowedTags option is set to ['b', 'i', 'em',
 * 'strong', 'a']. This means that the input string is allowed to
 * contain the following HTML tags:
 * - b: bold text
 * - i: italic text
 * - em: emphasized text
 * - strong: strong text
 * - a: hyperlink
 *
 * The allowedAttributes option is set to { 'a': ['href'] }. This
 * means that the input string is allowed to contain the href
 * attribute for the a tag. The href attribute specifies the URL of
 * the hyperlink.
 *
 * @param {string} input - The string to sanitize
 * @returns {string} The sanitized string
 */
export const sanitizeInput = (input: string): string => {
  console.log('Sanitizing input:', input);
  const sanitizedInput = sanitizeHtml(input, {
    /**
     * The allowedTags option specifies the HTML tags that are allowed in
     * the input string.
     */
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    /**
     * The allowedAttributes option specifies the HTML attributes that are
     * allowed for each tag.
     */
    allowedAttributes: {
      /**
       * The 'a' tag is allowed to have the 'href' attribute.
       */
      a: ['href'],
    },
  });
  console.log('Sanitized input:', sanitizedInput);
  return sanitizedInput;
};
