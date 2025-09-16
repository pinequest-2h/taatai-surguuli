# GraphQL Resolvers

## Authentication Resolvers

### Mutations
- `loginUser(input: LoginInput!)` - Authenticate user and return JWT token
- `createUser(input: CreateUserInput!)` - Create new user account
- `updateUser(_id: ID!, input: UpdateUserInput!)` - Update user profile

### Queries
- `getUserById(_id: ID!)` - Get user by ID

## Psychologist Resolvers

### Mutations
- `createPsychologistProfile(input: CreatePsychologistProfileInput!)` - Create psychologist profile
- `updatePsychologistProfile(_id: ID!, input: UpdatePsychologistProfileInput!)` - Update psychologist profile

### Queries
- `getPsychologistProfile(_id: ID!)` - Get psychologist profile by user ID
- `getPsychologistProfiles(filters, limit, offset)` - Get paginated psychologist profiles
- `getAvailablePsychologists(date, time, duration)` - Get available psychologists for booking

## Appointment Resolvers

### Mutations
- `createAppointment(input: CreateAppointmentInput!)` - Create new appointment

### Queries
- `getUpcomingAppointments(userId: ID!, limit: Int)` - Get upcoming appointments for user
- `getAppointments(filters, limit, offset)` - Get paginated appointments
- `getPsychologistAppointments(psychologistId, status, limit, offset)` - Get psychologist's appointments
- `getChildAppointments(childId, status, limit, offset)` - Get child's appointments

## Authentication

Most mutations require authentication. The JWT token should be included in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All resolvers include proper error handling with GraphQL errors and appropriate error codes.
