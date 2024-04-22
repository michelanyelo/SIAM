from django.db import IntegrityError, connection
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import User
from django.contrib.auth import authenticate, login, logout
import json
from unidecode import unidecode


# Create your views here.


def index(request):
    final_user = None
    resultados_busqueda = []

    if request.method == "POST":
        with open("siam/static/js/servicios.json", "r", encoding="utf-8") as file:
            data = json.load(file)

        from unidecode import unidecode

        def buscar_servicio(query):
            resultados = []
            for servicio in data["servicios"]:
                departamento = next((dep for dep in data["departamentos"] if dep["id"] == servicio["departamento_id"]), None)
                if unidecode(query.lower()) in unidecode(servicio["nombre"].lower()) or unidecode(query.lower()) in unidecode(servicio["descripcion"].lower()):
                    servicio['departamento_nombre'] = departamento['nombre'] if departamento else 'Departamento no encontrado'
                    resultados.append(servicio)
                else:
                    # Buscar en el nombre de los departamentos
                    if departamento and unidecode(query.lower()) in unidecode(departamento["nombre"].lower()):
                        servicio['departamento_nombre'] = departamento['nombre']
                        resultados.append(servicio)
            resultados_ordenados = sorted(resultados, key=lambda x: x['nombre'])
            return resultados_ordenados


        search_query = request.POST.get('search_query')
        resultados_busqueda = buscar_servicio(search_query)
        return JsonResponse({'resultados': resultados_busqueda})

    if request.user.is_authenticated:
        current_user = request.user
        final_user = f"{current_user.first_name} {current_user.last_name}"

    return render(request, 'siam/base.html', {'usuario': final_user})


def login_view(request):
    if request.method == "POST":
        rut = request.POST["rut"]
        password = request.POST["password"]

        if rut and password:
            user = authenticate(request, username=rut, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(
                    request,
                    "siam/login.html",
                    {"error": "El usuario/contraseña no se encuentra registrado."},
                )
        else:
            return render(
                request,
                "siam/login.html",
                {"error": "Por favor, proporciona tanto el RUT como la contraseña."},
            )
    else:
        message = request.GET.get("message", None)
        return render(request, "siam/login.html", {"message": message})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def registro(request):
    if request.method == "POST":
        username = request.POST["rut"]
        nombre = request.POST["nombre"]
        a_paterno = request.POST["paterno"]
        a_materno = request.POST["materno"]
        fecha_nacimiento = request.POST["fecha_nacimiento"]
        genero = request.POST["genero"]
        telefono = request.POST["telefono"]
        correo = request.POST["correo"]
        poblacion_id = request.POST["poblacion"]
        contraseña = request.POST["password"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["repetirPassword"]
        if password != confirmation:
            return render(request, "siam/registro.html", {
                "message": "Las contraseñas deben coincidir."
            })

        # Genero a base de dato
        match genero:
            case "1":
                genero = "Masculino"
            case "2":
                genero = "Femenino"
            case "3":
                genero = "No binario"
            case "4":
                genero = "Prefiero no especificar"

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username=username,
                password=contraseña,
                email=correo,
                first_name=nombre,
                last_name=f"{a_paterno} {a_materno}",
                nacimiento=fecha_nacimiento,
                genero=genero,
                telefono=telefono,
                direccion_id=poblacion_id

            )

            user.save()
        except IntegrityError:
            return render(request, "siam/registro.html", {
                "message": "Usuario actualmente en uso."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("login") + "?message=" + f"{nombre} {a_paterno} {a_materno} se ha registrado exitosamente")
    else:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id_poblacion, poblacion FROM dic_poblaciones ORDER BY poblacion")
            poblaciones = [{'id_poblacion': row[0], 'poblacion': row[1]}
                           for row in cursor.fetchall()]
        return render(request, "siam/registro.html", {"poblaciones": poblaciones})


def nueva_solicitud(request):
    if request.user.is_authenticated:
        current_user = request.user
        final_user = f"{current_user.first_name} {current_user.last_name}"

    return render(request, 'siam/nueva_solicitud.html', {'usuario': final_user})
