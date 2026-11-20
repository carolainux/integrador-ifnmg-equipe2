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
    const status = tipo === 'Critico' ? 'Crítico' : tipo === 'Atencao' ? 'Atenção' : 'Ideal';

    return {
        status,
        umidade: ultima ? ultima.umidade_solo : null,
        temperatura: ultima ? ultima.temperatura : null,
        luminosidade: ultima ? ultima.luminosidade : null,
        ultimaLeitura: ultima ? ultima.data_hora : null
    };
}


/* Responsividade: em telas menores que 1024 px o menu lateral vira uma gaveta,
   aberta pelo botão da barra superior. Os estilos ficam no style.css. */
function prepararMenuResponsivo() {
    const menu = document.querySelector('aside[class*="w-[260px]"]');
    if (!menu) return;

    const barra = document.createElement('div');
    barra.className = 'menu-topo';
    barra.innerHTML = `
        <button type="button" aria-label="Abrir menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <span>AgroSensor</span>`;

    const fundo = document.createElement('div');
    fundo.className = 'menu-fundo';

    document.body.appendChild(barra);
    document.body.appendChild(fundo);
    document.body.classList.add('tem-menu-topo');

    const botao = barra.querySelector('button');
    const fechar = () => {
        document.body.classList.remove('menu-aberto');
        botao.setAttribute('aria-expanded', 'false');
    };

    botao.addEventListener('click', () => {
        const aberto = document.body.classList.toggle('menu-aberto');
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    fundo.addEventListener('click', fechar);
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', fechar));
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') fechar();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) fechar();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const pagina = location.pathname.split('/').pop();
    const publicas = ['login.html', 'cadastro.html', 'senha.html', 'redefinir-senha.html'];

    if (!publicas.includes(pagina) && !tokenAtual()) {
        window.location.href = caminhoLogin();
        return;
    }

    prepararMenuResponsivo();

    if (!publicas.includes(pagina) && !['index.html', 'alertas.html', 'dispositivos.html'].includes(pagina)) {
        sincronizarBadgeAlertas();
    }

        document.querySelectorAll('a').forEach((link) => {
        if (link.textContent.trim() === 'Sair') {
            link.addEventListener('click', (evento) => {
                if (!confirm('Tem certeza que deseja sair?')) {
                    evento.preventDefault(); // cancela: continua na tela atual
                    return;
                }
                limparSessao(); // confirmou: apaga a sessão e segue para o login
            });
        }
    });
});
// ---------- CLIMA (compartilhado entre todas as telas) ----------
const CLIMA_CIDADE_PADRAO = { lat: -16.85, lon: -42.06 }; // Araçuaí - MG
const CLIMA_CACHE_MIN = 30;

const codigosClima = {
  0:  ['Céu limpo', '☀️'],
  1:  ['Predomínio de sol', '🌤️'],
  2:  ['Parcialmente nublado', '⛅'],
  3:  ['Nublado', '☁️'],
  45: ['Neblina', '🌫️'],
  48: ['Neblina', '🌫️'],
  51: ['Garoa leve', '🌦️'],
  53: ['Garoa', '🌦️'],
  55: ['Garoa forte', '🌦️'],
  61: ['Chuva leve', '🌧️'],
  63: ['Chuva', '🌧️'],
  65: ['Chuva forte', '🌧️'],
  80: ['Pancadas de chuva', '🌦️'],
  81: ['Pancadas de chuva', '🌦️'],
  82: ['Pancadas fortes', '⛈️'],
  95: ['Tempestade', '⛈️'],
  96: ['Tempestade com granizo', '⛈️'],
  99: ['Tempestade com granizo', '⛈️']
};

function mostrarClima({ temp, codigo }) {
  const [descricao, icone] = codigosClima[codigo] || ['—', '🌡️'];
  const t = document.getElementById('clima-temp');
  const d = document.getElementById('clima-desc');
  const i = document.getElementById('clima-icone');
  if (t) t.textContent = `${Math.round(temp)}°C`;
  if (d) d.textContent = descricao;
  if (i) i.textContent = icone;
}

function obterPosicao() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(CLIMA_CIDADE_PADRAO);
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => resolve(CLIMA_CIDADE_PADRAO),
      { timeout: 5000, maximumAge: 3600000 }
    );
  });
}

async function carregarClima() {
  if (!document.getElementById('clima-temp')) return; // tela sem widget

  // 1) usa o cache se ainda for recente
  try {
    const cache = JSON.parse(localStorage.getItem('clima-cache'));
    if (cache && Date.now() - cache.hora < CLIMA_CACHE_MIN * 60000) {
      mostrarClima(cache.dados);
      return;
    }
  } catch (_) {}

  // 2) busca na API
  try {
    const { lat, lon } = await obterPosicao();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const resp = await fetch(url);
    const json = await resp.json();

    const dados = { temp: json.current.temperature_2m, codigo: json.current.weather_code };
    localStorage.setItem('clima-cache', JSON.stringify({ hora: Date.now(), dados }));
    mostrarClima(dados);
  } catch (erro) {
    const d = document.getElementById('clima-desc');
    if (d) d.textContent = 'Clima indisponível';
  }
}

document.addEventListener('DOMContentLoaded', carregarClima);

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