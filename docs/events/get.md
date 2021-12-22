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
	"code": "",
	"secret": "only if the user is an organisator of the event",
	"createdAt": "2021-12-21T18:34:31.618Z"
}
```

**Event not found**

```
Status: 404 Not Found
```
