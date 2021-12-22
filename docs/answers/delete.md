# Delete an answer

**HTTP Request**

`DELETE /answers/{answer_id}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `answer_id` | string | path | **Required**. The answer id. |

**Success response**

```
Status: 200 OK
```

**Answer not found**

```
Status: 404 Not Found
```
