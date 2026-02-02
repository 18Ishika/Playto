from django.urls import path
from .views import feed, create_post

urlpatterns = [
    path('', feed),               # GET /posts/
    path('create/', create_post), # POST /posts/create/
    path('feed/', feed),
]
