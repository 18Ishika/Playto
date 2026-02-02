from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Post
from .serializers import PostSerializer

# -------------------------------
# Feed View
# -------------------------------
@api_view(['GET'])
def feed(request):
    # Only top-level posts  
    posts = Post.objects.filter(parent__isnull=True).order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# -------------------------------
# Create Post View
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        with transaction.atomic():
            # Save post with current user as author
            post = serializer.save(author=request.user)

            # Update points
            if post.parent:
                request.user.points += 5   # reply
            else:
                request.user.points += 10  # top-level post

            request.user.save()  # persist points

            # Refresh post so nested author shows updated points
            post.refresh_from_db()

        return Response(PostSerializer(post).data, status=201)

    return Response(serializer.errors, status=400)
