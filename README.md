# Sports AI

Sports AI is a React Native mobile application built with Expo. It integrates with Firebase and leverages device features like the camera to deliver an interactive AI-powered sports experience.

## Features

- **React Native & Expo**: Cross-platform mobile development framework.
- **Firebase Integration**: Secure backend services and authentication.
- **Expo Camera**: Integrated camera functionality for tracking and analysis.
- **React Navigation**: Seamless routing and stack management.
- **Custom Fonts**: Beautiful typography using Google Fonts (Inter & Montserrat).

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd sports-ai
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```
   *or if you are using yarn:*
   ```bash
   yarn install
   ```

## Configuration

This project requires a `.env` file for sensitive configuration such as Firebase keys. 

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your specific keys and credentials. Note that `.env` is ignored by Git to keep your secrets safe.

## Running the App

Start the Expo development server:

```bash
npm start
```

This will open the Expo developer tools in your browser. From there, you can run the app on:
- An iOS simulator (press `i`)
- An Android emulator (press `a`)
- A web browser (press `w`)
- Your physical device using the Expo Go app by scanning the QR code.

## Available Scripts

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the app in the Android emulator.
- `npm run ios` - Starts the app in the iOS simulator.
- `npm run web` - Starts the app in a web browser.

## License

This project is licensed under the terms provided in the LICENSE file.
