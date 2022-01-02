# Vote for an answer

**HTTP Request**

`POST /answers/{answer_id}/vote`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `answer_id` | string | path | **Required**. The answer id. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c30b21f53359e59e492b82",
    "answer": "61c2fafe5390f8c7c5794e78",
    "createdAt": "2021-12-22T11:25:21.467Z",
}
```

**Answer not found**

```
Status: 404 Not Found
```

**Duplicate vote**

The participant has already voted for this answer.

```
Status: 403 Forbidden
```

**No more votes left**

The participant has used all of his votes for this poll.

```
Status: 403 Forbidden
```
