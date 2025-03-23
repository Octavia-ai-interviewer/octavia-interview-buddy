# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/21bb4659-713c-41f1-bac2-54d39a22da7b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/21bb4659-713c-41f1-bac2-54d39a22da7b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Project Status

This project is currently being prepared for Firebase integration. A new MCP server is being created to access data from another Firebase project.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase Admin SDK (for backend data access)
- Model Context Protocol (MCP) SDK (for MCP server)

## How can I run this project locally?

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   ```
2. Navigate to the project directory:
   ```bash
   cd octavia-interview-buddy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a new private key for your service account in Project Settings > Service Accounts
   - Copy the `firebase_admin_config.json.example` file to `firebase_admin_config.json`
   - Replace the placeholder values with your actual Firebase service account credentials
5. Start the development server:
   ```bash
   npm run dev
   ```

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
