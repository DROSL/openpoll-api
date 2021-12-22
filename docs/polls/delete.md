# Delete a poll

**HTTP Request**

`DELETE /polls/{poll_id}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |

**Success response**

```
Status: 200 OK
```

**Poll not found**

```
Status: 404 Not Found
```
