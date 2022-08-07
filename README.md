## Testing with Containers

This repo is a playground for experimenting with [testcontainers-node](https://github.com/testcontainers/testcontainers-node)

> Testcontainers is a NodeJS library that supports tests, providing lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.

In here you will find:

- an approach at tying prisma into a containerized postgres instance ([./test/prisma.ts](https://github.com/stewartnoll/testingwithcontainers/blob/main/test/prisma.test.ts))
- supertest-powered integration test covering an express app utilizing prisma and postgres ([./test/express-and-prisma.test.ts](https://github.com/stewartnoll/testingwithcontainers/blob/main/test/express-and-prisma.test.ts))
- reproduction of tests found in testcontainers-node repo linked above

Prerequisite:

- Docker (running)

To run tests:

```
npm test
```

\*\* note: first run of the tests will take some time due to images being pulled down from dockerhub hence the long timeouts in each test. Subsequent runs will not incur the download hit
