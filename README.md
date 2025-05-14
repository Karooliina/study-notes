# Study Notes

A web application designed to create concise notes from educational materials using artificial intelligence (AI).

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [License](#license)

## Project Description

Study Notes is a web application that helps users create concise notes from educational materials using AI. The application has two main modes: AI-generated notes and manual note creation. The product's goal is to accelerate the note preparation process, allowing users to use their time more effectively for learning.

The application solves the following user problems:

- Preparing notes from educational materials is time-consuming
- Students often spend significant time creating summaries and extracting key information from extensive educational materials

Study Notes solves these problems by:

- Automatically generating concise and quality notes from provided materials using AI
- Offering a simple interface for creating, storing, and managing notes
- Enabling quick access to previously created notes

## Tech Stack

### Frontend

- **Next.js 15** (App Router) - For building fast, efficient pages and applications with server-side rendering
- **TypeScript 5** - For static typing and better IDE support
- **Tailwind CSS 4** - For convenient application styling
- **Shadcn/ui** - For accessible React component library
- **React 19** - For building the user interface
- **React Hook Form** - For form handling
- **Zod** - For schema validation

### Backend

- **Supabase** - As a comprehensive backend solution:
  - PostgreSQL database
  - SDK in multiple languages serving as Backend-as-a-Service
  - Open-source solution that can be hosted locally or on a server
  - Built-in user authentication

### AI Integration

- **Openrouter.ai** - For communication with AI models:
  - Access to various models (OpenAI, Anthropic, Google, and others)
  - Financial limits on API keys

### CI/CD and Hosting

- **GitHub Actions** - For creating CI/CD pipelines

## Getting Started Locally

### Prerequisites

- Node.js (v20.11.1)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/study-notes.git
   cd study-notes
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.example` file with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENROUTER_API_KEY=
   OPENROUTER_API_URL=
   AI_MODEL=
   ```

4. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser

## Available Scripts

- `npm run dev` - Runs the application in development mode
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run test` - Runs the test suite
- `npm run test:watch` - Runs the test suite in watch mode
- `npm run lint` - Checks for linting errors
- `npm run lint:fix` - Fixes linting errors automatically

## Project Scope

### MVP Functional Requirements

1. **User Registration and Authentication**

   - User accounts with basic data: username, email, password
   - Secure storage of user data
   - Required login to use application functionality

2. **AI Note Generation**

   - Accepting source text up to 5000 words
   - Generating notes up to 1000 characters
   - AI response time: maximum 30 seconds
   - Progress indicator during note generation
   - Ability to edit generated note before saving
   - AI API error handling
   - Note titling
   - Saving notes to database

3. **Manual Note Creation**

   - Interface for entering own notes
   - Note titling
   - Saving notes to database

4. **Note Management**

   - List of saved notes with titles and creation dates
   - Sorting notes by creation date
   - Viewing note details
   - Editing existing notes
   - Deleting notes

5. **User Interface**
   - Homepage with application description
   - Dashboard with list of saved notes
   - Clear visual distinction between AI mode and manual mode
   - Detailed note view
   - Responsive design with Mobile first approach

## License

This project is proprietary and confidential. All rights reserved.
