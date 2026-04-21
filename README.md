# Port Freight & Container Logistics Management System

## 1. Project Title
Port Freight & Container Logistics Management System

## 2. Overview
Global seaport operations involve multiple stakeholders, strict compliance requirements, and time-sensitive container movement. In many ports, data is fragmented across shipping lines, customs desks, freight agents, and yard teams. This causes delayed clearances, poor visibility, billing disputes, and operational bottlenecks.

This system provides a unified digital platform to manage container flow from vessel arrival through customs clearance, storage, gate movement, transit, and final delivery/departure. It centralizes lifecycle events, user actions, and fee calculations, enabling real-time operational visibility and traceable decision-making.

### Problem Addressed
- Fragmented tracking of containers across departments.
- Lack of role-based accountability for actions.
- Delayed customs and movement approvals.
- Manual, inconsistent fee calculations.
- Limited monitoring and reporting for administrators.

### Solution Approach
- End-to-end lifecycle management for containers.
- Role-based workflows for shipping, customs, forwarding, trucking, and warehouse stakeholders.
- API-driven architecture for frontend-backend integration.
- Automated fee computation based on storage duration and business rules.
- Movement logs and reports for auditability and monitoring.

## 3. Features
- Role-based access control with dedicated privileges for:
  - ADMIN
  - SHIPPING_LINE
  - FREIGHT_FORWARDER
  - CUSTOMS_OFFICER
  - TRUCKING_COMPANY
  - WAREHOUSE_OPERATOR
- Container lifecycle tracking with status transitions and movement history.
- Customs declaration filing and clearance/hold workflow.
- Booking management for freight forwarding operations.
- Fee management for storage, demurrage, and detention.
- Admin reports and health/operational monitoring endpoints.

## 4. Tech Stack

### Backend
- Java 21 (compatible with Java 17+ runtime requirement)
- Spring Boot 3
- Spring Data JPA (Hibernate)
- MySQL

### Frontend
- React.js (Vite)
- Axios
- React Router

### Security
- Spring Security
- JWT-based authentication and authorization

### API Testing and Documentation
- Postman
- HTTP flow file in repository: testing_flow.http
- Swagger/OpenAPI configuration properties are present; UI dependency can be enabled as needed

## 5. System Architecture
The project follows a layered backend architecture:

Controller -> Service -> Repository -> Database

### Layer Responsibilities
- Controller Layer: Exposes REST endpoints and handles request/response mapping.
- Service Layer: Applies business rules, validations, workflow logic, and orchestration.
- Repository Layer: Provides data access through Spring Data JPA repositories.
- Database Layer: Persists operational entities in MySQL.

### Frontend-Backend Communication
- React frontend consumes REST APIs from the Spring Boot backend.
- JWT token is issued after login and sent in authorization headers for protected endpoints.

## 6. Database Design

### Main Tables
- users
- vessels
- vessel_schedules
- containers
- bookings
- customs_declarations
- port_storage_fees
- movement_logs

### Key Relationships (Foreign Keys)
- vessel_schedules.vessel_id -> vessels.id
- containers.vessel_schedule_id -> vessel_schedules.id
- bookings.user_id -> users.id
- bookings.container_id -> containers.id
- customs_declarations.container_id -> containers.id
- customs_declarations.reviewed_by -> users.id
- port_storage_fees.container_id -> containers.id
- movement_logs.container_id -> containers.id
- movement_logs.performed_by -> users.id

## 7. Roles and Responsibilities

| Role | Core Responsibilities |
| --- | --- |
| ADMIN | System-wide oversight, user management, operational analytics, reports, and cross-module monitoring. |
| SHIPPING_LINE | Register vessels, create schedules, and manage vessel movement status for incoming/outgoing operations. |
| FREIGHT_FORWARDER | Create and manage delivery bookings for cleared cargo movement. |
| CUSTOMS_OFFICER | Review declarations, apply HOLD/CLEARED decisions, and enforce compliance controls. |
| TRUCKING_COMPANY | Execute gate-out and transport operations according to booking and customs state. |
| WAREHOUSE_OPERATOR | Manage storage handling, yard visibility, and cargo readiness updates. |

## 8. Container Lifecycle
Conceptual end-to-end lifecycle used for process explanation:

ARRIVED -> YARD_STORAGE -> CUSTOMS_HOLD -> CLEARED -> GATE_OUT -> IN_TRANSIT -> DELIVERED -> EXPORT_READY -> LOADED -> DEPARTED

### Current Implementation Note
The current backend status model includes these primary container statuses:
- ARRIVED
- UNDER_REVIEW
- CLEARED
- HELD
- GATE_OUT
- LOADED
- DEPARTED
- DELIVERED

The conceptual stages YARD_STORAGE and EXPORT_READY can be represented operationally via movement logs and intermediate workflow events.

