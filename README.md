# User Feedback System

REST API with NestJS framework and postgreSQL database

## [Nestjs-Feedback-System](https://github.com/HasanNugroho/nestjs-feedback-system)

## Getting Started

### Requirements

- Node.js (v18+)
- PostgreSQL
- MongoDB
- (Optional) Docker & Docker Compose

### Install & Run

Download this project:
```shell script
git clone https://github.com/HasanNugroho/nestjs-feedback-system.git
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

```shell script
# Application Configuration
NODE_ENV=development
APP_NAME="User Feedback System"
APP_DESC="A system for managing user feedback."
VERSION=1.0.0
PORT=3000

# PostgreSQL Database Configuration
DB_USER=dbUser
DB_PASS=dbPass
DB_NAME=test
DB_PORT=5432
DB_HOST=localhost

# MongoDB Configuration
MONGO_DSN=mongodb://localhost:27017/test

# JWT Authentication Configuration
JWT_SECRET_KEY=Rah4514
JWT_EXPIRED='1h'

# Reminder Configuration
REMINDER_DEFAULT_DAYS=7
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

# running on default port 3000
```

### Run with Docker (Recomended)

``` shell script
docker-compose up -d
```

### Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

### API Documentation

This project uses **Swagger** for API documentation. you can access the documentation at: **[http://localhost:3000/api](http://localhost:3000/api)**

### Static File Access

The feedback attachment can be accessed via a static link in the following format:
http://localhost:3000/{path_from_feedback_detail}

Example : for example if the response file attachment to the API is `/asset/image.png` you can see it at `http://localhost:3000/asset/image.png`


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

## Structures

```
src/
├── app.module.ts                      
├── main.ts                         
|
├── config/                           
│   ├── app.config.ts
│   └── database.config.ts
|
├── common/                        
│   ├── decorators/          
│   │   └── user.decorator.ts
│   ├── dtos/        
│   │   ├── page-meta.dto.ts
│   │   ├── page-option.dto.ts
│   │   └── response.dto.ts
│   ├── enums/                  
│   │   ├── event-name.enum.ts
│   │   ├── feedback.enum.ts
│   │   ├── order.enum.ts
│   │   └── role.enum.ts    
│   ├── filters/              
│   │   └── http-exception.filter.ts    
│   ├── interfaces/              
│   │   ├── service-adapter.interface.ts
│   │   └── user.interface.filter.ts    
│   └── constant.ts         
|
├── auth/                    
│   ├── adapters/               
│   │   └── external-user-service.adapter.ts
│   ├── decorators/               
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dtos/                       
│   │   ├── credential-response.dto.ts
│   │   └── credential.dto.ts
│   ├── guards/ 
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interfaces/
│   │   └── auth-service.interface.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts
│   └── auth.module.ts
|
├── user/           
│   ├── adapters/
│   │   └── user-service.adapter.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   ├── response-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── interfaces/
│   │   ├── user-repository.interface.ts
│   │   └── user-service.interface.ts
│   ├── models/
│   │   └── user.model.ts     
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.service.spec.ts
│   └── user.module.ts
|
├── feedback/       
│   ├── adapters/
│   │   ├── feedback-service.adapter.ts
│   │   └── external-user-service.adapter.ts
│   ├── controllers/
│   │   └── feedback.controller.ts
│   ├── dtos/
│   │   ├── create-feedback.dto.ts
│   │   ├── update-feedback.dto.ts
│   │   └── filter-feedback.dto.ts
│   ├── events/           
│   │   ├── feedback-create.event.ts
│   │   └── feedback-reminder.event.ts
│   ├── listeners/        
│   │   └── feedback.listener.ts
│   ├── models/
│   │   ├── feedback-attachment.schema.ts
│   │   └── feedback.model.ts
│   ├── repositories/
│   │   ├── feedback-attachment.repository.ts
│   │   └── feedback.repository.ts
│   ├── feedback.controller.ts
│   ├── feedback.service.ts
│   ├── feedback.service.spec.ts
│   └── feedback.module.ts
|
├── scheduler/       
│   ├── adapters/
│   │   └── external-feedback-service.adapter.ts
│   ├── scheduler.service.ts
│   └── scheduler.module.ts
```

## System Design Decisions & Architectural Rationale

The system is designed using a **modular monolithic architecture**, aimed at simplifying development and maintenance while ensuring clear separation between business domains. Key design decisions include:

- **Domain-based modular structure**  
  Each core functionality (e.g., user, feedback) is encapsulated in its own module, making the codebase easier to scale and maintain. This separation also lays the groundwork for a smooth transition to microservices in the future.

- **DTOs and interfaces**  
  DTOs provide validation between the presentation and application layers, and interfaces ensure that implementing classes remain consistent, allowing for easy replacement of infrastructure in the future.

- **Event-driven feedback module**  
  module supports internal events (`EventEmitters`) and listeners, making it easy to extend with message brokers in the future.

- **Loose coupling via adapters**  
  Modules do not depend directly on each other. Business services interact only through interfaces and adapters, reducing tight coupling and improving testability and future extensibility.

- **Local storage for file attachments** 
  Feedback file attachments are saved to the local file system to simulate file storage.


## Evolve to microservices

The current codebase is intentionally structured to enable the transition to a microservice architecture. Here's how it works:

- Domain Module → Microservices Each domain (user, feedback) stands on its own, making it easy to extract as a separate service at a later date.

- Inter-Service Communication Ready EventEmitter can be replaced by a messaging intermediary (e.g. RabbitMQ, Kafka) for inter-service communication.

- Shared Interfaces and Adapters Interfaces in the common/ directory allow replacement of service implementations via REST API or gRPC without changing the domain logic.

## Credits

- **[NestJS](https://nestjs.com/)** - A framework server-side applications. 
- **[TypeORM](https://typeorm.io/)** - An ORM for TypeScript and JavaScript.
- **[Swagger](https://swagger.io/)** - A tool API documentation.
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database system.
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling tool for Node.js.
- **[Jest](https://jestjs.io/)** - A testing framework for JavaScript.

## Copyright

Copyright (c) 2025 Burhan Nurhasan Nugroho.