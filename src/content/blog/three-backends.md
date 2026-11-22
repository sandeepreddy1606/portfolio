---
title: "Three backends, one year: what FastAPI, NestJS and Spring Boot each taught me"
description: "I shipped production services in Python, TypeScript and Java within twelve months. They are not interchangeable, and the differences are not about syntax."
date: "2026-03-14"
tags: ["Backend", "FastAPI", "NestJS", "Spring Boot"]
---

Between early 2025 and early 2026 I shipped backends in three ecosystems: FastAPI for the AI apps, NestJS for BlogX, Spring Boot for the collaborative whiteboard. That was not a survey exercise. Each choice was forced by the problem.

## FastAPI: when the work lives in Python

The AI Mini-Course Generator and the AI Document Assistant both call Gemini, parse structured output and hand it to a React frontend. The document assistant also builds real `.docx` and `.pptx` files.

Every one of those libraries is Python. Reaching them from a Node service means a subprocess, a queue, or a second service — three ways to add failure modes to something that could have been a function call.

FastAPI's real advantage here is not speed. It is that the ML ecosystem and the web layer share a process, so the boundary between "serve a request" and "run the model" is an import statement.

What it costs you: nothing enforces structure. FastAPI will happily let you write a 900-line `main.py`. The discipline has to come from you.

## NestJS: when the business logic is the hard part

BlogX has a public feed, a private dashboard, JWT access tokens with refresh rotation, role-based access control and rate limiting. Almost none of that is interesting computation — it is _rules about who can do what_, and there are a lot of them.

This is exactly what NestJS is for. Guards, interceptors and modules give authorisation a place to live that is not scattered through route handlers. Combined with Prisma, the types run continuously from the database schema to the API response, and a wrong field name is a compile error rather than a 500 in production.

What it costs you: ceremony. A single endpoint touches a controller, a service, a DTO and a module. For a five-route API that is pure overhead. For BlogX it paid for itself the first time I changed the auth model.

## Spring Boot: when the server holds state

The whiteboard is different in kind from the other two. Several people draw on one canvas simultaneously; every stroke broadcasts to all connected clients and persists so the board can be reopened exactly as it was left.

That is a stateful, long-lived-connection problem. Spring's WebSocket support, Spring Security and JPA are mature in a way that matters when the thing you are building is a connection registry rather than a request handler. The JVM's threading story is a genuine advantage when connections outnumber requests.

What it costs you: startup time, memory, and configuration. For a stateless CRUD API this would be the wrong trade.

## The actual lesson

I did not learn three frameworks. I learned that the question "which backend?" is really three different questions:

- **Where does the hard work live?** If it is in Python libraries, use Python.
- **Is the complexity in the rules or in the computation?** Rules want structure. Computation wants to get out of the way.
- **Is the server holding state between requests?** If yes, the runtime's concurrency model stops being an implementation detail.

Answer those three and the framework picks itself. Answer none of them and you pick by habit — which is how a realtime collaboration server ends up in Express, and a three-endpoint AI wrapper ends up with a dependency-injection container.
