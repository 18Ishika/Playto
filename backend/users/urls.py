from django.urls import path
from .views import RegisterView, leaderboard, list_users, user_detail 

urlpatterns = [
    path('', list_users),
    path('<int:user_id>/', user_detail),
    path('leaderboard/', leaderboard, name='leaderboard'),
    path('register/', RegisterView.as_view(), name='register'),
]
