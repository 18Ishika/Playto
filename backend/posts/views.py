from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import F, Prefetch, Sum, Case, When, IntegerField
from django.utils import timezone
from datetime import timedelta

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Post, Like
from .serializers import PostSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# -------------------------------
# 1. Feed View (Top-level only)
# -------------------------------
@api_view(['GET'])
def feed(request):
    """
    Fetches top-level posts only. Optimized with select_related 
    to prevent N+1 on authors.
    """
    posts = Post.objects.filter(parent__isnull=True)\
                .select_related('author')\
                .order_by('-created_at')
    
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

# -------------------------------
# 2. Post Detail (The N+1 Killer)
# -------------------------------
@api_view(['GET'])
def post_detail(request, pk):
    """
    Fetch a post and its entire comment tree efficiently.
    Constraint: Loading 50 nested comments in minimal queries.
    """
    try:
        # prefetch_related handles the recursive 'replies' tree efficiently
        post = Post.objects.prefetch_related(
            Prefetch('replies', queryset=Post.objects.order_by('created_at')),
            'replies__author', 
            'likes'
        ).get(pk=pk)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    # include_replies=True triggers the recursive logic in PostSerializer
    serializer = PostSerializer(post, context={
        'request': request, 
        'include_replies': True
    })
    return Response(serializer.data)

# -------------------------------
# 3. Create Post / Comment
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    """
    Handles both top-level posts and threaded replies.
    Updates User Karma based on type.
    """
    serializer = PostSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        with transaction.atomic():
            post = serializer.save(author=request.user)

            # Gamification: Posting also grants initial points
            if post.parent:
                request.user.points += 2  # Reward for replying
            else:
                request.user.points += 5  # Reward for new thread

            request.user.save()
            post.refresh_from_db()

        return Response(
            PostSerializer(post, context={'request': request}).data, 
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# 4. Toggle Like (Karma Engine)
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    """
    Constraint: 1 Like on Post = 5 Karma | 1 Like on Comment = 1 Karma.
    Uses F() expressions to prevent race conditions on points.
    """
    post = get_object_or_404(Post, id=post_id)
    author = post.author
    
    # Check if it's a post (no parent) or comment
    karma_reward = 5 if post.parent is None else 1
    
    like_qs = Like.objects.filter(user=request.user, post=post)

    if like_qs.exists():
        like_qs.delete()
        current_status = "unliked"
        # Atomic decrement on author's total points
        User.objects.filter(id=author.id).update(points=F('points') - karma_reward)
    else:
        Like.objects.get_or_create(user=request.user, post=post)
        current_status = "liked"
        # Atomic increment on author's total points
        User.objects.filter(id=author.id).update(points=F('points') + karma_reward)
    
    return Response({
        "status": current_status, 
        "likes_count": post.likes.count(), 
        "is_liked_by_user": current_status == "liked"
    })

# -------------------------------
# 5. 24-Hour Leaderboard
# -------------------------------
@api_view(['GET'])
def leaderboard(request):
    """
    Constraint: Top 5 Users based on Karma earned in the last 24h window.
    """
    time_threshold = timezone.now() - timedelta(hours=24)

    # Use aggregation to calculate karma from likes received within the window
    top_users = User.objects.annotate(
        recent_karma=Sum(
            Case(
                When(posts__likes__created_at__gte=time_threshold, 
                     posts__parent__isnull=True, then=5),
                When(posts__likes__created_at__gte=time_threshold, 
                     posts__parent__isnull=False, then=1),
                default=0,
                output_field=IntegerField(),
            )
        )
    ).order_by('-recent_karma')[:5]

    # Dynamically import to avoid circular dependency if necessary
    from users.serializers import UserSerializer
    serializer = UserSerializer(top_users, many=True)
    return Response(serializer.data)