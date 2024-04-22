# def add_usuario(request):
#     final_user = None
#     if request.user.is_authenticated:
#         current_user = request.user
#         final_user = f"{current_user.nombre} {current_user.apaterno} {current_user.amaterno}"
#     return {'usuario': final_user}