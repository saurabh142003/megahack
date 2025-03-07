# FarmConnect Backend

A Node.js backend for the FarmConnect application, enabling direct connections between farmers and consumers through community markets.

## Features

- User Authentication and Authorization
- Role-based Access Control (Farmer, Consumer, Community Admin)
- Real-time Location Tracking
- Market Management
- Event Management
- Product Management
- User Profile Management

## User Types

### Farmers
- Register and manage their farm details
- Update their location in real-time
- Manage their products and inventory
- Participate in market events
- Track sales and ratings

### Consumers
- Browse products and markets
- Save favorite items and farmers
- Track shopping history
- Receive notifications about events and products
- Update their location for market navigation

### Community Admins
- Manage markets and events
- Monitor user activities
- View analytics and reports
- Handle user management
- Track market busyness

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (Community Admin only)
- `GET /api/users/:id` - Get single user (Community Admin only)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/me/location` - Update user location
- `PUT /api/users/:id` - Update user (Community Admin only)
- `DELETE /api/users/:id` - Delete user (Community Admin only)
- `PATCH /api/users/:id/role` - Update user role (Community Admin only)

### Markets
- `GET /api/markets` - Get all markets
- `GET /api/markets/:id` - Get single market
- `POST /api/markets` - Create market (Community Admin only)
- `PUT /api/markets/:id` - Update market (Community Admin only)
- `DELETE /api/markets/:id` - Delete market (Community Admin only)
- `PATCH /api/markets/:id/busyness` - Update market busyness

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Community Admin only)
- `PUT /api/events/:id` - Update event (Community Admin only)
- `DELETE /api/events/:id` - Delete event (Community Admin only)
- `PATCH /api/events/:id/status` - Update event status
- `POST /api/events/:id/farmers` - Add farmers to event

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)
- `PATCH /api/products/:id/stock` - Update product stock
- `PATCH /api/products/:id/price` - Update product price

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

3. Start the development server:
```bash
npm run dev
```

## Testing

1. Run tests:
```bash
npm test
```

2. Run tests with coverage:
```bash
npm run test:coverage
```

## API Documentation

For detailed API documentation, visit `/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Data Models

### User
- Basic info (name, email, password)
- Role (consumer, farmer, admin)
- Location
- Role-specific details (farm details for farmers, community details for admins)

### Market
- Basic info (name, description, location)
- Admin and farmers
- Events
- Status and busyness level
- Active users count

### Event
- Basic info (title, description, start/end time)
- Associated market
- Participating farmers
- Products
- Status and busyness level
- Active users count

### Product
- Basic info (name, description, category)
- Pricing (base price and bulk pricing)
- Stock management
- Event association
- Farmer association

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation using express-validator
- CORS enabled
- Environment variable configuration

## Development

To run tests:
```bash
npm test
```

## License

ISC