# API Documentation

This is the documentation of the API.

## Authorization

This ist easy. 😊 The server does the authorization for you completely, as long as your application supports cookies. On each API endpoint call, the server checks if a user id has been assigned and assigns a new one if not. With this cookie the user authorizes himself.

## Create a new event

**HTTP Request**

`POST /events`

**Success response**

```
Status: 200 OK
```

```json
{
  "title": "Untitled event",
  "code": "",
  "secret": "",
  "createdAt": "2021-12-21T18:34:31.618Z"
}
```

## Join an event

### As a participant

It is necessary to join the event explicitly, as the organizer may block the access for new participants later on.

**HTTP Request**

`POST /events/{code}/join`

**Parameters**

| Name | Type | In | Description |
| :-- | :-- | :-- | :-- |
| `code` | string | body | **Required**. Code of the event. |

**Success response**

```
Status: 200 OK
```

**Event not found**

```
Status: 404 Not Found
```

**Closed for new participants**

The organisator has closed the event for new participants.

```
Status: 403 Forbidden
```

### As an organisator

Organizers can share admin access to their events with other users.

**HTTP Request**

`POST /events/{secret}/edit`

**Parameters**

| Name | Type | In | Description |
| :-- | :-- | :-- | :-- |
| `secret` | string | body | **Required**. Secret of the event. |

**Success response**

```
Status: 200 OK
```

```json
{
  "title": "Untitled event",
  "code": "",
  "secret": "",
  "createdAt": "2021-12-21T18:34:31.618Z"
}
```

**Event not found**

The secret is wrong.

```
Status: 404 Not Found
```

## Get event info

**HTTP Request**

`GET /events/{code}`

**Parameters**

| Name | Type | In | Description |
| :-- | :-- | :-- | :-- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

```json
{
  "title": "Untitled event",
  "code": "",
  "secret": "only if the user is an organisator of the event",
  "createdAt": "2021-12-21T18:34:31.618Z"
}
```

**Event not found**

```
Status: 404 Not Found
```

## Delete an event

**HTTP Request**

`DELETE /events/{code}`

**Parameters**

| Name | Type | In | Description |
| :-- | :-- | :-- | :-- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

**Event not found**

```
Status: 404 Not Found
```
