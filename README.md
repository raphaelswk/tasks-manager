# Cytidel Developer Challenge - Tasks Manager
This repository contains the solution for the Cytidel Developer Challenge. It is a full-stack task management application built with a .NET 8 backend and a Next.js frontend, designed with clean architecture principles and a focus on modern development practices.

## Backend (C# / .NET 8)
The backend is built using a Clean Architecture approach to ensure a clear separation of concerns, making the application more maintainable and testable.

- **Domain:** Contains the core business entities and enums (TaskItem, Priority, Status). This layer has no external dependencies.
- **Business:** Holds all the business logic. It defines interfaces for data access (ITaskRepository) and contains the application services (TaskService). It is completely decoupled from the persistence mechanism.
- **Persistence:** Implements the data access logic defined in the Business layer. It uses Entity Framework Core with SQLite for data persistence and contains the TaskRepository implementation.
- **Api:** The presentation layer. It exposes the application's functionality via a RESTful API, handles HTTP requests, and is responsible for DTO mapping. It contains no business logic.
- **Tests:** Contains unit tests for the Business layer, ensuring the core logic is reliable and correct.

### Technologies Used
- **.NET 8:** The core framework for building the application.
- **ASP.NET Core:** For building the Web API.
- **Entity Framework Core:** For data access and ORM.
- **SQLite:** As the file-based, persistent local database.
- **MediatR:** To implement the Mediator pattern for decoupled, event-driven logic (e.g., high-priority task logging).
- **AutoMapper:** For clean and simple mapping between domain entities and DTOs.
- **xUnit & Moq:** For writing and running unit tests.

### How to Set Up and Run the Project

Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- A terminal or command-line interface.

Step-by-Step Instructions

1. Clone the Repository
```bash
git clone https://github.com/raphaelswk/tasks-manager.git
cd tasks-manager/backend
```

2. Install EF Core Tools

If you haven't already, install the dotnet-ef global tool.
```bash
dotnet tool install --global dotnet-ef
```

3. Restore Dependencies

This command will download all the necessary NuGet packages.
```bash
dotnet restore
```

4. Create the Database Migration

This command inspects your DbContext and generates the code needed to create the database schema.
```bash
dotnet ef migrations add InitialCreate --project Persistence --startup-project Api
```

5. Apply the Migration to the Database

This command runs the migration to create the tasks.db file and the TaskItems table within it.
```bash
dotnet ef database update --project Persistence --startup-project Api
```

6. Build the Application
```bash
dotnet build
```

7. Run the Application

Navigate to the Api project and run it.
```bash
cd Api
dotnet run
```

8. Access the API Documentation

Once the application is running, open your browser and navigate to the Swagger UI to view and test the API endpoints. The URL will be in your terminal output (e.g., https://localhost:7123/swagger).

## Frontend (Next.js 15 / React)
The frontend is a modern, server-aware application built with Next.js and the App Router.

### Technologies Used
- **Framework:** Next.js 15 / React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Forms:** React Hook Form with Zod for schema validation
- **Charts:** amCharts 5
- **Testing:** Jest with React Testing Library

### How to Set Up and Run the Project

Prerequisites
- [Node.js v18+](https://nodejs.org/en/download)

Step-by-Step Instructions

1. Clone the Repository
```bash
git clone https://github.com/raphaelswk/tasks-manager.git
cd tasks-manager/frontend
```

2. Make sure the backend is running

3. Create Environment File

Create a new file named .env.local in the root of the frontend folder and add the URL of your running backend.

```bash
NEXT_PUBLIC_API_URL=https://localhost:7123
```

4. Install Dependencies
```bash
npm install
```

5. Run the Frontend Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ♥ &nbsp;by Raphael Socolowski 👋 &nbsp;[See my LinkedIn](https://www.linkedin.com/in/raphaelswk/)