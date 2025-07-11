# 🃏 Card Bidding Game Webapp

A real-time multiplayer card bidding game built with React, Node.js, Socket.IO, and PostgreSQL.

## 🎮 Game Overview

This is a strategic multiplayer card bidding game where players compete to win cards through bidding. Each card provides different benefits that contribute to your final score.

### Game Rules

- **10 rounds** per game
- **120 seconds** per round for bidding
- **Minimum 2 players** required to start
- **Highest bid wins** the card
- **Power points** determine the winner

### Card System

Each card has three attributes:
- **Power**: Adds to player's power points (main scoring)
- **Heal**: Adds to power points (bonus points)  
- **Extra Money**: Adds coins back to player's balance

### Strategic Elements

- **Resource Management**: Start with 1000 coins, spend wisely
- **Card Evaluation**: Assess power/heal value vs. bid cost
- **Risk Assessment**: Bid strategically against other players
- **Timing**: Save coins for high-value cards

## 🏗️ Architecture

```
cardgame-webapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # React components
│   │   ├── context/       # Authentication context
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── Dockerfile
├── server/                 # Node.js backend
│   ├── routes/            # API endpoints
│   ├── controllers/       # Request handlers
│   ├── models/            # Database models
│   ├── sockets/           # Socket.IO game logic
│   ├── auth/              # Authentication services
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── Dockerfile
├── db/                     # Database schema and seeds
│   ├── schema.sql         # Database structure
│   └── seed_game_and_cards.sql
├── docker-compose.yml      # Multi-container setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cardgame-webapp
```

### 2. Set Up Environment Variables

```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://gameuser:gamepass@localhost:5432/cardgame
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
NODE_ENV=development
```

### 3. Start the Application

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** database on port 5432
- **Backend API** on port 4000
- **Frontend** on port 3000

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api-docs

## 🛠️ Development Setup

### Frontend Development

```bash
cd client
npm install
npm run dev
```

### Backend Development

```bash
cd server
npm install
npm run dev
```

### Database Setup

```bash
# Connect to PostgreSQL
psql postgresql://gameuser:gamepass@localhost:5432/cardgame

# Run schema
\i db/schema.sql

# Seed initial data
\i db/seed_game_and_cards.sql
```

## 📊 Database Schema

### Tables

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  coins INT NOT NULL DEFAULT 1000,
  power_points INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Games
```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Cards
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id),
  round INT NOT NULL,
  power INT NOT NULL,
  heal INT NOT NULL,
  extra_money INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Bids
```sql
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  game_id INT NOT NULL REFERENCES games(id),
  round INT NOT NULL,
  bid_amount INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Round Results
```sql
CREATE TABLE round_results (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id),
  round INT NOT NULL,
  winner_id INT REFERENCES users(id),
  card_id INT REFERENCES cards(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Authentication

#### POST `/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "nickname": "player1",
  "password": "password123"
}
```

#### POST `/auth/login`
Login existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Management

#### GET `/user/me`
Get current user information (requires JWT token)

### Socket.IO Events

#### Client → Server
- `joinLobby` - Join the game lobby
- `startGame` - Start a new game
- `bid` - Place a bid on current round

#### Server → Client
- `existingPlayers` - Current lobby players
- `playerJoined` - New player joined
- `playerLeft` - Player left lobby
- `gameStarted` - Game begins with first round
- `roundStarted` - New round begins
- `roundResult` - Round winner announced
- `gameOver` - Game ends with champion

## 🎯 Game Flow

1. **Lobby Phase**
   - Players join and wait for minimum 2 players
   - Real-time player list updates
   - Host can start game when ready

2. **Bidding Rounds**
   - 10 rounds, 120 seconds each
   - Card stats displayed: Power, Heal, Extra Money
   - Players place bids within time limit
   - Highest bidder wins the card

3. **Round Resolution**
   - Winner's coins deducted by bid amount
   - Winner gains card's power + heal points
   - Winner receives extra money from card
   - Results announced to all players

4. **Game End**
   - After 10 rounds, player with highest power points wins
   - Champion announced
   - Players return to lobby

## 🎨 Frontend Components

### Pages
- **Login** - User authentication
- **Signup** - User registration
- **Lobby** - Game waiting room with player list
- **Game** - Main game interface with bidding
- **Leaderboard** - Player rankings

### Features
- **Real-time updates** via Socket.IO
- **Responsive design** with Tailwind CSS
- **Protected routes** with JWT authentication
- **Countdown timers** for bidding rounds
- **Error handling** and loading states

## 🔧 Backend Services

### Authentication
- **JWT tokens** for session management
- **bcrypt** for password hashing
- **Protected routes** with middleware

### Game Logic
- **Socket.IO** for real-time communication
- **Round management** with timers
- **Bid processing** and validation
- **Winner calculation** and stat updates

### Database
- **PostgreSQL** with connection pooling
- **Prepared statements** for security
- **Transaction support** for data integrity

## 🐳 Docker Configuration

### Services
- **postgres**: PostgreSQL database
- **backend**: Node.js API server
- **frontend**: React development server

### Volumes
- **pgdata**: Persistent database storage

### Environment
- Database credentials configured in docker-compose.yml
- Environment variables for JWT secrets and URLs

## 🔒 Security Features

- **JWT authentication** for API access
- **Password hashing** with bcrypt
- **CORS configuration** for cross-origin requests
- **Input validation** on server side
- **SQL injection prevention** with parameterized queries

## 📝 Development Notes

### File Structure
- **Modular architecture** with clear separation of concerns
- **Component-based** React frontend
- **MVC pattern** in backend with routes, controllers, services
- **Real-time communication** via Socket.IO

### Code Quality
- **ES6+ syntax** throughout
- **Async/await** for database operations
- **Error handling** with try/catch blocks
- **Consistent naming** conventions

### Performance
- **Database indexing** on frequently queried columns
- **Connection pooling** for database efficiency
- **Socket.IO rooms** for targeted messaging
- **Optimized React rendering** with proper state management

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd client
npm run build

# Set NODE_ENV=production for backend
# Configure production database URL
# Set secure JWT secret
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/api-docs`
2. Review the game logic in `server/sockets/gameSocket.js`
3. Examine the database schema in `db/schema.sql`

---

**Happy Gaming! 🎮** 