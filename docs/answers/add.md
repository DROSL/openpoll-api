# Add a new answer

**HTTP Request**

`POST /polls/{poll_id}/answers`

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll id. |
| `title` | string | body | **Required**. The title of the answer. |

**Success response**

```
Status: 200 OK
```

```json
{
    "_id": "61c2ffd9b98abd8124e93bdf"
}
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
