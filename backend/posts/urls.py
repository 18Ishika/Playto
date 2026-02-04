from django.urls import path
from .views import feed, create_post , toggle_like , post_detail , leaderboard

urlpatterns = [
    path('', feed),               # GET /posts/
    path('create/', create_post), # POST /posts/create/
    path('feed/', feed),
    path('postdetail/<int:pk>/', post_detail),
    path('<int:post_id>/like/', toggle_like),
    path('leaderboard/',leaderboard)
]
