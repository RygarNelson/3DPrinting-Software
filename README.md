# 3D Printing Software

A desktop application built with Electron that bundles an Angular frontend and Node.js/Express backend with SQLite database.

## Features

- **Desktop Application**: No need to install Node.js or dependencies on client machines
- **Bundled Server**: Express server runs locally within the Electron app
- **SQLite Database**: Data is stored locally in the user's app data directory
- **Angular Frontend**: Modern web-based UI
- **Cross-platform**: Works on Windows, macOS, and Linux

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will:
- Start the Express server on port 3000
- Start the Angular development server on port 4200
- Launch the Electron app in development mode

### Building for Production

1. **Build the Angular client:**
   ```bash
   npm run build:client
   ```

2. **Build the Electron app:**
   ```bash
   npm run build:electron
   ```

3. **Create distributable packages:**
   ```bash
   npm run dist
   ```

The distributable files will be created in the `dist` directory.

## Project Structure

```
3DPrinting-Software/
├── client/                 # Angular frontend
├── server/                 # Express backend
├── electron/              # Electron main process
│   ├── main.js           # Main Electron process
│   ├── dev.js            # Development Electron process
│   └── preload.js        # Preload script for security
├── assets/               # App icons and assets
├── package.json          # Root package.json for Electron
└── README.md
```

## Database

The SQLite database is automatically created in:
- **Development**: `server/database/database.sqlite`
- **Production**: User's app data directory (e.g., `%APPDATA%/3D Printing Software/database/database.sqlite` on Windows)

## Configuration

### Environment Variables

The following environment variables can be set:

- `SERVER_PORT`: Port for the Express server (default: 3000)
- `SERVER_ADDRESS`: Address for the Express server (default: localhost)
- `NODE_ENV`: Environment mode (development/production)

### App Icons

Replace the placeholder icons in the `assets/` directory:
- `icon.png` - For Linux builds
- `icon.ico` - For Windows builds  
- `icon.icns` - For macOS builds

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure ports 3000 and 4200 are available
2. **Database errors**: Check that the database directory is writable
3. **Build failures**: Ensure all dependencies are installed

### Development Tips

- Use `npm run dev` for development with hot reload
- Check the Electron console for server logs
- The Angular app communicates with the server via HTTP on localhost:3000

## License

MIT License