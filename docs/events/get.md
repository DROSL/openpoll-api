# Get event info

**HTTP Request**

`GET /events/{code}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

```json
{
    "title": "Untitled event",
    "description": "",
    "file": {
        "_id": "61cb6c53dc8d43ed2882e5ee",
        "name": "logo.png",
        "size": 2056,
        "mimetype": "image/png",
        "createdAt": "2021-12-28T19:58:11.789Z"
    },
    "code": "kelpsj",
    "secret": "only if the user is an organizer of this event",
    "createdAt": "2021-12-28T17:45:56.460Z"
}
```

**Event not found**

```
Status: 404 Not Found
```
