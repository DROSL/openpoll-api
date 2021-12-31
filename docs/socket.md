# Socket server

Connecting with:

```js
import { io } from "socket.io-client";
const socket = io();
```

## Events

The socket server is used exclusively for sending data to the clients. Incoming messages are ignored.

### User joins an event

**Label**

```
user-join
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The code of the event the new user joined. |

### User leaves an event

**Label**

```
user-leave
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The code of the event that the user has left. |

### Poll started

**Label**

```
poll-start
```

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The event code. |
| 2 | `poll_id` | string | The poll id. |
| 3 | `poll_title` | string | The poll title. |

### Poll stopped maneully

Note: This event will only be fired if the organizer manually stops the poll earlier. Otherwise, no event will be fired after the countdown expires.

**Label**

```
poll-stop
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The event code. |
| 2 | `poll_id` | string | The poll id. |

### New Answer added

**Label**

```
answer-add
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The event code. |
| 2 | `poll_id` | string | The poll id. |
| 3 | `answer_id` | string | The answer id. |
| 3 | `answer_title` | string | The answer title. |

### Removed answer

**Label**

```
answer-remove
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The event code. |
| 2 | `poll_id` | string | The poll id. |
| 3 | `answer_id` | string | The answer id. |

### New vote

**Label**

```
vote-new
```

**Data**

| Pos | Name | Type | Description |
| :-- | :-- | :-- | :-- |
| 1 | `code` | string | The event code. |
| 2 | `poll_id` | string | The poll id. |
| 3 | `answer_id` | string | The id of the answer that was voted for. |