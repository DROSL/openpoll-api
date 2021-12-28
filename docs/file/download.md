# Download event file

**HTTP Request**

`GET /events/{code}/file`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |

**Success response**

```
Status: 200 OK
```

**File not found**

```
Status: 404 Not Found
```