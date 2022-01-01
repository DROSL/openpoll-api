# Get a poll

**HTTP Request**

`GET /polls/{poll_id}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c2f51d0f592329113cf7c0",
    "title": "How many legs does a spider have?",
    "event": "61c2f5120f592329113cf7bd",
    "type": "bar",
    "votesPerParticipant": 1,
    "allowMultipleVotesPerAnswer": false,
    "allowCustomAnswers": false,
    "duration": 180,
    "activeUntil": null,
    "createdAt": "2021-12-22T09:51:25.286Z",
}
```

**Poll not found**

```
Status: 404 Not Found
```
