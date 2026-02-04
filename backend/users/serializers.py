from rest_framework import serializers
from .models import User
from posts.serializers import PostSerializer  # Import this to nest posts

class UserSerializer(serializers.ModelSerializer):
    # default=0 prevents errors if recent_karma isn't annotated in the queryset
    recent_karma = serializers.IntegerField(read_only=True, default=0)
    
    # This maps the 'related_name="posts"' from your Post model
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'points',
            'recent_karma',
            'posts',        # Added to show posts in profile
            'date_joined',
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)