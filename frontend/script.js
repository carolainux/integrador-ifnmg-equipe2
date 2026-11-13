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

const API_BASE = localStorage.getItem('agrosensor_api_base')
    || `http://${location.hostname || 'localhost'}:3000/api`;

const rotulosCultura = { Feijao: 'Feijão', Abobora: 'Abóbora', Rucula: 'Rúcula' };
const rotuloCultura = valor => rotulosCultura[valor] || valor;

function tokenAtual() {
    return localStorage.getItem('agrosensor_token');
}

function usuarioAtual() {
    try {
        return JSON.parse(localStorage.getItem('agrosensor_usuario'));
    } catch {
        return null;
    }
}

function salvarSessao(token, usuario) {
    localStorage.setItem('agrosensor_token', token);
    localStorage.setItem('agrosensor_usuario', JSON.stringify(usuario));
}

function limparSessao() {
    localStorage.removeItem('agrosensor_token');
    localStorage.removeItem('agrosensor_usuario');
}

function caminhoLogin() {
    return location.pathname.includes('/user/') ? 'login.html' : '../user/login.html';
}

async function apiFetch(caminho, opcoes = {}) {
    const headers = { ...(opcoes.headers || {}) };
    if (opcoes.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const token = tokenAtual();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const resposta = await fetch(`${API_BASE}${caminho}`, { ...opcoes, headers });
    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (resposta.status === 401 && caminho !== '/auth/login') {
        limparSessao();
        window.location.href = caminhoLogin();
    }

    if (!resposta.ok) {
        const erro = new Error((dados && dados.erro) || 'Não foi possível conectar ao servidor.');
        erro.status = resposta.status;
        throw erro;
    }

    return dados;
}

function chaveAlertasVistos(usuarioId) {
    return `agrosensor_alertas_vistos:${usuarioId}`;
}

function alertasVistosEm(usuarioId) {
    return Number(localStorage.getItem(chaveAlertasVistos(usuarioId))) || 0;
}

function marcarAlertasVistos(usuarioId, alertas = []) {
    if (!usuarioId) return;

    const agora = Date.now();
    const maisRecente = alertas.reduce((max, alerta) => {
        const data = new Date(alerta.gerado_em).getTime();
        return Number.isFinite(data) && data > max ? data : max;
    }, 0);

    localStorage.setItem(chaveAlertasVistos(usuarioId), String(Math.max(agora, maisRecente)));
}

function atualizarBadgeAlertas(alertas, usuarioId) {
    const vistoEm = alertasVistosEm(usuarioId);
    const naoLidos = alertas.filter(alerta => {
        const data = new Date(alerta.gerado_em).getTime();
        return Number.isFinite(data) && data > vistoEm;
    }).length;

    document.querySelectorAll('a[href$="alertas.html"] span.absolute').forEach(badge => {
        badge.textContent = naoLidos;
        badge.classList.toggle('hidden', naoLidos === 0);
    });

    return naoLidos;
}

async function sincronizarBadgeAlertas() {
    const usuario = usuarioAtual();
    if (!usuario || !usuario.id) return;

    try {
        const alertas = await apiFetch(`/alertas/usuario/${usuario.id}`);
        atualizarBadgeAlertas(alertas, usuario.id);
    } catch {}
}

document.querySelectorAll('a[href$="alertas.html"] span.absolute').forEach(badge => {
    badge.classList.add('hidden');
});

async function carregarResumoPlantacao(plantacao_id) {
    const [dashboard, alertas] = await Promise.all([
        apiFetch(`/leituras/dashboard/${plantacao_id}`).catch(() => null),
        apiFetch(`/alertas/resumo/${plantacao_id}`).catch(() => null)
    ]);

    const ultima = dashboard && dashboard.ultima;
    const tipo = alertas && alertas.ultimo_alerta && alertas.ultimo_alerta.tipo;
    // ponytail: status derivado do último alerta; criar status/resolução no backend se isso importar.
    const status = tipo === 'Critico' ? 'Crítico' : tipo === 'Atencao' ? 'Atenção' : 'Ideal';

    return {
        status,
        umidade: ultima ? ultima.umidade_solo : null,
        temperatura: ultima ? ultima.temperatura : null,
        luminosidade: ultima ? ultima.luminosidade : null,
        ultimaLeitura: ultima ? ultima.data_hora : null,
        totalAlertas: alertas ? alertas.total : 0
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const pagina = location.pathname.split('/').pop();
    const publicas = ['login.html', 'cadastro.html', 'senha.html', 'redefinir-senha.html'];

    if (!publicas.includes(pagina) && !tokenAtual()) {
        window.location.href = caminhoLogin();
        return;
    }

    if (!publicas.includes(pagina) && !['index.html', 'alertas.html', 'dispositivos.html'].includes(pagina)) {
        sincronizarBadgeAlertas();
    }

    document.querySelectorAll('a').forEach((link) => {
        if (link.textContent.trim() === 'Sair') {
            link.addEventListener('click', limparSessao);
        }
    });
});

/* ==========================================================
   Integração pendente

   DASHBOARD (index.html): GET /plantacoes/usuario/:usuario_id
   DETALHE (plantacao-detalhe.html): GET /plantacoes/:id,
     GET /leituras/dashboard/:plantacao_id e GET /alertas/plantacao/:plantacao_id
   NOVA/EDITAR (plantacao-nova.html, plantacao-editar.html): POST/PUT /plantacoes
   ALERTAS (alertas.html): GET /alertas/usuario/:usuario_id
   DISPOSITIVOS (dispositivos.html): CRUD /dispositivos
   CONFIGURAÇÕES (configuracoes.html): sem endpoints no backend
   ========================================================== */