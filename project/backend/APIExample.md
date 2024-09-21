# API Documentation Example

## Get User Profile

Retrieves the profile information for a specific user.

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: The unique identifier of the user

### Success Response

- **Code**: 200 OK
- **Content Example**:

```json
{
  "id": "123",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2023-04-15T10:30:00Z"
}
```

### Error Response

- **Code**: 404 Not Found
- **Content Example**:

```json
{
  "error": "User not found"
}
```

## Create New Blog Post

Creates a new blog post for the authenticated user.

- **URL**: `/api/posts`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: Bearer [access_token]

### Request Body

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post."
}
```

### Success Response

- **Code**: 201 Created
- **Content Example**:

```json
{
  "id": "456",
  "title": "My First Blog Post",
  "content": "This is the content of my blog post.",
  "createdAt": "2023-04-16T14:20:00Z",
  "author": "john_doe"
}
```

### Error Response

- **Code**: 400 Bad Request
- **Content Example**:

```json
{
  "error": "Title is required"
}
```
