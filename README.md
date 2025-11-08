# MLM Binary Tree Application

A complete Multi-Level Marketing (MLM) system with Binary Tree structure built using React and Node.js.

## 🌳 Binary Tree Concept

Each Member can have:
- **Left Child**: One member in the left position
- **Right Child**: One member in the right position
- **Spill Logic**: If a position is occupied, new members automatically spill to the next available sub-branch
- **Count Tracking**: Maintains total count of left and right downline members

## ✨ Features

### 🔐 Authentication System
- Member registration with sponsor code validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Session management

### 👥 Member Management
- **Member Joining Form** with fields:
  - Name
  - Email
  - Mobile
  - Password
  - Sponsor Code (existing member)
  - Position (Left/Right)

### 🎯 Binary Tree Logic
- **Sponsor Code Validation**: Verifies sponsor exists
- **Position Availability Check**: Checks if left/right is occupied
- **Automatic Spill Logic**: 
  - If chosen position is full, recursively finds next available slot
  - Traverses down the tree until empty position is found
- **Unique Member Code Generation**: Auto-generated sequence (MEM00001, MEM00002, etc.)
- **Recursive Count Updates**: Updates left_count and right_count up the tree

### 📊 Dashboard Features
- **Profile View**: Display member information entered during signup
- **Downline View**: 
  - View total left and right member counts
  - See complete left team hierarchy
  - See complete right team hierarchy
  - View direct left and right members

## 🏗️ Technology Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **UUID** for unique IDs
- **JSON File Storage** for data persistence

### Frontend
- **React 18** with Hooks
- **React Router DOM** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Modern CSS** with responsive design

## 📁 Project Structure

```
MLM-BinaryTree/
├── backend/
│   ├── server.js           # Main server with all API endpoints
│   ├── package.json        # Backend dependencies
│   └── members.json        # Member data storage
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── context/        # Authentication context
    │   ├── pages/          # Page components
    │   ├── services/       # API service layer
    │   └── App.js          # Main app component
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/members/register` - Register new member with binary tree placement
- `POST /api/members/login` - Member login
- `GET /api/members/verify-sponsor/:code` - Verify sponsor code validity

### Member Operations
- `GET /api/members/profile` - Get logged-in member profile (requires auth)
- `GET /api/members/downline` - Get left and right downline members (requires auth)
- `GET /api/members/all` - Get all members (requires auth)

## 💾 Data Model

```json
{
  "id": "uuid",
  "member_code": "MEM00001",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "hashed_password",
  "sponsor_code": "MEM00000",
  "position": "left",
  "left_member": "MEM00002",
  "right_member": "MEM00003",
  "left_count": 5,
  "right_count": 3,
  "joining_date": "2025-10-09T12:00:00.000Z"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MLM-BinaryTree
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server** (Port 5000)
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server** (Port 3000)
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📖 How to Use

### First Member Registration (Root)
1. Go to Register page
2. Fill in details (Name, Email, Mobile, Password)
3. Leave Sponsor Code empty
4. Select any position (Left/Right)
5. Click Register
6. You'll receive member code: **MEM00001**

### Subsequent Member Registrations
1. Go to Register page
2. Fill in all details
3. Enter valid Sponsor Code (e.g., MEM00001)
4. Select preferred position (Left/Right)
5. System will:
   - Validate sponsor code
   - Check position availability
   - Apply spill logic if needed
   - Place member in available slot
   - Update all parent counts
6. Receive your unique member code

### Login
1. Go to Login page
2. Enter email and password
3. Access dashboard after login

### Dashboard Options
1. **Profile View**: See your member details
2. **Left Downline**: View all members in your left team
3. **Right Downline**: View all members in your right team
4. **Counts**: See total left_count and right_count

## 🎯 Binary Tree Spill Logic Example

```
Initial State:
        MEM001
        /    \
    MEM002  MEM003

New member wants to join under MEM001 at LEFT position:
- MEM001's left is occupied by MEM002
- System checks MEM002's left position
- If MEM002's left is empty → place there
- If occupied → check MEM002's left child, and so on...

Result:
        MEM001 (L:3, R:1)
        /          \
    MEM002 (L:2)  MEM003
    /
MEM004
    /
MEM005
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- Sponsor code verification
- Email uniqueness check

## 🌟 Key Features Explained

### 1. Sponsor Code Validation
- Checks if sponsor exists in database
- Returns error if invalid

### 2. Position Check
- Verifies if left/right slot is available
- Triggers spill logic if occupied

### 3. Spill Logic Algorithm
```javascript
function findAvailablePosition(sponsor, position):
    if sponsor.position is empty:
        return sponsor.position
    else:
        recursively check sponsor.position.children
        continue until empty slot found
```

### 4. Count Update Logic
```javascript
function updateCounts(sponsor, position):
    sponsor[position + '_count'] += 1
    if sponsor.has_parent:
        updateCounts(sponsor.parent, sponsor.position)
```

## 📈 Future Enhancements

- [ ] Visual binary tree diagram
- [ ] Earnings calculation
- [ ] Commission tracking
- [ ] Level-wise view
- [ ] Generation reports
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Admin panel
- [ ] Export reports (PDF/Excel)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React and Node.js**