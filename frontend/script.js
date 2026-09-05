const olhoRiscado = "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88";

const olhoAberto = "M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.21.07.434 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z";

function mostrarSenha(idCampo, idIcone) {

    const campo = document.getElementById(idCampo);
    const icone = document.getElementById(idIcone);
    const path = icone.querySelector("path");

    if (campo.type === "password") {
        campo.type = "text";
        path.setAttribute("d", olhoAberto);
    } else {
        campo.type = "password";
        path.setAttribute("d", olhoRiscado);
    }
}

const ctxGrafico = document.getElementById('graficoMonitoramento');

if (ctxGrafico) {
    new Chart(ctxGrafico, {
        type: 'line',
        data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00'],
            datasets: [
                {
                    label: 'Umidade do Solo (%)',
                    data: [70, 68, 65, 72, 69],
                    borderColor: '#078607',
                    backgroundColor: 'rgba(7, 134, 7, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Temperatura (°C)',
                    data: [22, 25, 28, 30, 27],
                    borderColor: '#e11d48',
                    backgroundColor: 'rgba(225, 29, 72, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

const ctxPlantacao = document.getElementById('graficoMonitoramento');

if (ctxPlantacao) {
    new Chart(ctxPlantacao, {
        type: 'line',
        data: {
            labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h'],
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: [22, 35, 45, 38, 42, 15, 28, 25, 12, 45],
                    borderColor: '#e11d48',
                    backgroundColor: 'rgba(225, 29, 72, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Umidade (%)',
                    data: [5, 30, 48, 45, 52, 35, 45, 50, 32, 50],
                    borderColor: '#1e293b',
                    backgroundColor: 'rgba(30, 41, 59, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { min: 0, max: 60 }
            }
        }
    });
}

/* ==========================================================
   TODO - INTEGRAÇÃO COM BACKEND (API já pronta, ver backend/src/routes)

   LOGIN (login.html):
   POST /auth/login
   Body: { email, senha }
   → Substituir o submit do form por fetch() enviando os dados
     e salvando o token retornado.

   CADASTRO (cadastro.html):
   POST /usuarios
   Body: { nome, email, telefone, senha }
   → Substituir o submit do form por fetch() enviando os dados.

   DASHBOARD (index.html):
   GET /plantacoes/usuario/:usuario_id
   → Buscar lista de plantações do usuário logado e gerar os
     cards dinamicamente, em vez dos 4 cards fixos no HTML.

   DETALHE DA PLANTAÇÃO (plantacao-detalhe.html):
   GET /plantacoes/:id                    → dados do card (Cultura, Início, Status)
   GET /leituras/dashboard/:plantacao_id  → dados do gráfico Chart.js (temperatura/umidade)
   GET /alertas/plantacao/:plantacao_id   → lista de alertas exibida na tela
   ========================================================== */