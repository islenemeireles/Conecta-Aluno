// Extras do Conecta Aluno: menu no celular, navegação, notificações, busca e validação do login.
// Carregue DEPOIS do script.js e do mural.js.
(function () {
  const $ = id => document.getElementById(id);
  const uni = () => UNIS[document.documentElement.dataset.uni] || UNIS.uece;

  // ---------- Menu lateral no celular ----------
  const btnMenu = $('menuBtn');
  function menu(on) {
    document.body.classList.toggle('menu-aberto', on);
    btnMenu.setAttribute('aria-expanded', String(on));
    btnMenu.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu');
  }
  btnMenu.onclick = () => menu(!document.body.classList.contains('menu-aberto'));
  $('menuFechar').onclick = () => { menu(false); btnMenu.focus(); };
  $('menuFundo').onclick = () => menu(false);
  document.querySelectorAll('.left a').forEach(a => a.addEventListener('click', () => menu(false)));
  matchMedia('(min-width:781px)').addEventListener('change', e => { if (e.matches) menu(false); });

  // ---------- Navegação ----------
  const mostrarOrig = window.mostrar;
  window.mostrar = function (v) { $('viewPagina').hidden = true; mostrarOrig(v); menu(false); fecharNotif(); };

  const DESC = {
    'Disciplinas': 'ver suas disciplinas, horários e professores',
    'Professores': 'encontrar professores, áreas de atuação e formas de contato',
    'Linhas de Pesquisa': 'conhecer as linhas de pesquisa e os grupos da universidade',
    'Pós-Graduação': 'descobrir programas de mestrado e doutorado',
    'Bolsas e Vagas': 'encontrar bolsas, estágios e vagas validadas pela equipe',
    'Comunidades': 'participar de comunidades por curso e interesse',
    'Amigos': 'encontrar colegas e acompanhar quem você segue',
    'Mensagens': 'conversar com colegas e professores',
    'Biblioteca': 'consultar o acervo e reservar livros',
    'Serviços': 'acessar os serviços e setores da universidade',
    'Mais opções': 'acessar outros serviços do portal',
    'Sobre': 'conhecer o Conecta Aluno e a equipe',
    'Privacidade': 'ler como seus dados são tratados (LGPD)',
    'Termos': 'ler os termos de uso da plataforma',
    'Universidade mais sustentável': 'conhecer e apoiar as iniciativas ambientais do campus'
  };
  const ALIAS = { 'minhas disciplinas': 'Disciplinas', 'professores e pesquisa': 'Professores', 'bolsas e vagas': 'Bolsas e Vagas', 'mais': 'Mais opções' };
  const rotulo = a => a.textContent.replace(/^[^\p{L}]+/u, '').replace(/\s*→\s*$/, '').trim();

  function pagina(titulo) {
    $('pgTitulo').textContent = titulo;
    const c = $('pgCorpo');
    c.replaceChildren();
    if (titulo === 'Eventos') {
      uni().eventos.forEach(ev => {
        const linha = document.createElement('div'); linha.className = 'ev';
        const d = document.createElement('div'); d.className = 'date';
        const m = document.createElement('small'); m.textContent = ev.m;
        d.append(m, String(ev.d));
        const t = document.createElement('div');
        const b = document.createElement('b'); b.textContent = ev.t;
        const s = document.createElement('span'); s.textContent = '📍 ' + ev.l;
        t.append(b, s); linha.append(d, t); c.append(linha);
      });
    } else if (window.PAGINAS && PAGINAS[titulo]) {
      PAGINAS[titulo](c);
    } else {
      c.textContent = 'Esta seção ainda está em construção. Em breve você poderá ' + (DESC[titulo] || 'acessar este serviço') + '.';
    }
    document.querySelectorAll('main[id^="view"]').forEach(m => { m.hidden = m.id !== 'viewPagina'; });
    document.querySelectorAll('nav [data-view]').forEach(a => a.classList.remove('on'));
    menu(false); fecharNotif(); window.scrollTo(0, 0);
  }
  $('pgVoltar').onclick = () => mostrar('inicio');

  document.querySelectorAll('.left nav a:not([data-view]),.short a,.eco a,footer nav a:not([data-aval]),.sec-h a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      let t = rotulo(a); const l = t.toLowerCase();
      if (l.includes('professores')) t = 'Professores';
      else if (l.startsWith('saiba mais')) t = 'Universidade mais sustentável';
      else if (l.startsWith('ver todos') || l.startsWith('eventos')) t = 'Eventos';
      else if (l === 'contato') { mostrar('ajuda'); return; }
      else if (ALIAS[l]) t = ALIAS[l];
      pagina(t);
    });
  });
  document.querySelector('button[aria-label="Mensagens"]').addEventListener('click', () => pagina('Mensagens'));
  document.querySelector('a.logo').addEventListener('click', e => { e.preventDefault(); mostrar('inicio'); });
  document.querySelectorAll('.me .av').forEach(a => {
    a.setAttribute('role', 'button'); a.tabIndex = 0;
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a.click(); } });
  });

  // ---------- Notificações ----------
  const sino = document.querySelector('button[aria-label="Notificações"]'), painel = $('notif');
  const badge = sino.querySelector('em');
  sino.setAttribute('aria-haspopup', 'true'); sino.setAttribute('aria-expanded', 'false');
  try { if (localStorage.getItem('ca_notif_vista')) badge.hidden = true; } catch (e) {}
  function fecharNotif() { painel.hidden = true; sino.setAttribute('aria-expanded', 'false'); }
  sino.addEventListener('click', e => {
    e.stopPropagation();
    if (!painel.hidden) { fecharNotif(); return; }
    const ev = uni().eventos[0], ul = $('notifLista');
    ul.replaceChildren();
    [['🎓', 'Bem-vindo ao Conecta Aluno!', 'Explore o mural, o mapa e a Ajuda.'], ['📅', 'Lembrete de evento', ev.t + ' • ' + ev.d + ' ' + ev.m]].forEach(n => {
      const li = document.createElement('li'), t = document.createElement('div');
      const b = document.createElement('b'); b.textContent = n[1];
      const s = document.createElement('span'); s.textContent = n[2];
      t.append(b, s); li.append(n[0], t); ul.append(li);
    });
    painel.hidden = false; sino.setAttribute('aria-expanded', 'true');
    badge.hidden = true;
    try { localStorage.setItem('ca_notif_vista', '1'); } catch (x) {}
  });
  document.addEventListener('click', e => { if (!painel.hidden && !painel.contains(e.target)) fecharNotif(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { menu(false); fecharNotif(); } });
  document.addEventListener('ca:saiu', () => { menu(false); fecharNotif(); });

  // ---------- Busca (filtra o mural) ----------
  const busca = document.querySelector('.search input');
  busca.addEventListener('input', () => {
    if (busca.value.trim()) mostrar('inicio');
    document.dispatchEvent(new CustomEvent('ca:busca', { detail: busca.value.trim() }));
  });
  busca.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); mostrar('inicio'); } });

  // ---------- Login: validação e links ----------
  document.addEventListener('submit', e => {
    if (e.target.id !== 'lf') return;
    const em = $('em').value.trim(), pw = $('pw').value, err = $('err');
    err.className = 'err';
    if (!/^\S+@\S+\.\S+$/.test(em)) { e.preventDefault(); e.stopImmediatePropagation(); err.textContent = 'Digite um e-mail válido para continuar.'; return; }
    if (pw.length < 6) { e.preventDefault(); e.stopImmediatePropagation(); err.textContent = 'Use uma senha com pelo menos 6 caracteres.'; }
  }, true);
  function info(texto) { const err = $('err'); err.className = 'err info'; err.textContent = texto; }
  $('lEsqueci').addEventListener('click', e => { e.preventDefault(); info('Na versão final, você receberá um link para redefinir a senha no seu e-mail.'); });
  $('lCriar').addEventListener('click', e => { e.preventDefault(); info('Nesta demonstração, basta entrar com um e-mail válido e uma senha de 6 ou mais caracteres.'); });
})();

