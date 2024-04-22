// VALIDACION Y FORMATEO RUT

function checkRut(rut) {
    var valor = rut.value.replace(/\./g, '');
    valor = valor.replace('-', '');

    var cuerpo = valor.slice(0, -1);
    var dv = valor.slice(-1).toUpperCase();

    rut.value = cuerpo + '-' + dv

    if (cuerpo.length < 7) {
        rut.setCustomValidity("RUT Incompleto");
        rut.classList.add('is-invalid');
        rut.classList.remove('is-valid');
        return false;
    }

    var suma = 0;
    var multiplo = 2;

    for (var i = 1; i <= cuerpo.length; i++) {
        var index = multiplo * valor.charAt(cuerpo.length - i);
        suma = suma + index;
        if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }

    var dvEsperado = 11 - (suma % 11);
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;

    if (dvEsperado != dv) {
        rut.setCustomValidity("RUT Inválido");
        rut.classList.add('is-invalid');
        rut.classList.remove('is-valid');
        return false;
    }

    rut.setCustomValidity("");
    rut.classList.remove('is-invalid');
    rut.classList.add('is-valid');
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    // CALENDARIO REGISTRO NUEVO USUARIO

    new AirDatepicker('#registro-fecha', {
        isMobile: true,
        autoClose: true,
        locale: {
            days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'yyyy-MM-dd',
            timeFormat: 'hh:mm aa',
            firstDay: 1
        }
    });


    // VALIDACION CONTRASEÑAS
    var timeout = null;

    document.getElementById('registro-password').addEventListener('input', validatePasswords);
    document.getElementById('registro-repetir-password').addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(validatePasswords, 500);
    });

    function validatePasswords() {
        var password = document.getElementById('registro-password');
        var repeatPassword = document.getElementById('registro-repetir-password');

        if (password.value && repeatPassword.value) {
            if (password.value !== repeatPassword.value) {
                repeatPassword.classList.add('is-invalid');
                repeatPassword.classList.remove('is-valid');
                // repeatPassword.setCustomValidity('Las contraseñas no coinciden');
            } else {
                repeatPassword.classList.remove('is-invalid');
                repeatPassword.classList.add('is-valid');
                // repeatPassword.setCustomValidity('');
            }
            if (!repeatPassword.checkValidity()) {
                repeatPassword.reportValidity();
            }
        }
    }



    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation')
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
    })()

})