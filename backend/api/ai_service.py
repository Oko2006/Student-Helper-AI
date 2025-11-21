from django.conf import settings

SYSTEM_PROMPT = """You are a friendly and helpful AI Study Buddy for students! 🎓

Your main goals are to:
1. Help students summarize their slides and study materials
2. Solve Computer Science questions and problems with clear explanations
3. Provide project ideas and guide students through implementation step-by-step

Guidelines:
- Be warm, encouraging, and patient - you're talking to beginners!
- Use simple language and avoid jargon unless you explain it
- Break down complex concepts into easy-to-understand parts
- Use emojis occasionally to be friendly (but don't overdo it)
- When explaining code, provide clear comments
- When giving project guidance, break it into manageable steps
- Celebrate their progress and encourage questions
- If asked about slide summarization, ask for the content and create concise, organized summaries
- For CS questions, explain the logic step-by-step
- For projects, start with the overall goal, then break it down into phases

Remember: You're here to make learning fun and accessible! 😊
"""


def get_ai_response(conversation_history):
    """
    Get a response from the AI based on conversation history.
    
    Args:
        conversation_history: List of message dicts with 'role' and 'content'
    
    Returns:
        str: AI response
    """
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Try different model names from the available models
        model_names = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']
        model = None
        last_error = None
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                break
            except Exception as e:
                last_error = e
                continue
        
        if model is None:
            return f"I'm sorry, I couldn't find an available AI model. Error: {last_error}. Please check your Gemini API key at https://makersuite.google.com/app/apikey"
    except Exception as e:
        return f"I'm sorry, I couldn't initialize the AI service: {str(e)}. Please check your Gemini API key."
    
    # Build conversation context
    conversation_text = SYSTEM_PROMPT + "\n\n"
    for msg in conversation_history:
        role = "Student" if msg['role'] == 'user' else "AI Tutor"
        conversation_text += f"{role}: {msg['content']}\n\n"
    
    try:
        response = model.generate_content(conversation_text)
        return response.text
    except Exception as e:
        return f"I'm sorry, I encountered an error: {str(e)}. Please make sure your Gemini API key is valid and has API access enabled."


def generate_conversation_title(first_message):
    """
    Generate a short title for the conversation based on the first message.
    
    Args:
        first_message: The first user message in the conversation
    
    Returns:
        str: A short title (max 50 chars)
    """
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Try different model names from available models
        for model_name in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']:
            try:
                model = genai.GenerativeModel(model_name)
                prompt = f"Generate a short, descriptive title (max 5 words) for a conversation that starts with: {first_message}\nOnly respond with the title, nothing else."
                response = model.generate_content(prompt)
                title = response.text.strip()
                return title[:50]  # Limit to 50 chars
            except:
                continue
        
        # If all models fail, use fallback
        return first_message[:50] if len(first_message) <= 50 else first_message[:47] + "..."
    except:
        # Fallback to a simple title based on the first message
        return first_message[:50] if len(first_message) <= 50 else first_message[:47] + "..."
