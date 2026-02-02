from django.urls import path
from .views import leaderboard, list_users, user_detail

urlpatterns = [
    path('', list_users),
    path('<int:user_id>/', user_detail),
     path('leaderboard/', leaderboard, name='leaderboard'),
]
