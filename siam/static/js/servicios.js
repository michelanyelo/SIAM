document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = new FormData(this);
    var url = "/";

    fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            var resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';

            var resultados = data.resultados; // Asegúrate de acceder a 'data.resultados'
            if (resultados && resultados.length > 0) { // Verifica si 'resultados' existe y tiene elementos
                resultados.forEach((resultado) => {
                    var accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item';

                    var accordionHeader = document.createElement('h2');
                    accordionHeader.className = 'accordion-header';
                    accordionHeader.innerHTML = `
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${resultado.id}"
                        style="color: #00496A; font-size: 14px; font-weight: 500; text-transform: uppercase">${resultado.nombre}
                        <div class="accordion-department" style="font-size: 12px; color: #888;"> (${resultado.departamento_nombre})</div>
                    </button>
                    `;

                    var accordionBody = document.createElement('div');
                    accordionBody.id = `collapse${resultado.id}`;
                    accordionBody.className = 'accordion-collapse collapse';
                    accordionBody.innerHTML = `
                    <div class="accordion-body">
                        <div class="row">
                            <div class="col-1" style="text-align: center; align-content: center"> 
                                <i class="fa-regular fa-circle-check" style="color: #00496A; font-size: 28px;"></i>
                            </div>
                            <div class="col-11"> 
                                <p style="color: #00496A; font-size: 17px; font-weight: 400">${resultado.descripcion}</p>
                                <div class="d-grid gap-2">
                                    <a href="/nueva-solicitud" class="btn" style="color: white; background-color: #00496A">Confirmar Solicitud</a>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    accordionItem.appendChild(accordionHeader);
                    accordionItem.appendChild(accordionBody);

                    resultsContainer.appendChild(accordionItem);
                });
            } else {
                resultsContainer.textContent = 'No se encontraron resultados';
            }
        })
        .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
        });
});