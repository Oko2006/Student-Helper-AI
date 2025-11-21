# AI Student Chatbot 🎓

A friendly AI-powered chatbot designed to help students with their learning journey! This application helps students summarize slides, solve Computer Science questions, and provides project ideas with step-by-step guidance.

## Features ✨

- **Slide Summarization**: Upload or paste your study materials and get concise summaries
- **CS Problem Solver**: Get help solving programming and computer science questions with detailed explanations
- **Project Ideas & Guidance**: Receive project suggestions and step-by-step implementation guides
- **Image Upload**: Upload images to discuss with the AI
- **File Upload**: Share files for context or questions
- **Auto-Generated Chat Titles**: Conversations automatically get descriptive titles
- **Delete Chats**: Remove conversations you no longer need
- **Chat History**: All conversations are saved and accessible from the sidebar
- **User Authentication**: Secure login and registration system
- **Dark Mode UI**: Beautiful, low-contrast dark theme with excellent UX

## Tech Stack 🛠️

### Frontend
- **React** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Markdown** - Markdown rendering for AI responses

### Backend
- **Django** - Python web framework
- **Django REST Framework** - RESTful API
- **SQLite** - Database (easy setup for development)
- **JWT Authentication** - Secure token-based auth
- **Google Gemini API** - AI chatbot functionality (FREE tier available)
- **Pillow** - Image processing

## Prerequisites 📋

- Node.js (v16 or higher)
- Python (v3.12 or higher recommended)
- Google Gemini API Key (FREE - get it at https://aistudio.google.com/app/apikey)

## Installation & Setup 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-student-chatbot.git
cd ai-student-chatbot
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

### 4. Configure Environment Variables

Edit `backend\.env` and add your credentials:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
JWT_SECRET_KEY=your-jwt-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Get your FREE Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API key"
4. Copy and paste it into your `.env` file

### 5. Database Setup

Run migrations (SQLite database will be created automatically):

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser (optional, for admin access):

```bash
python manage.py createsuperuser
```

### 6. Start the Backend Server

```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Usage 💡

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Start Chatting**: Click "New Chat" to start a conversation
4. **Ask Questions**: 
   - Request slide summaries
   - Ask CS-related questions
   - Get project ideas and guidance
5. **View History**: Access previous conversations from the sidebar

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user info

### Conversations
- `GET /api/conversations/` - List all user conversations
- `POST /api/conversations/` - Create new conversation
- `DELETE /api/conversations/{id}/` - Delete a conversation
- `GET /api/conversations/{id}/messages/` - Get conversation messages
- `POST /api/conversations/{id}/message/` - Send message (supports text, images, and files)

## Project Structure 📁

```
ai-student-chatbot/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # Data serializers
│   │   ├── authentication.py  # JWT authentication
│   │   └── ai_service.py      # OpenAI integration
│   ├── config/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # URL routing
│   └── manage.py
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   └── ChatInterface.jsx  # Main chat UI
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── package.json
└── README.md
```

## Features in Detail 🎯

### 1. Slide Summarization
Simply paste your study materials or describe the content, and the AI will provide a concise, well-organized summary.

### 2. CS Problem Solving
Ask any computer science question - algorithms, data structures, programming concepts - and get detailed explanations with examples.

### 3. Project Ideas & Guidance
Get creative project ideas based on your skill level and interests, with step-by-step implementation guidance.

## Contributing 🤝

Contributions are welcome! Feel free to submit issues or pull requests.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For questions or support, please open an issue on the repository.

---

Made with ❤️ for students by students
