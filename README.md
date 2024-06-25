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

```
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
```

## Getting Started

### Prerequisites

* **Node.js** : v14 or above
* **MongoDB** : Local or cloud MongoDB instance
* **Prisma CLI** : Installed globally (`npm install -g prisma`)

### Installation

1. **Clone the repository** :

   ```
   git clone https://github.com/spm999/Social-Media-API.git
   ```
2. **Install dependencies** :

   ```
   npm install
   ```
3. **Set up environment variables** :
   Create a `.env` file in the root directory and add the following:

```
    PORT=
    MONGODB_URI=
    JWT_SECRET_KEY=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
```

4. **Generate Prisma Client** :

   ```
   npx prisma generate
   ```
5. **Run migrations** :

   ```
   npx prisma migrate deploy
   ```
6. **Compile TypeScript** :

   ```
   npx tsc
   ```

### Running the Server

    Start the server with:

```
   npm start
```

The API will be available at `http://localhost:{PORT}`.

## API Endpoints

### User Management

* **Register a new user** : `POST http://localhost:5000/api/users/register`
* **Login** : `POST http://localhost:5000/api/users/login`
* **Upload Profile Image** : `POST http://localhost:5000/api/users/upload-pimg`
* **Update user Bio** : `PUT http://localhost:5000/api/users/update-bio`

### Post Management

* **Create a post** : `POST http://localhost:5000/api/users/create-post`
* **Get all Public posts** : `GET http://localhost:5000/api/users/all-posts`
* **Get all post with public and friends visibility** : `GET http://localhost:5000/api/users/auth-all-posts`
* **Update a post** : `PUT http://localhost:5000/api/users/update-post/:postId`
* **Delete a post** : `DELETE http://localhost:5000/api/users/delete-post/:postId`

### Comment Management

* **Create a comment** : `POST http://localhost:5000/api/users/create-comment/:postId`
* **Update a comment** : `PUT http://localhost:5000/api/users/post/:commentId`
* **Delete a comment** : `DELETE http://localhost:5000/api/users/post/:commentId`
* **Get Comment BY comment Id:** `Get http://localhost:5000/api/users/comment/:commentId`
* **Get comment by Post Id:** `Get http://localhost:5000/api/users/post/:postId`

### Like Management

* **Add a like to a post** : `POST http://localhost:5000/api/users/likes`
* **Remove a like from a post** : `DELETE http://localhost:5000/api/users/likes`
* **Get likes by Post Id:**` Get http://localhost:5000/api/users/posts/:postId/likes`
* **Get likes by user Id :** `Get http://localhost:5000/api/users/likes/user`

### Friendship Management

* **Send a friend request** : `POST http://localhost:5000/api/users/friend-request`
* **Accept a friend request** : `POST http://localhost:5000/api/users/friend-request/accept`
* **Reject a friend request** : `POST http://localhost:5000/api/users/friend-request/reject`
* **Get all friends** : `Get http://localhost:5000/api/users/friends`

### Message management

* **Send message**: `Post http://localhost:5000/api/users/messages`
* **Get Message:** `Get http://localhost:5000/api/users/messages/:otherUserId`
* **Mark as Read:**` PUT http://localhost:5000/api/users/messages/:messageId/read`

### Group Management

* **Create a group** : `POST http://localhost:5000/api/users/groups`
* **Get group details by Id** : `GET http://localhost:5000/api/users/groups/:groupId`
* **Update group details** : `PUT http://localhost:5000/api/users/groups/:groupId`
* **Delete a group** : `DELETE http://localhost:5000/api/users/groups/:groupId`

### Group Membership Management

* **Request group membership** : `POST http://localhost:5000/api/users/groups/:groupId/request`
* **Accept group membership request** : `POST http://localhost:5000/api/users/groups/:groupId/accept`
* **Reject group membership request** : `POST http://localhost:5000/api/users/groups/:groupId/reject`
* **Remove a group member** : `Post http://localhost:5000/api/users/groups/:groupId/remove`
* **Get group members** : `GET http://localhost:5000/api/users/groups/:groupId/members`

### Group Post Management

* **Create a group post** : `POST http://localhost:5000/api/users/groups/:groupId/posts`
* **Get group posts** : `GET http://localhost:5000/api/users/groups/:groupId/posts`
* **Delete a post:** `Delete http://localhost:5000/api/users/groups/:groupId/posts/:postId`

### Notification Management

* **Get notifications** : `GET http://localhost:5000/api/users/notifications`
* **Mark notification as read** : `PUT http://localhost:5000/api/users/notifications/:notificationId/read`
* **Delete Notification:** `Delete http://localhost:5000/api/users/notifications/`:`notificationId`

## Authentication

The API uses JWT for authentication. To access protected routes, include the JWT token in the `Authorization` header of your requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes you propose.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact [[msurya9701@gmail.com]()].
