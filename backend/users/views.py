from posts.models import Post
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch , Count 

@api_view(['GET'])
def list_users(request):
    users = User.objects.all().order_by('-points')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Returns profile details and posts for the logged-in user.
    """
    # Fetch user and pre-load their posts with likes/replies counts
    user = request.user.__class__.objects.prefetch_related(
        Prefetch(
            'posts', 
            queryset=Post.objects.annotate(
                likes_count=Count('likes', distinct=True),
                replies_count=Count('replies', distinct=True)
            ).order_by('-created_at')
        )
    ).get(id=request.user.id)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)
@api_view(['GET'])
def leaderboard(request):
    users = User.objects.order_by('-points', 'date_joined')[:10]
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # Anyone can sign up
    serializer_class = RegisterSerializer