# Delete file from event

**HTTP Request**

`DELETE /events/{code}/file`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

**No file attached to this event**

```
Status: 400 Not Found
```