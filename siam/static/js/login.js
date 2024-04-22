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

(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      },
      false
    )
  })
})()