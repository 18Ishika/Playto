from rest_framework import serializers
from .models import Post, Like
from users.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'parent', 
            'replies','replies_count', 'created_at', 'likes_count', 'is_liked_by_user'
        ]
    def get_replies_count(self, obj):
        return obj.replies.count()
    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Note: In production, we'd prefetch likes to avoid a query here
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_author(self, obj):
        # We avoid refresh_from_db() here because it causes an N+1 for every post
        # Better to handle point refreshes in the View logic
        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "points": getattr(obj.author, 'points', 0),
        }

    def get_replies(self, obj):
        # Constraint: Handle the N+1 Nightmare
        # We only serialize replies if 'include_replies' is in context
        # This prevents the feed from loading every comment tree for every post
        if not self.context.get('include_replies', False):
            return []
            
        # Optimization: Accessing obj.replies.all() uses the prefetched data
        # passed down from the view.
        return PostSerializer(
            obj.replies.all(), 
            many=True, 
            context=self.context
        ).data