## 9. Business Rules
- Customs clearance prerequisite:
  - A container cannot proceed to gate-out unless customs status is CLEARED.
  - Containers marked HELD cannot proceed in movement workflow.
- Storage fee grace period:
  - Storage charges start after the first 7 days of storage.
- Demurrage and detention:
  - Demurrage is calculated per day based on stored duration.
  - Detention is currently applied as a flat fee during fee calculation.
- Movement logging:
  - Lifecycle actions are logged as movement events to maintain operational traceability.

## 10. API Overview

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Users
- POST /api/users
- GET /api/users
- GET /api/admin/users
- POST /api/admin/users

### Vessels and Schedules
- GET /api/vessels
- POST /api/vessels
- GET /api/vessels/schedules
- POST /api/vessels/schedules
- POST /api/vessel-schedules
- PUT /api/vessel-schedules/{id}/status

### Containers
- POST /api/containers
- GET /api/containers
- GET /api/containers/{id}
- PUT /api/containers/{id}/status
- GET /api/admin/containers
- GET /api/admin/containers/{id}
- GET /api/admin/containers/{id}/journey

### Customs
- POST /api/customs/declaration
- PUT /api/customs/declaration/{id}/clear
- PUT /api/customs/declaration/{id}/hold
- GET /api/admin/customs/declarations
- GET /api/admin/customs/declarations/filter
- GET /api/admin/customs/summary

### Bookings
- POST /api/bookings
- GET /api/bookings

### Fees
- POST /api/fees/calculate
- GET /api/fees/container/{id}
- GET /api/fees/invoice/{id}
- GET /api/admin/fees
- GET /api/admin/fees/container/{id}

### Reports and Monitoring (Admin)
- GET /api/admin/reports/containers-per-vessel
- GET /api/admin/reports/fees-collected
- GET /api/admin/reports/average-clearance-time
- GET /api/admin/reports/system-health

## 11. How to Run (Step by Step)

### Prerequisites
- Java 17+ installed (project is configured with Java 21)
- Maven installed
- Node.js and npm installed
- MySQL server running

### Backend Setup
1. Clone or open the project folder.
2. Create or confirm MySQL database availability.
   - Database name used: port_logistics
3. Update database credentials in src/main/resources/application.properties:
   - spring.datasource.url
   - spring.datasource.username
   - spring.datasource.password
4. From the backend project root, build the project:

    mvn clean package

5. Run the generated JAR:

    java -jar target/*.jar

6. Backend will start on:
   - http://localhost:9080

### Frontend Setup
1. Open a new terminal.
2. Move to frontend folder:

    cd port-frontend

3. Install dependencies:

    npm install

4. Run development server:

    npm run dev

5. Open the frontend URL shown by Vite (typically http://localhost:5173).

## 12. Default Users (For Testing)
The database seeder creates these accounts when the users table is empty:

| Username | Password | Role |
| --- | --- | --- |
| admin | admin123 | ADMIN |
| shipping | shipping123 | SHIPPING_LINE |
| customs | customs123 | CUSTOMS_OFFICER |

Additional sample credential for workflow testing:

| Username | Password | Role | Note |
| --- | --- | --- | --- |
| forwarder | forwarder123 | FREIGHT_FORWARDER | Create via ADMIN user management endpoint if not pre-seeded |

## 13. Complete Workflow Demo (Step by Step)
1. Login as SHIPPING_LINE and create a vessel.
2. Create a vessel schedule for the vessel.
3. Register a container linked to the vessel schedule.
4. Login as CUSTOMS_OFFICER and file customs declaration.
5. Update customs decision to clear the container.
6. Login as FREIGHT_FORWARDER and create booking for the container.
7. Update and track container lifecycle events through movement logs.

## 14. Screenshots (Placeholders)
Add screenshots in a screenshots folder and replace with actual images.

![Dashboard](./screenshots/dashboard.png)
![Vessels](./screenshots/vessels.png)
![Containers](./screenshots/containers.png)
![Customs](./screenshots/customs.png)
![Bookings](./screenshots/bookings.png)
![Reports](./screenshots/reports.png)

## 15. Future Enhancements
- Real-time container tracking dashboard.
- RFID and IoT sensor integration for yard and gate automation.
- ETA prediction using historical turnaround and vessel behavior.
- Email/SMS notifications for critical workflow events and approvals.
- Advanced analytics for congestion forecasting and resource planning.

## 16. Conclusion
The Port Freight and Container Logistics Management System delivers a structured, secure, and auditable platform for modern port operations. By combining role-based workflows, lifecycle traceability, customs integration, and fee automation, the system reduces operational friction and improves decision quality for all stakeholders. It is suitable as both a practical software project and an academically evaluable logistics information system.
