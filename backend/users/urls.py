from django.urls import path
from .views import RegisterView, leaderboard, list_users, user_profile

urlpatterns = [
    path('', list_users),
    path('leaderboard/', leaderboard, name='leaderboard'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', user_profile, name='user_profile'),   
]
