# Kambaz - Canvas Clone

Kambaz is a learning management system (LMS) inspired by Canvas, designed to facilitate online education by enabling course management, user enrollment, assignments, and module organization.

## Features

### 1. User Management
- **Signup & Signin**: Users can create accounts and log in using their credentials.
- **Profile Management**: Users can view their profiles and update information.
- **Session Handling**: User authentication is managed through sessions.
- **Enrollment Management**: Users can enroll in courses and unenroll when needed.
- **Course Creation**: Instructors can create courses and enroll students.

### 2. Course Management
- **Create Courses**: Instructors can create and manage courses.
- **Find Courses**: Users can view the courses they are enrolled in.
- **Enrollments**: Users can enroll and unenroll from courses.

### 3. Module Management
- **Create, Update, Delete Modules**: Modules within a course can be modified.
- **Retrieve Course Modules**: Users can view modules associated with a course.

### 4. Assignment Management
- **Create, Update, Delete Assignments**: Assignments can be managed within a course.
- **Retrieve Assignments**: Users can fetch assignments assigned to them.

## API Routes

### User Routes
| Method | Endpoint                        | Description |
|--------|---------------------------------|-------------|
| POST   | `/api/users/signup`             | Register a new user |
| POST   | `/api/users/signin`             | Authenticate user |
| POST   | `/api/users/signout`            | Logout user |
| POST   | `/api/users/profile`            | Get logged-in user profile |
| GET    | `/api/users`                    | Retrieve all users |
| GET    | `/api/users/:userId`            | Get user by ID |
| PUT    | `/api/users/:userId`            | Update user details |
| DELETE | `/api/users/:userId`            | Delete user |

### Course Routes
| Method | Endpoint                                    | Description |
|--------|---------------------------------------------|-------------|
| GET    | `/api/users/:userId/courses`               | Get courses for a user |
| POST   | `/api/users/current/courses`               | Create a new course |

### Enrollment Routes
| Method | Endpoint                                               | Description |
|--------|---------------------------------------------------------|-------------|
| GET    | `/api/users/:userId/enrollments`                       | Retrieve user's enrollments |
| POST   | `/api/users/:userId/:courseId/enrollments`             | Enroll user in a course |
| DELETE | `/api/users/:userId/:courseId/enrollments`             | Unenroll user from a course |

### Module Routes
| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| DELETE | `/api/modules/:moduleId`          | Delete a module |
| PUT    | `/api/modules/:moduleId`          | Update a module |

### Assignment Routes
| Method | Endpoint                              | Description |
|--------|--------------------------------------|-------------|
| DELETE | `/api/assignments/:assignmentId`     | Delete an assignment |
| PUT    | `/api/assignments/:assignmentId`     | Update an assignment |

## Setup Instructions

### Prerequisites
- Node.js installed
- Express.js installed
- MongoDB or another database setup (if applicable)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/kambaz.git
   cd kambaz
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```
   Or if using `nodemon`:
   ```sh
   npm run dev
   ```

## Technologies Used
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for handling HTTP requests
- **MongoDB**: Database for storing user, course, and assignment data
- **Session-based Authentication**: Manages user sessions securely

## Future Enhancements
- Implement role-based access control (Instructor, Student, Admin)
- Add grading system and feedback features
- Enhance UI with a frontend framework (React, Angular, or Vue)
- Integrate file uploads for assignments

## License
This project is open-source and available under the MIT License.

