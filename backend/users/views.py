from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def list_users(request):
    users = User.objects.all().order_by('-points')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
def leaderboard(request):
    users = User.objects.order_by('-points', 'date_joined')[:10]
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
