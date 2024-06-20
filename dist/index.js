"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./prisma")); // Import the prisma client
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const post_1 = __importDefault(require("./routes/post"));
const friendship_1 = __importDefault(require("./routes/friendship"));
const comment_1 = __importDefault(require("./routes/comment"));
const like_1 = __importDefault(require("./routes/like"));
const message_1 = __importDefault(require("./routes/message"));
const notification_1 = __importDefault(require("./routes/notification"));
const group_1 = __importDefault(require("./routes/group")); // Adjust the path according to your project structure
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.urlencoded({ extended: true, }));
// Connect to Prisma (or MongoDB in your case)
prisma_1.default.$connect()
    .then(() => console.log('Connected to MongoDB via Prisma'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/users', user_1.default); // Use user routes
app.use('/api/users', post_1.default); // Use post routes
app.use('/api/users', friendship_1.default); // Use friendship routes
app.use('/api/users', comment_1.default); // Use comment routes
app.use('/api/users', like_1.default); //use like route
app.use('/api/users', message_1.default); //use message route
app.use('/api/users/', notification_1.default); //use notification route
app.use('/api/users/', group_1.default); //use group route
app.get('/', (req, res) => res.send('API Running'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
