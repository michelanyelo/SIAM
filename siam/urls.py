from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("registro/", views.registro, name="registro"),
    path("logout/", views.logout_view, name="logout"),
    path("nueva-solicitud/", views.nueva_solicitud, name="nueva_solicitud")
]
