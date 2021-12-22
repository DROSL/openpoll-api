# Start a poll

**HTTP Request**

`PUT /polls/{poll_id}/start`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll_id. |

**Success response**

```
Status: 200 OK
```

**Poll not found**

```
Status: 404 Not Found
```

# Stop a poll

**HTTP Request**

`PUT /polls/{poll_id}/stop`

**Parameters**

| Name   | Type   | In   | Description                          |
| :----- | :----- | :--- | :----------------------------------- |
| `poll_id` | string | path | **Required**. The poll_id. |

**Success response**

```
Status: 200 OK
```

**Poll not found**

```
Status: 404 Not Found
```
