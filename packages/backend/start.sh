#!/bin/bash

# Database Configuration
export DB_HOST=localhost
export DB_PORT=3306
export DB_USERNAME=root
export DB_PASSWORD=password
export DB_DATABASE=mydatabase

# OAuth Configuration
export OAUTH_REDIRECT_URL=http://localhost:3000/oauth/callback

# Google OAuth Configuration
export GOOGLE_CLIENT_ID=your_google_client_id
export GOOGLE_CLIENT_SECRET=your_google_client_secret
export GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Configuration
export JWT_SECRET=your_jwt_secret
export JWT_EXPIRE_IN=3600s

# Start the NestJS application
npm run start
