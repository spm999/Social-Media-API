# Social Media API

## Overview

The **Social Media API** is a backend service developed with TypeScript and Express.js, designed to handle various social media functionalities such as user management, posts, comments, likes, friendships, and group interactions. This project leverages Prisma as an ORM for MongoDB, providing a robust and scalable solution for social media applications.

## Features

* **User Management** : Register, login, and manage user profiles.
* **Post Management** : Create, update, delete, and interact with posts.
* **Comments** : Add, update, and delete comments on posts.
* **Likes** : Like and unlike posts.
* **Friendships** : Send, accept, reject, and manage friend requests.
* **Groups** : Create, manage, and interact within groups.
* **Notifications** : Notify users of important events like friend requests and post interactions.

## Technologies

* **Node.js** : JavaScript runtime for building scalable network applications.
* **Express.js** : Web framework for Node.js.
* **TypeScript** : Typed superset of JavaScript for safer and more maintainable code.
* **Prisma** : Next-generation ORM for database access.
* **MongoDB** : NoSQL database for data storage.
* **JWT** : JSON Web Tokens for authentication.

## Project Structure

.
├── src
│   ├── config
│   │   └── cloudinary.ts
│   ├── controllers
│   │   ├── commentController.ts
│   │   ├── friendshipController.ts
│   │   ├── groupController.ts
│   │   ├── groupMembershipController.ts
│   │   ├── groupPostController.ts
│   │   ├── likeController.ts
│   │   ├── messageController.ts
│   │   ├── notificationController.ts
│   │   ├── postController.ts
│   │   ├── userController.ts
│   ├── middleware
│   │   └── authMiddleware.ts
│   ├── routes
│   │   ├── commentRoutes.ts
│   │   ├── friendshipRoutes.ts
│   │   ├── groupRoutes.ts
│   │   ├── groupPostRoutes.ts
│   │   ├── likeRoutes.ts
│   │   ├── messageRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── postRoutes.ts
│   │   └── userRoutes.ts
│   ├── utils
│   │   └── jwt.ts
│   ├── index.ts
│   └── prisma.ts
├── prisma
│   └── schema.prisma
├── dist
│   └── (compiled files)
├── .env
├── package.json
├── tsconfig.json
└── README.md
