# Cytidel Developer Challenge - Task Management Backend

## Backend Architecture
This repository contains the backend solution for the Cytidel Developer Challenge. It is a .NET 8 Web API designed to manage tasks, built following the principles of Clean Architecture to ensure a clear separation of concerns, maintainability, and testability.

The solution is structured into distinct layers, each with a specific responsibility:

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ♥ &nbsp;by Raphael Socolowski 👋 &nbsp;[Check my linkedin out](https://www.linkedin.com/in/raphaelswk/)