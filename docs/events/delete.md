# Delete an event

**HTTP Request**

`DELETE /events/{code}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

**Event not found**

```
Status: 404 Not Found
```
