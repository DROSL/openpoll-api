# Delete an answer

**HTTP Request**

`DELETE /answers/{answer_id}`

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `answer_id` | string | path | **Required**. The answer id. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c2ffd9b98abd8124e93bdf"
}
```

**Answer not found**

```
Status: 404 Not Found
```
