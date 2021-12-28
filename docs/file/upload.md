# Upload file to event

**HTTP Request**

`POST /events/{code}/file`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `code` | string | path | **Required**. The code of the event. |
| `file` | file | body | **Required**. The file to be uploaded. |

**Success response**

```
Status: 200 OK
```

**File too large**

The maximum allowed file size is 100 MB by default.

```
Status: 400 Bad Request
```

**File upload failed**

```
Status: 500 Internal Server Error
```