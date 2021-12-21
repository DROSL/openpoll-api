# Join an event

## As a participant

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

## As an organisator

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