# Add a new answer

**HTTP Request**

`POST /polls/{poll_id}/answers`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |
| `title` | string | body | **Required**. The title of the answer. |
| `hidden` | boolean | body | Indicates if the answer is visible to participants. Default `false`. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c308b0f53359e59e492b78",
    "title": "0 legs",
    "hidden": false
}
```

**Poll not found**

```
Status: 404 Not Found
```

**Missing fields**

```
Status: 400 Bad Request
```

**Duplicate answer**

An answer with this title already exists for this vote.

```
Status: 409 Conflict
```

**Permission denied**

Participants can add their own answers only if the organizer of the poll has allowed it.

```
Status: 403 Forbidden
```
