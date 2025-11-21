# Quick Setup Guide 🚀

Follow these steps to get the AI Student Chatbot running on your machine.

## Step 1: Install Prerequisites

### Windows

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Choose LTS version
   - Verify: `node --version`

2. **Install Python**
   - Download from https://www.python.org/
   - Version 3.9 or higher
   - Check "Add Python to PATH" during installation
   - Verify: `python --version`

3. **Install PostgreSQL**
   - Download from https://www.postgresql.org/download/
   - Remember your postgres password!
   - Verify: `psql --version`

4. **Get OpenAI API Key**
   - Go to https://platform.openai.com/
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key and save it

## Step 2: Setup Database

1. Open PostgreSQL (pgAdmin or command line)
2. Create a new database:
   ```sql
   CREATE DATABASE ai_chatbot;
   ```

## Step 3: Setup Backend

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Edit .env file with your settings
# Add your database password and OpenAI API key
notepad .env
```

### Important: Edit the .env file with your credentials!

```env
DB_PASSWORD=your-postgresql-password
OPENAI_API_KEY=your-openai-api-key
```

```powershell
# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Leave this terminal running! ✅

## Step 4: Setup Frontend

Open a NEW terminal window:

```powershell
# Navigate to project root
cd C:\Users\Pc\CascadeProjects\ai-student-chatbot

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Leave this terminal running too! ✅

## Step 5: Access the Application

1. Open your browser
2. Go to `http://localhost:3000`
3. Register a new account
4. Start chatting with your AI study buddy! 🎉

## Common Issues & Solutions 🔧

### Issue: "Module not found" error
**Solution**: Make sure you've run `npm install` in the root directory and `pip install -r requirements.txt` in the backend directory.

### Issue: Database connection error
**Solution**: 
- Check PostgreSQL is running
- Verify database name, username, and password in `.env`
- Make sure the database `ai_chatbot` exists

### Issue: OpenAI API error
**Solution**:
- Verify your API key is correct in `.env`
- Check you have credits in your OpenAI account
- Ensure there are no extra spaces in the API key

### Issue: Port already in use
**Solution**:
- Frontend: Change port in `vite.config.js`
- Backend: Run with `python manage.py runserver 8001`

### Issue: CORS errors
**Solution**: Make sure both servers are running and the backend is on port 8000

## Testing the Application

1. **Register**: Create a test account
2. **New Chat**: Click "New Chat" button
3. **Test Questions**:
   - "Can you summarize the concept of object-oriented programming?"
   - "How do I solve a binary search problem?"
   - "Give me a beginner-friendly web development project idea"

## Next Steps

- Explore the chat interface
- Try different types of questions
- Check your chat history in the sidebar
- Customize the UI if you want (colors in `tailwind.config.js`)

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for understanding
- Open an issue if you encounter problems

Happy coding! 🎓✨
