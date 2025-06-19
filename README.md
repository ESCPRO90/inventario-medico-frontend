# Inventario Médico Frontend

Frontend application for the Medical Inventory Management System. Built with React, TypeScript, Vite, and Material-UI.

## Tech Stack

- **Framework/Library:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI:** Material-UI (MUI)
- **State Management:**
  - Server State & Caching: React Query
  - Global Client State: Zustand (for authentication)
- **Forms:** React Hook Form & Yup (for validation)
- **Routing:** React Router DOM v6
- **API Client:** Axios
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint

## Project Structure

A brief overview of the main directories:

- **`public/`**: Static assets.
- **`src/`**: Main application source code.
  - **`components/`**: Reusable UI components.
    - **`common/`**: Generic components (e.g., ProtectedRoute).
    - **`layout/`**: Layout components (e.g., MainLayout, UserProfileMenu).
  - **`hooks/`**: Custom React hooks (e.g., `usePermissions`, React Query client setup).
  - **`pages/`**: Top-level page components corresponding to routes.
  - **`services/`**: API interaction layer (e.g., `api.ts` Axios instance).
  - **`store/`**: Global client state management (e.g., `authStore.ts` using Zustand).
  - **`theme/`**: Material-UI theme configuration.
  - **`types/`**: TypeScript type definitions and interfaces.
- **`src/setupTests.ts`**: Setup file for Vitest (e.g., importing jest-dom matchers).

## Prerequisites

- Node.js (Recommended: LTS version, e.g., >=18.x)
- npm (or yarn/pnpm)

## Setup and Running the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd inventario-medico-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (Or `yarn install` or `pnpm install`)

3.  **Set up environment variables:**
    - Create a `.env` file in the root of the project by copying `.env.example`:
      ```bash
      cp .env.example .env
      ```
    - Modify the `.env` file with your actual backend API URL if it's different from the default.
      ```env
      VITE_API_URL=http://your-backend-api-url/api
      ```

4.  **Run in development mode:**
    - This will start the Vite development server, usually on `http://localhost:5173`. (Note: previous instructions mentioned 3000, but Vite's default is often 5173. The `vite.config.ts` in this project sets it to 3000, so that's correct here.)
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    - This will create a `dist/` folder with optimized static assets.
    ```bash
    npm run build
    ```

6.  **Preview production build:**
    - Runs a local server to preview the production build from the `dist/` folder.
    ```bash
    npm run preview
    ```

## Linting

To check for code style and potential errors:

```bash
npm run lint
```
ESLint is configured to use recommended TypeScript and React rules.

## Testing

Vitest and React Testing Library are used for unit and integration tests.

- **Run all tests:**
  ```bash
  npm run test
  ```

- **Run tests with UI:**
  - This opens the Vitest UI in your browser for an interactive test experience.
  ```bash
  npm run test:ui
  ```

- **Generate test coverage report:**
  - Coverage reports will be available in the `coverage/` directory.
  ```bash
  npm run coverage
  ```

## Contributing

We welcome contributions! Please follow these basic guidelines:

- Adhere to the existing code style.
- Ensure ESLint passes before committing (`npm run lint`).
- Write tests for new features or bug fixes.
- Ensure all tests pass before submitting a pull request (`npm run test`).
- Keep pull requests focused on a single feature or bug fix.
