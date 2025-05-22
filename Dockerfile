# Use the official Node.js 18 image
FROM node:18.20.8

# Expose the app port 
EXPOSE 3005

WORKDIR /app

# Copy your app
COPY . .

RUN npm install

# Command to run the app
CMD ["npm", "run", "start"]