// ---------- Avaliação do site (estrelas) ----------
(function () {
  const $ = id => document.getElementById(id), K = 'ca_avaliacoes';
  const ler = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch (e) { return []; } };
  const mail = () => { try { return (sessionStorage.getItem('ca_user') || '').toLowerCase(); } catch (e) { return ''; } };
  let nota = 0; const box = $('stars');
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = '★'; b.setAttribute('role', 'radio');
    b.setAttribute('aria-label', i + (i === 1 ? ' estrela' : ' estrelas')); b.dataset.n = i;
    b.onclick = () => { nota = i; pintar(); }; b.onmouseenter = () => pintar(i); b.onmouseleave = () => pintar(); box.append(b);
  }
  function pintar(h) { const v = h || nota; box.querySelectorAll('button').forEach(b => { b.classList.toggle('on', +b.dataset.n <= v); b.setAttribute('aria-checked', String(+b.dataset.n === nota)); }); }
  function media() {
    const l = ler();
    $('avalMedia').textContent = l.length ? 'Média ' + (l.reduce((s, a) => s + a.nota, 0) / l.length).toFixed(1).replace('.', ',') + ' de 5 (' + l.length + (l.length === 1 ? ' avaliação' : ' avaliações') + ' neste navegador)' : 'Seja a primeira pessoa a avaliar.';
  }
  function carregar() { const m = ler().find(a => a.email === mail()); nota = m ? m.nota : 0; $('avalTxt').value = m ? m.txt : ''; pintar(); media(); $('avalOk').hidden = true; }
  $('avalEnviar').onclick = () => {
    const ok = $('avalOk');
    if (!nota) { ok.textContent = 'Escolha de 1 a 5 estrelas.'; ok.hidden = false; return; }
    const l = ler().filter(a => a.email !== mail()); l.push({ email: mail(), nota, txt: $('avalTxt').value.trim(), data: Date.now() });
    try { localStorage.setItem(K, JSON.stringify(l)); } catch (e) {}
    ok.textContent = 'Obrigado pela avaliação de ' + nota + (nota === 1 ? ' estrela!' : ' estrelas!'); ok.hidden = false; media();
  };
  document.addEventListener('ca:entrou', carregar);
  document.querySelector('[data-aval]').addEventListener('click', e => { e.preventDefault(); mostrar('ajuda'); $('avalCard').scrollIntoView({ behavior: 'smooth' }); });
  carregar();
})();