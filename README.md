# WRI Ocean Watch 🌊

---
## Table of Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
    - [Running Directly On Your Machine](#running-directly-on-your-machine) 
    - [Building the Docker Image Locally](#building-the-docker-image-locally)
    - [Running the GHCR Docker Container](#running-the-ghcr-docker-container)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)
- [Acknowledgments](#acknowledgments)
----
## Introduction
The ocean and humanity are connected. To ensure the health and economic vitality of ocean ecosystems, ocean management needs an upgrade. Ocean Watch provides the data and information policymakers need to make better-informed decisions about sustainable ocean management.

## Architecture
C4 Documentation can be found in our [docs/architecture directory](docs/architecture)
- High Level [System Context](docs/architecture/c4_L1_system_context.md)
- Medium Level [Container Diagram](docs/architecture/c4_L2_container.md)
- [Deployment Diagrams](docs/architecture/c4_deployment.md)

## Getting Started
### Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js**: [Node.js](https://nodejs.org/) (version 14.x or later) is required to run this project. You can check your current version with the command `node -v`.
- **npm**: The Node.js package manager, [npm](https://npmjs.com/), is used to install dependencies. npm is included with Node.js, so if you have Node.js installed, you should have npm as well. This project requires npm version 6.x or later. You can check your npm version with the command `npm -v`.

These versions are recommended based on the project's dependencies. If you encounter any issues with these versions, please check the project's issue tracker or consider upgrading to the latest versions.

If you have nvm installed, you can install and use the correct Node.js version by running:
```bash
nvm install 14
nvm use 14
```

### Installation
Follow these steps to get your development environment set up:

1. **Clone the repository**: First, clone the project repository to your local machine. Use the following command in your terminal:
   ```bash
   git clone https://github.com/wri/ocean-watch.git
   cd ocean-watch
   ```

2. **Install Node.js and npm**: If you haven’t already, install Node.js and npm on your machine. We recommend using `nvm` (Node Version Manager) to manage Node.js versions. Refer to the Prerequisites section for detailed instructions.

3. **Install project dependencies**: Once Node.js and npm are set up, install the project dependencies. Run the following command in the project root directory:
   ```bash
   npm install
   ```

4. **Environment variables**: If your project requires any environment variables, this is the point to set them up. Create a `.env.local` file in the root of your project and add the necessary variables, such as `NEXT_PUBLIC_API_URL`.

5. **Linting and formatting**: To ensure your code follows the project’s coding standards, you can run the linter and formatter:
   ```bash
   npm run lint
   ```

## Usage
### Running Directly On Your Machine
After installation, you can start the development server using:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the project.

### Building the Docker Image Locally

If you prefer to build the Docker image locally on your machine, follow these steps. This process is useful for development, testing changes, or running versions of the application not yet pushed to GHCR.

1. **Clone the Repository**: If you haven't already, clone the repository to your local machine:

    ```bash
    git clone https://github.com/wri/ocean-watch.git
    cd ocean-watch
    ```
   
2. **Build the Docker Image**: Use the Docker CLI to build the image from the Dockerfile in the project root. You can tag the image with any name you prefer, but it's common practice to use the project name and version or branch name as the tag. For example:

    ```bash
    docker build -t ghcr.io/wri/ocean-watch:local .
    ```

   This command builds the Docker image and tags it with `local` to indicate that this is a locally built version.

3. **Run the Docker Container**: After successfully building the image, you can run it locally using:

    ```bash
    docker run -d -p 3000:3000 ghcr.io/wri/ocean-watch:local
    ```

   This will start the container in detached mode, mapping port 3000 of the container to port 3000 on your host machine, allowing you to access the application via [http://localhost:3000](http://localhost:3000)

4. **Accessing the Application**: Open your web browser and navigate to `http://localhost:3000` to view your locally running instance of the application.

Remember, building the Docker image locally requires you to have Docker installed on your machine. Ensure Docker is running before you attempt to build or run the image. This process is ideal for developers looking to make and test changes before committing them to the repository or for those who need to run different versions of the application for comparison or regression testing.

### Running the GHCR Docker Container

Our project's Docker images are hosted on GitHub Container Registry (GHCR), allowing you to easily download and run the container locally. 

The prebuilt images can be browsed at [Ocean Watch's GHCR](https://github.com/wri/ocean-watch/pkgs/container/ocean-watch%2Fnextjs-app).

Here’s how you can run our Next.js application using Docker:

1. **Authenticate with GitHub Container Registry**: The Docker images are private, you'll need to authenticate with GHCR to pull them. Use the following command, replacing `YOUR_GITHUB_USERNAME` and `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` with your GitHub username and a [personal access token](https://github.com/settings/tokens) with the appropriate scopes (`read:packages` to pull images).

    ```bash
    docker login ghcr.io -u YOUR_GITHUB_USERNAME
    ```
   Paste your personal access token in when prompted for your password.

   For more information on GitHub Container Registry and how to generate a personal access token, visit [GHCR documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

2. **Pull the Docker Image**: Replace `docker pull ghcr.io/wri/ocean-watch/nextjs-app:IMAGE_TAG` with the correct tag for the image you wish to run. The `IMAGE_TAG` could be `latest`, or a commit SHA.

    ```bash
    docker pull ghcr.io/wri/ocean-watch/nextjs-app:IMAGE_TAG
    ```

   Example to pull the latest version of the image:

    ```bash
    docker pull ghcr.io/wri/ocean-watch/nextjs-app:latest
    ```

3. **Run the Docker Container**: Once the image is pulled, you can run it with the following command. This command maps port 3000 of the container to port 3000 on your host machine, as specified in the Dockerfile.

    ```bash
    docker run -d -p 3000:3000 ghcr.io/wri/ocean-watch/nextjs-app:IMAGE_TAG
    ```

   Adjust the `IMAGE_TAG` placeholder accordingly. If your application requires different port mappings or additional environment variables, modify this command to fit your needs.

4. **Accessing the Application**: With the container running, access the application by navigating to `http://localhost:3000` in your web browser.
