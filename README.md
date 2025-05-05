# User Feedback System

A scalable backend service built with NestJS to manage user feedback, including optional file attachments, categorized feedback types, and reminders for inactivity.

## Getting Started

### Requirements
- Node.js (v18+)
- PostgreSQL
- MongoDB
- (Optional) Docker & Docker Compose

### Install & Run
Download this project:
```shell script
git clone 
```

### Manual Installation
Install dependencies
```shell script
npm install
```

Copy environment variables
```shell script
cp .env.example .env
```

Before running this project, make sure to configure your environment variables by copying .env.example and updating it with your own values.

#### Run the App

```shell script
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run with Docker (Recomended)
``` shell script
docker-compose up --build
```

### Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

##  Entity Relationship Diagram (ERD)

### Users
| Field     | Type      | Notes                 |
| --------- | --------- | --------------------- |
| id        | UUID      | Primary key           |
| email     | string    | Unique                |
| name      | string    |                       |
| fullname  | string    |                       |
| role      | enum      | `'user'` \| `'admin'` |
| password  | string    | Hashed                |
| createdAt | timestamp |                       |
| updatedAt | timestamp |                       |

### Feedbacks
| Field     | Type      | Notes                                       |
| --------- | --------- | ------------------------------------------- |
| id        | UUID      | Primary key                                 |
| userId    | UUID      |                                |
| category  | string    |                                             |
| message   | text      |                                             |
| status    | enum      | `'PENDING'` \| `'REVIEWED'` \| `'RESOLVED'` |
| createdAt | timestamp |                                             |
| updatedAt | timestamp |                                             |

### FeedbackAttachments
| Field      | Type      | Notes                          |
| ---------- | --------- | ------------------------------ |
| _id         | string      | Primary key                    |
| feedbackId | UUID      |               |
| fileName   | string    | Original filename              |
| path       | string    | Storage path                   |
| mimetype   | string    | MIME type                      |
| size       | string    | File size in bytes (as string) |
| createdAt  | timestamp |                                |

### Relationships
- One `User` → many `Feedbacks`
- One `Feedback` → many `FeedbackAttachments


