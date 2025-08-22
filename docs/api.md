# API Documentation - TarefasNG

## Base URL
```
http://localhost:3001/api
```

## Authentication
All task-related endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Tasks API

### Get Tasks by Quadrant
**GET** `/tasks/quadrants`

Returns tasks organized by Eisenhower Matrix quadrants.

**Response:**
```json
{
  "success": true,
  "data": {
    "Q1": {
      "count": 3,
      "tasks": [...]
    },
    "Q2": {
      "count": 2,
      "tasks": [...]
    },
    "Q3": {
      "count": 2,
      "tasks": [...]
    },
    "Q4": {
      "count": 1,
      "tasks": [...]
    }
  }
}
```

### Get All Tasks
**GET** `/tasks`

**Query Parameters:**
- `quadrant` (string): Filter by quadrant (Q1, Q2, Q3, Q4)
- `status` (string): Filter by status (pending, in_progress, completed, cancelled)
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

### Create Task
**POST** `/tasks`

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "priority": "high",
  "isImportant": true,
  "dueDate": "2025-08-25T00:00:00.000Z",
  "tags": ["security", "audit"],
  "estimatedTime": 120
}
```

### Update Task
**PUT** `/tasks/:id`

**Request Body:** Same as create task

### Delete Task
**DELETE** `/tasks/:id`

## Task Object Structure

```json
{
  "_id": "unique-id",
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2025-08-25T00:00:00.000Z",
  "priority": "high",
  "isUrgent": true,
  "isImportant": true,
  "eisenhowerQuadrant": "Q1",
  "status": "pending",
  "createdBy": {
    "_id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "assignedTo": {
    "_id": "assignee-id",
    "name": "Assignee Name",
    "email": "assignee@example.com"
  },
  "tags": ["security", "audit"],
  "estimatedTime": 120,
  "actualTime": 90,
  "createdAt": "2025-08-22T00:00:00.000Z",
  "updatedAt": "2025-08-22T00:00:00.000Z"
}
```

## Eisenhower Matrix Logic

Tasks are automatically classified into quadrants based on:

1. **Q1 (Do First)**: `isUrgent: true` AND `isImportant: true`
2. **Q2 (Schedule)**: `isUrgent: false` AND `isImportant: true`
3. **Q3 (Delegate)**: `isUrgent: true` AND `isImportant: false`
4. **Q4 (Eliminate)**: `isUrgent: false` AND `isImportant: false`

**Urgency Calculation:**
A task is considered urgent if its due date is within 3 days or overdue:
```javascript
isUrgent = dueDate <= (today + 3 days)
```

## Priority Levels
- `critical`: Highest priority
- `high`: High priority
- `medium`: Medium priority
- `low`: Lowest priority

## Status Values
- `pending`: Task not started
- `in_progress`: Task is being worked on
- `completed`: Task is finished
- `cancelled`: Task was cancelled