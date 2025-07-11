const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameSocket = require('./sockets/gameSocket');
require('./db'); // initialize pool

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount API routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Initialize Socket.IO handlers
gameSocket(io);

server.listen(4000, () => console.log('Backend running on port 4000'));
