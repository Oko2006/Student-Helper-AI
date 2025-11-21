from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Conversation, Message
from .serializers import (
    UserSerializer, ConversationSerializer, 
    MessageSerializer, ConversationDetailSerializer
)
from .authentication import create_jwt_token
from .ai_service import get_ai_response, generate_conversation_title


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not email or not password:
        return Response(
            {'error': 'Please provide username, email, and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    token = create_jwt_token(user)
    user_data = UserSerializer(user).data
    
    return Response({
        'token': token,
        'user': user_data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = create_jwt_token(user)
    user_data = UserSerializer(user).data
    
    return Response({
        'token': token,
        'user': user_data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user_data = UserSerializer(request.user).data
    return Response(user_data)


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def message(self, request, pk=None):
        conversation = self.get_object()
        user_message_content = request.data.get('message', '')
        image = request.FILES.get('image')
        file = request.FILES.get('file')
        
        if not user_message_content and not image and not file:
            return Response(
                {'error': 'Message content, image, or file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user message
        user_message_data = {
            'conversation': conversation,
            'role': 'user',
            'content': user_message_content or 'Sent a file/image',
        }
        
        if image:
            user_message_data['image'] = image
        
        if file:
            user_message_data['file'] = file
            user_message_data['file_name'] = file.name
        
        user_message = Message.objects.create(**user_message_data)
        
        # Get conversation history
        messages = conversation.messages.all()
        conversation_history = [
            {'role': msg.role, 'content': msg.content}
            for msg in messages
        ]
        
        # Get AI response
        ai_response_content = get_ai_response(conversation_history)
        
        # Create AI message
        ai_message = Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=ai_response_content
        )
        
        # Update conversation title if it's the first message
        if messages.count() == 2:  # User message + AI response
            conversation.title = generate_conversation_title(user_message_content)
            conversation.save()
        
        # Update conversation timestamp
        conversation.save()
        
        return Response({
            'user_message': MessageSerializer(user_message).data,
            'ai_message': MessageSerializer(ai_message).data
        })
