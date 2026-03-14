# Draft16

> Where 16s Are Born.

---

## PROJECT OVERVIEW

Draft16 is a full-stack creative workspace for rappers and lyricists. Users can write lyrics, attach beats, and manage their songwriting sessions all in one place.

---

## TECH STACK

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- JWT
- bcrypt

---

## FEATURES

### User Authentication
- Signup with username, email, and password
- Login with JWT token stored in `localStorage`
- Protected routes — unauthenticated users are redirected to `/login`
- Dynamic Navbar showing Login/Signup for guests and Dashboard/Logout for authenticated users

### Songwriting Sessions (CRUD)
- Create new sessions with a title and optional beat URL
- Edit lyrics inside the session editor
- Attach YouTube beat URLs to sessions
- Save session changes via the backend API
- Delete sessions from the dashboard

### Dashboard
- View all your sessions in a responsive card grid
- Open any session to edit
- Navigate to create a new session

### Session Editor
- Large lyrics textarea for focused writing
- Beat source selector (YouTube / External / Upload)
- Beat URL input field
- YouTube beat player — paste a YouTube URL and the beat plays inline while you write
- Save changes button with loading state

### Beat Playback (Step 8)
- `BeatPlayer.jsx` component that accepts `beatSource` and `beatUrl` as props
- Uses a `extractVideoId()` helper to parse both standard and shortened YouTube URLs
- Renders a responsive embedded YouTube iframe directly inside the Session Editor
- Player only renders if `beatSource === "youtube"` and a valid URL is provided

---

## PROJECT STRUCTURE

```
draft16
├── client
│   └── src
│       ├── components
│       │   ├── BeatPlayer.jsx       ← YouTube iframe player
│       │   ├── Navbar.jsx           ← Auth-aware navigation
│       │   └── SessionCard.jsx
│       ├── pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx            ← Full login form + JWT flow
│       │   ├── Signup.jsx           ← Full signup form + JWT flow
│       │   ├── Dashboard.jsx        ← Protected page
│       │   ├── NewSession.jsx
│       │   └── SessionEditor.jsx    ← Beat player integrated here
│       ├── services
│       │   ├── api.js               ← Axios base instance
│       │   ├── authService.js       ← login() + signup() API calls
│       │   └── sessionService.js    ← CRUD API calls
│       └── utils
│           └── auth.js              ← getToken / setToken / removeToken
│
└── server
    ├── controllers
    ├── models
    ├── routes
    ├── middleware
    └── config
```

---

## API OVERVIEW

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Session Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get all sessions for user |
| POST | `/api/sessions` | Create a new session |
| GET | `/api/sessions/:id` | Get a single session |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |

All session routes are protected and require `Authorization: Bearer <token>` header.

---

## HOW IT WORKS

1. User registers or logs in → JWT is saved in `localStorage`
2. Navbar detects the token and shows authenticated links
3. User creates a session from the Dashboard
4. In the Session Editor, user writes lyrics and pastes a YouTube beat URL
5. The `BeatPlayer` component parses the URL, extracts the video ID, and embeds the YouTube player
6. User saves the session — title, lyrics, and beat URL are persisted to MongoDB

---

## FUTURE IMPROVEMENTS

- Autosave lyrics
- Audio beat uploads (file upload support)
- Voice demo recording
- Session search and filtering
- Real-time collaboration

---

## AUTHOR

Daksh Bajaniya