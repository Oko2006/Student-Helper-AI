import React, { useState, useEffect, useRef } from 'react'
import { Send, Plus, LogOut, MessageSquare, Sparkles, Menu, X, Trash2, Paperclip, Image as ImageIcon, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ChatInterface = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations/')
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}/messages/`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await axios.post('/api/conversations/', {
        title: 'New Chat'
      })
      setConversations([response.data, ...conversations])
      setCurrentConversation(response.data.id)
      setMessages([])
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const selectConversation = async (conversationId) => {
    setCurrentConversation(conversationId)
    await fetchMessages(conversationId)
  }

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      await axios.delete(`/api/conversations/${conversationId}/`)
      setConversations(conversations.filter(c => c.id !== conversationId))
      if (currentConversation === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      alert('Failed to delete conversation')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage && !selectedFile) return

    if (!currentConversation) {
      await createNewConversation()
      setTimeout(() => sendMessageToAPI(), 100)
      return
    }

    await sendMessageToAPI()
  }

  const sendMessageToAPI = async () => {
    const userMessage = inputMessage.trim()
    const image = selectedImage
    const file = selectedFile
    
    setInputMessage('')
    setSelectedImage(null)
    setSelectedFile(null)
    
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage || 'Sent a file/image',
      image: image ? URL.createObjectURL(image) : null,
      file_name: file?.name,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])
    setLoading(true)

    try {
      const formData = new FormData()
      if (userMessage) formData.append('message', userMessage)
      if (image) formData.append('image', image)
      if (file) formData.append('file', file)

      const response = await axios.post(`/api/conversations/${currentConversation}/message/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        response.data.user_message,
        response.data.ai_message
      ])

      if (messages.length === 0) {
        fetchConversations()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id))
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-dark-surface border-r border-dark-border flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-purple" />
            <h2 className="font-semibold text-dark-text">AI Assistant</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-dark-text-secondary hover:text-dark-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={createNewConversation}
            className="w-full bg-accent-blue hover:bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-start gap-2 group ${
                currentConversation === conv.id
                  ? 'bg-dark-hover border border-accent-blue'
                  : 'bg-dark-bg hover:bg-dark-hover border border-transparent'
              }`}
            >
              <button
                onClick={() => selectConversation(conv.id)}
                className="flex items-start gap-2 flex-1 min-w-0"
              >
                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-dark-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-dark-text text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-dark-text-secondary text-xs mt-1">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 text-dark-text-secondary hover:text-red-400 transition flex-shrink-0"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-dark-text text-sm">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="text-dark-text-secondary hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-dark-surface border-b border-dark-border p-4 flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-dark-text-secondary hover:text-dark-text"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-dark-text">
              {conversations.find(c => c.id === currentConversation)?.title || 'AI Student Assistant'}
            </h1>
            <p className="text-sm text-dark-text-secondary">
              I can help with summarizing slides, solving CS questions, and project ideas!
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-16 h-16 text-accent-purple mb-4" />
              <h2 className="text-2xl font-semibold text-dark-text mb-2">
                Hello! I'm your AI Study Buddy 👋
              </h2>
              <p className="text-dark-text-secondary max-w-md">
                I'm here to help you learn! Ask me to:
              </p>
              <div className="mt-4 space-y-2 text-left max-w-md">
                <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
                  <p className="text-dark-text">📚 Summarize your slides and study materials</p>
                </div>
                <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
                  <p className="text-dark-text">💡 Help solve CS questions and problems</p>
                </div>
                <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
                  <p className="text-dark-text">🚀 Give you project ideas with step-by-step guidance</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark-surface border border-dark-border text-dark-text'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert max-w-none prose-pre:bg-dark-bg prose-code:text-accent-blue">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-xs rounded-lg mb-2"
                      />
                    )}
                    {message.file_name && (
                      <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded px-3 py-2 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{message.file_name}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-dark-surface border-t border-dark-border p-4">
          <div className="max-w-4xl mx-auto">
            {(selectedImage || selectedFile) && (
              <div className="mb-2 flex gap-2 flex-wrap">
                {selectedImage && (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border border-dark-border"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedFile && (
                  <div className="relative inline-flex items-center gap-2 bg-dark-hover border border-dark-border rounded px-3 py-2">
                    <FileText className="w-4 h-4 text-dark-text-secondary" />
                    <span className="text-sm text-dark-text">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-dark-text-secondary hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={loading}
                className="bg-dark-hover hover:bg-dark-border text-dark-text-secondary hover:text-accent-blue p-3 rounded-lg transition disabled:opacity-50"
                title="Upload image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-dark-hover hover:bg-dark-border text-dark-text-secondary hover:text-accent-blue p-3 rounded-lg transition disabled:opacity-50"
                title="Upload file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything! I'm here to help you learn 😊"
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent-blue transition resize-none"
                rows="1"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || (!inputMessage.trim() && !selectedImage && !selectedFile)}
                className="bg-accent-blue hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
