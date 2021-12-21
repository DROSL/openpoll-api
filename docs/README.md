# API Documentation

This is the documentation of the API.

## Create new event

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

The server also deletes all current cookies and sets the `secret` cookie for future authorization.

## Join existing event

**HTTP Request**

`POST /join`

**Parameters**

| Name | Type | In | Description |
| :-- | :-- | :-- | :-- |
| `code` | string | body | Code of the event. |
| `secret` | string | body | Secret of the event. |

Either the code or the secret is required to join the event.

**Success response**

```
Status: 200 OK
```

```json
{
  "title": "Untitled event",
  "code": "",
  "secret": "only if you provided a secret in the first place",
  "createdAt": "2021-12-21T18:34:31.618Z"
}
```

The server also deletes all current cookies and sets either the `code` or the `secret` cookie for future authorization.

**Empty request**

Neither the code nor the secret has been set as a parameter.

```
Status: 400 Bad Request
```

**Event not found**

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
| `code` | string | cookie | The code of the event. |
| `secret` | string | cookie | The secret of the event. |

Either the `code` or the `secret` cookie has to been set to get event information.

**Success response**

```
Status: 200 OK
```

```json
{
  "title": "Untitled event",
  "code": "",
  "secret": "only if the secret cookie has been set",
  "createdAt": "2021-12-21T18:34:31.618Z"
}
```
