# Get all answers of a poll

**HTTP Request**

`GET /polls/{poll_id}/answers`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |

**Success response**

```
Status: 200 OK
```

```json
[
    {
        "_id": "61c2fa59ea2c210bf43907cc",
        "title": "4 legs",
        "hidden": false
    }
]
```

Note: For participants the list only contains answers that have not been hidden by an organizer.

**Poll not found**

```
Status: 404 Not Found
```
