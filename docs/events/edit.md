# Edit an event

**HTTP Request**

`PUT /events/{code}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |
| `title` | string | body | The title of the event. |
| `description` | string | body | The event description. |
| `open` | boolean | body | Set to `true` if new participants can join the event. |

**Success response**

```
Status: 200 OK
```