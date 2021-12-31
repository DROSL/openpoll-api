# Create a new event

**HTTP Request**

`POST /events`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `title` | string | body | The event title. Default `Untitled event`. |
| `description` | string | body | The event description. |
| `open` | boolean | body | Set to `true` if new participants can join the event. Default `true`. |

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
