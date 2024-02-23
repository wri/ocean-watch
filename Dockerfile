# Stage 1: Building the code
FROM node:14.17-alpine as builder

WORKDIR /app

# Install Git (required for npm dependencies hosted on Git repositories)
RUN apk update && apk add git

RUN adduser -D www
RUN chown -R www /app
USER www

RUN mkdir -p .next/cache && chown -R www:www .next

# Copy package.json and package-lock.json
COPY --chown=www:www package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code from your host to your image filesystem.
COPY --chown=www:www . .

RUN ls -la /app/.next/cache

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:14.17-alpine

WORKDIR /app

RUN adduser -D www
RUN chown -R www /app
USER www

# Copy the build output to the new container
COPY --from=builder --chown=www:www /app/.next ./.next
COPY --from=builder --chown=www:www /app/node_modules ./node_modules
COPY --from=builder --chown=www:www /app/public ./public
COPY --from=builder --chown=www:www /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

