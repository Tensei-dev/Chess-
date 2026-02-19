# Chess-
Web-based multiplayer chess game with an AI opponent. Built with React and Node.js, using WebSockets for real-time play and PostgreSQL for data storage. The AI runs as a Python microservice using tree-based models (CatBoost/LightGBM) combined with search algorithms.

## REQUIRED INSTALLATIONS
- npm (node package manager)
- postgreSQL

PACKAGES (npm)
- Chess-\chess_backend
├── chess.js@1.4.0
├── cors@2.8.6
├── dotenv@16.6.1
├── express@4.22.1
├── pg@8.18.0
└── uuid@9.0.1

EXTENSIONS
- Live Server (on VsCode)

## HOW TO USE THIS PACKAGE

### (1) Create (chess_backend/database/schema.sql) on postgres
### (2) Start server on (chess_backend/) -> npm start
### (3) Open html with live server on browser
### Enjoy playing chess against a robot 🤖
