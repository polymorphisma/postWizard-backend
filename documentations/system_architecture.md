## Ticket 6: Create System Architecture Diagram

### Estimated Duration: 2 Days

### 1. **Understand the Problem**

- **Main Problem**: To successfully develop PostWizard, it's essential to have a clear understanding of how various system components will interact with each other. This includes communication between the frontend, backend, database, and external services such as social media APIs and AI-driven caption generation. A well-designed system architecture diagram will ensure the development process follows a structured approach and highlights all necessary components.

### 2. **Goal**

- **Objective**: To create a high-level system architecture diagram that visually represents the interactions between major components like the frontend (Svelte), backend (FastAPI), database (PostgreSQL), external services (social media APIs, AI tools), and infrastructure (self-hosted VM). This diagram will guide the development and ensure all components communicate effectively.

### 3. **Steps**

### 3.1 Define Components

- **Frontend (Svelte)**:
    - Svelte will handle user interactions, displaying the UI, and making API requests to the backend.
    - The frontend will be responsible for displaying dashboards, post creation, scheduling, and analytics views.
- **Backend (FastAPI)**:
    - FastAPI will serve as the core of the application, processing API requests from the frontend, managing business logic, and interacting with external services and the database.
    - The backend will expose RESTful APIs for operations such as user authentication, post creation, scheduling, and fetching engagement metrics.
- **Database (PostgreSQL)**:
    - PostgreSQL will store user data, posts, engagement metrics, scheduled tasks, and logs.
    - The backend will interact with the database to read and write data such as user authentication details, post information, and analytics.
- **External Services**:
    - **Social Media APIs**: The backend will connect to external social media platforms (e.g., Facebook, Instagram, Twitter) through their respective APIs for posting and fetching engagement metrics.
    - **AI Caption Generation**: AI services will be used to generate SEO-optimized captions and hashtags based on post content. This could involve using external AI APIs or integrating an internal AI service.
- **Infrastructure (Self-Hosted VM with Docker)**:
    - The application will be hosted on a self-hosted VM, using Docker containers to run different components (frontend, backend, and database).
    - Docker will ensure consistency between development and production environments and make scaling easier if needed.

### 3.2 Draw Diagrams

- **Architecture Diagram Overview**:
    - **Frontend (Svelte)**:
        - Communicates with the backend via REST APIs.
        - Responsible for user interactions, sending API requests for post creation, scheduling, and analytics.
    - **Backend (FastAPI)**:
        - Processes requests from the frontend and communicates with the PostgreSQL database for storing and retrieving data.
        - Integrates with social media APIs to post content and retrieve engagement metrics.
        - Connects with external AI services for generating captions and hashtags.
    - **Database (PostgreSQL)**:
        - Stores user data, post details, engagement metrics, and logs.
        - Interacts with the backend for CRUD operations.
    - **External Services**:
        - **Social Media APIs**: Used for posting content and fetching engagement data.
        - **AI Caption Generation**: Generates SEO-optimized captions and hashtags via external or internal AI services.
    - **Self-Hosted VM with Docker**:
        - The frontend, backend, and database will run in Docker containers hosted on a self-hosted virtual machine, providing scalability and isolation between services.

### 3.3 Define Microservices or Monolithic

- **Architecture Choice**: Monolithic with potential to move to microservices
    - **Initial Design**: PostWizard will be built as a monolithic application where the frontend, backend, and database operate within a single deployment environment. This simplifies development and deployment in the early stages.
    - **Potential Microservices**: As the application grows, certain functionalities (like AI-driven caption generation or social media API integration) could be broken out into microservices to improve scalability and maintainability.

### 3.4 Deliverable: System Architecture Diagram

**Deliverable**: A high-level system architecture diagram that shows the interactions between all components.

- **Frontend (Svelte)**: Communicates with the backend via RESTful APIs.
- **Backend (FastAPI)**: Manages user requests, interacts with the database, and integrates with external services (social media APIs and AI).
- **Database (PostgreSQL)**: Stores and retrieves user data, post information, and analytics.
- **External Services**: Includes social media APIs for posting and engagement tracking, and AI services for caption generation.
- **Infrastructure**: All components will run in Docker containers on a self-hosted VM, ensuring consistency and scalability.
