# SureDrive Frontend

This is the frontend application for SureDrive, a vehicle inspection management system. It provides a user-friendly interface for managing vehicles, booking inspections, and viewing inspection reports.

## Features

- User authentication (login/register)
- Dashboard with overview of vehicles and inspections
- Vehicle management (add, edit, delete vehicles)
- Inspection booking and management
- User profile management
- Responsive design for mobile and desktop

## Tech Stack

- React 18
- TypeScript
- Material UI for components and styling
- React Router for navigation
- Zustand for state management
- Axios for API requests
- Date-fns for date manipulation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/layouts`: Page layout components
  - `/pages`: Application pages
  - `/stores`: State management
  - `/services`: API services
  - `/utils`: Utility functions

## Backend Integration

The frontend is configured to connect to the backend API running at `http://localhost:5000`. This can be modified in the `package.json` file by changing the `proxy` field.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in local storage and managed through the auth store.

## License

This project is licensed under the MIT License.