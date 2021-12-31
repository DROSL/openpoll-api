# Edit a poll

**HTTP Request**

`PUT /polls/{poll_id}`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |
| `title` | string | body | The title of the poll. |
| `type` | string | body | Either `bar` for a bar chart or `word` for a word cloud. |
| `duration` | number | body | The duration of the poll in seconds. |
| `votesPerParticipant` | number | body | The amount of votes each participants has. |
| `allowMultipleVotesPerAnswer` | boolean | body | If set to `true` and `votesPerParticipant` is greater than `1`, participants can use their votes multiple times for the same answer. |
| `allowCustomAnswers` | boolean | body | Set to `true` if participants can add customs answers to the poll. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c2ffd9b98abd8124e93bdf"
}
```
