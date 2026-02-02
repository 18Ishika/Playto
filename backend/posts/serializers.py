from rest_framework import serializers
from .models import Post
from users.serializers import UserSerializer  # to include author info
class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()  # <-- change here
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'parent', 'replies', 'created_at']

    def get_author(self, obj):
        # Always read fresh points from DB
        obj.author.refresh_from_db()
        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "email": obj.author.email,
            "points": obj.author.points,  # <-- latest points
            "date_joined": obj.author.date_joined,
        }

    def get_replies(self, obj):
        qs = obj.replies.all().order_by('created_at')
        return PostSerializer(qs, many=True).data
