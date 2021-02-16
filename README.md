# Document System 📄
Welcome to document system service. 👋

<img width=80% alt="main" src="https://user-images.githubusercontent.com/10775915/107872409-8bff4900-6eed-11eb-84fd-74320da2cf60.png">

# Contents 📦
- [Stacks](#stacks)
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Database](#database)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)
  - [Build the app](#build-the-app)
  - [Docker build](#docker-build)
  - [Docker run](#docker-run)
- [API Examples](#api-examples)
  - [Sign up](#sign-up)
  - [Sign in](#sign-in)
  - [Get all documents](#get-all)
  - [Get document by ID](#get-id)
  - [Create a new document](#create)
  - [Update the document](#update)
  - [Get Inbox](#inbox)
  - [Get Outbox](#outbox)
  - [Get Archive](#archive)
  - [Approve the document](#approve)
  - [Reject the document](#reject)

# <a id="stacks">Stacks</a>
* [React.js](https://reactjs.org)
* [NestJS](https://nestjs.com)
* [TypeScript](https://www.typescriptlang.org)
* [MySQL 8](https://www.mysql.com)

# <a id="architecture">Architecture</a>

## <a id="frontend">Frontend</a>
This is the directory structure for ```frontend```, it is created by ```create-react-app``` with state management library ```mobx```

```
client
├── build
├── public
├── src
│   ├── App.js
│   ├── App.scss
│   ├── index.js
│   ├── index.scss
│   ├── components
│   │   └── ...
│   ├── pages
│   │   └── ...
│   ├── services
│   │   └── ...
│   └── stores
│       └── ...
├── config-overrides.js
├── package.json
└── tsconfig.json
```

## <a id="backend">Backend</a>
```server``` directory structure is as follows, and the necessary information is contained in each folder.

```
server
├── config
├── dist
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── approvers
│   │   └── ...
│   ├── auth
│   │   ├── decorator
│   │   ├── dto
│   │   ├── interface
│   │   └── ...
│   ├── config
│   │   └── ...
│   └── docs
│       ├── dto
│       ├── enum
│       ├── pipes
│       └── ...
├── test
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

# <a id="database">Database</a>
> MySQL 8 ER-Diagram

<img width=80% alt="db" src="https://user-images.githubusercontent.com/10775915/102712694-5fbcb700-4306-11eb-923e-7b2e1ab30ffe.png">

# <a id="getting-started">Getting started</a>
Before getting started, you need config files at ```config/``` follwing the YAML file located in ```config/``` directory. (ex. ```config/default.yml```, ```config/development.yml```)

* ```config/default.yml```
```yaml
server:
  port: 3000

database:
  type: 'mysql'
  port: 3306
  
jwt:
  expiresIn: 3600
```

* ```config/development.yml``` or ```config/production.yml``` (It will atomatically load env files for execution environment)
```yaml
database:
  host: 'localhost'
  username: 'root'
  password: 'password'
  database: 'document'
  synchronize: true

jwt:
  secret: 'sekret'
```

## <a id="installation">Installation</a>
```bash
$ npm install
```

## <a id="running-the-app">Running the app</a>
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## <a id="test">Test</a>
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## <a id="build-the-app">Build the app</a>
```bash
$ npm run build
```

## <a id="docker-build">Docker build</a>
```bash
$ docker build -t server .
```

## <a id="docker-run">Docker run</a>
```bash
$ docker run -it -p 3000:3000 server
```

# <a id="api-examples">API Examples</a>

## <a id="sign-up">Sign up</a>
POST: /api/auth/signup

### Request
```bash
$ curl -X POST localhost:3000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username": "admin@email.com", "password": "1234qwer"}'
```

## <a id="sign-in">Sign in</a>
POST: /api/auth/signin

### Request
```bash
$ curl -X POST localhost:3000/api/auth/signin \
-H "Content-Type: application/json" \
-d '{"username":"admin@email.com", "password":"1234qwer"}'
```

### Response
```javascript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGVtYWlsLmNvbSIsImlhdCI6MTYwODM1NDAwMywiZXhwIjoxNjA4MzU3NjAzfQ.WppOTLdx_n6FEMLGm5z0tbT8h4WMo0zZ6CcxOhDswD8"
}
```

## <a id="get-all">Get all documents (with query)</a>
> <h3>This server authenticates based on <strong>bearer tokens</strong>. Therefore, you must send token together in the <strong>header</strong> of all requests. </h3>
GET: /api/docs

### Request
| parameter |      value     |
|:---------:|:--------------:|
| search    | string <em>(optional)</em> |
| status    | string <em>(optional)</em> |
| category  | string <em>(optional)</em> |

```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs \
```

```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs?search=api \
```

```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs?search=api&category=javascript \
```

### Response
```javascript
[
    {
        "id": 1,
        "title": "hello programming",
        "category": "backend",
        "description": "none",
        "status": "IN_PROGRESS",
        "userId": 1,
        "totalApprovers": 3,
        "createdAt": "2020-12-21T02:28:01.186Z",
        "updatedAt": "2020-12-21T02:32:06.000Z",
        "deletedAt": null
    },
    {
        "id": 2,
        "title": "hello",
        "category": "fullstack",
        "description": "world",
        "status": "IN_PROGRESS",
        "userId": 1,
        "totalApprovers": 3,
        "createdAt": "2020-12-21T02:29:57.206Z",
        "updatedAt": "2020-12-21T02:29:57.206Z",
        "deletedAt": null
    }
]
```

## <a id="get-id">Get document by ID</a>
GET: /api/docs/id/:id

### Request
```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs/id/1 \
```

```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs/id/2 \
```

### Response
```javascript
{
    "id": 1,
    "title": "hello",
    "category": "fullstack",
    "description": "world",
    "status": "IN_PROGRESS",
    "userId": 1,
    "totalApprovers": 3,
    "createdAt": "2020-12-21T02:28:01.186Z",
    "updatedAt": "2020-12-21T02:28:01.186Z",
    "deletedAt": null,
    "approvers": [
        {
            "id": 1,
            "done": false,
            "priority": 2,
            "docId": 1,
            "userId": 3,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        },
        {
            "id": 2,
            "done": false,
            "priority": 0,
            "docId": 1,
            "userId": 3,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        },
        {
            "id": 3,
            "done": false,
            "priority": 1,
            "docId": 1,
            "userId": 1,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        }
    ]
}
```

## <a id="create">Create a new document</a>
POST: /api/docs

### Request
| key        |      value     |
|:----------:|:--------------:|
| title      |     string     |
| category   |     string     |
| description|     string     |
| approvers  |    string[]    |

```bash
$ curl -X POST \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"title": "hello", "description": "world", "category": "fullstack", "approvers": ["test@email.com", "admin@email.com", "test@email.com"]}' \
localhost:3000/api/docs
```

### Response
```javascript
{
    "title": "hello",
    "category": "fullstack",
    "description": "world",
    "status": "IN_PROGRESS",
    "totalApprovers": 3,
    "userId": 1,
    "id": 1,
    "createdAt": "2020-12-21T02:29:57.206Z",
    "updatedAt": "2020-12-21T02:29:57.206Z",
    "deletedAt": null
}
```

## <a id="update">Update the document</a>
> <h3> Only the user who created the document can update it. </h3>

PATCH: /api/docs

### Request
| key        |      value     |
|:----------:|:--------------:|
| title      |     string     |
| category   |     string     |
| description|     string     |
| approvers  |    string[]    |

```bash
$ curl -X PATCH \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"title": "hello programming", "category": "backend", "description": "none"}' \
localhost:3000/api/docs/id/1
```

### Response
```javascript
{
    "id": 1,
    "title": "hello programming",
    "category": "backend",
    "description": "none",
    "status": "IN_PROGRESS",
    "userId": 1,
    "totalApprovers": 3,
    "createdAt": "2020-12-21T02:28:01.186Z",
    "updatedAt": "2020-12-21T02:32:06.000Z",
    "deletedAt": null,
    "approvers": [
        {
            "id": 1,
            "done": false,
            "priority": 2,
            "docId": 1,
            "userId": 3,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        },
        {
            "id": 2,
            "done": false,
            "priority": 0,
            "docId": 1,
            "userId": 3,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        },
        {
            "id": 3,
            "done": false,
            "priority": 1,
            "docId": 1,
            "userId": 1,
            "comment": null,
            "createdAt": "2020-12-21T02:28:01.200Z",
            "updatedAt": "2020-12-21T02:28:01.200Z",
            "deletedAt": null
        }
    ]
}
```

## <a id="inbox">Get Inbox</a>
GET: api/docs/inbox

### Request
```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs/inbox
```

## <a id="outbox">Get Outbox</a>
GET: api/docs/outbox

### Request
```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs/outbox
```

## <a id="archive">Get Archive</a>
GET: api/docs/archive

### Request
```bash
$ curl -X GET \
-H "Authorization: Bearer <token>" \
localhost:3000/api/docs/archive
```

## <a id="approve">Approve the document</a>
PATCH: api/docs/inbox/id/:id

### Request
| key        |      value     |
|:----------:|:--------------:|
|   action   |     string ("approve" or "reject")    |
|  comment   | string <em>(optional)</em>  |

```bash
$ curl -X PATCH \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-H '{"action": "approve"}' \
localhost:3000/api/docs/inbox/id/1
```

## <a id="reject">Reject the document</a>
PATCH: api/docs/inbox/id/:id

### Request
| key        |      value     |
|:----------:|:--------------:|
|   action   |     string ("approve" or "reject")    |
|  comment   | string <em>(optional)</em>  |

```bash
$ curl -X PATCH \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-H '{"action": "reject", "comment": "check"}' \
localhost:3000/api/docs/inbox/id/1
```

# Help
juseongkr@gmail.com
