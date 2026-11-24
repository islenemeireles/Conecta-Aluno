// Mural da comunidade (demonstração): os dados ficam no navegador (localStorage).
(function () {
  const $ = s => document.querySelector(s);
  const storage = {
    get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { alert('Não foi possível salvar os dados neste navegador.'); } }
  };
  let email = '', filtro = 'all', busca = '';

  const nomeAtual = () => ((document.querySelector('.nome') || {}).textContent || 'Estudante').slice(0, 60);
  const uniAtual = () => document.documentElement.dataset.uni || 'uece';
  const key = tipo => 'ca_demo_' + tipo + '_' + email.toLowerCase();
  const getPosts = () => storage.get('ca_demo_mural_posts', []);
  const setPosts = p => storage.set('ca_demo_mural_posts', p);
  const getIds = tipo => storage.get(key(tipo), []);
  const setIds = (tipo, ids) => storage.set(key(tipo), ids);

  // Total de curtidas de uma publicação (soma entre as pessoas que usaram este navegador).
  function totalCurtidas(id) {
    let n = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf('ca_demo_curtidas_') === 0) {
        try { if ((JSON.parse(localStorage.getItem(k)) || []).includes(id)) n++; } catch (e) {}
      }
    }
    return n;
  }

  // Publicações de exemplo para a apresentação.
  if (!Array.isArray(storage.get('ca_demo_mural_posts', null))) {
    setPosts([
      { id: 'exemplo1', nome: 'Marina Costa', email: 'marina@exemplo.com', texto: 'Pessoal, alguém sabe quando sai o próximo edital de bolsas? Vamos compartilhar as oportunidades por aqui! 🎓', data: Date.now() - 3600000 },
      { id: 'exemplo2', nome: 'Pedro Henrique', email: 'pedro@exemplo.com', texto: 'Estou organizando um grupo de estudos para as disciplinas deste semestre. Quem tiver interesse, vamos conversar! 📚', data: Date.now() - 1800000 }
    ]);
  }

  const texto = $('#demoTexto');
  texto.addEventListener('input', () => { $('#demoContador').textContent = texto.value.length + '/1000'; });

  $('#demoForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!email) { $('#demoAviso').textContent = 'Entre no site para publicar.'; return; }
    const conteudo = texto.value.trim();
    if (!conteudo) return;
    const posts = getPosts();
    posts.push({ id: 'p' + Date.now() + Math.random().toString(16).slice(2), nome: nomeAtual(), email, uni: uniAtual(), texto: conteudo, data: Date.now() });
    setPosts(posts);
    texto.value = '';
    $('#demoContador').textContent = '0/1000';
    $('#demoAviso').textContent = 'Publicação criada!';
    filtro = 'all';
    atualizarFiltros();
    render();
  });

  function atualizarFiltros() {
    document.querySelectorAll('#demoMural [data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === filtro));
  }
  document.querySelectorAll('#demoMural [data-filter]').forEach(b => b.addEventListener('click', () => { filtro = b.dataset.filter; atualizarFiltros(); render(); }));

  function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }

  function render() {
    const lista = $('#demoLista');
    lista.replaceChildren();
    const uni = uniAtual();
    let posts = getPosts().filter(p => !p.uni || p.uni === uni).sort((a, b) => b.data - a.data);
    if (filtro === 'saved') { const fav = getIds('favoritos'); posts = posts.filter(p => fav.includes(p.id)); }
    if (busca) posts = posts.filter(p => (p.texto + ' ' + p.nome).toLowerCase().includes(busca));

    if (!posts.length) {
      lista.append(el('div', 'card demo-empty',
        busca ? 'Nenhuma publicação encontrada para "' + busca + '".' :
        filtro === 'saved' ? 'Você ainda não favoritou nenhuma publicação.' : 'O mural está vazio. Faça a primeira publicação!'));
      return;
    }
    const curtidas = getIds('curtidas'), favoritos = getIds('favoritos');
    posts.forEach(post => {
      const card = el('article', 'card demo-post');
      const cab = el('div', 'demo-post-head');
      const dados = el('div');
      dados.append(el('div', 'demo-author', post.nome),
        el('div', 'demo-date', new Date(post.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })));
      cab.append(el('div', 'demo-avatar', (post.nome || 'A').charAt(0).toUpperCase()), dados);

      const acoes = el('div', 'demo-actions');
      const curtiu = curtidas.includes(post.id);
      const bc = el('button', '', (curtiu ? '❤️' : '🤍') + ' Curtir (' + totalCurtidas(post.id) + ')');
      bc.type = 'button'; bc.setAttribute('aria-pressed', String(curtiu));
      bc.onclick = () => { const ids = getIds('curtidas'); setIds('curtidas', ids.includes(post.id) ? ids.filter(i => i !== post.id) : ids.concat(post.id)); render(); };
      const salvo = favoritos.includes(post.id);
      const bs = el('button', '', salvo ? '🔖 Salvo' : '☆ Favoritar');
      bs.type = 'button'; bs.setAttribute('aria-pressed', String(salvo));
      bs.onclick = () => { const ids = getIds('favoritos'); setIds('favoritos', ids.includes(post.id) ? ids.filter(i => i !== post.id) : ids.concat(post.id)); render(); };
      acoes.append(bc, bs);
      if (!(email && post.email === email)) {
        const jaDen = getIds('denunciadas').includes(post.id);
        const bd = el('button', '', jaDen ? '🚩 Denunciada' : '🚩 Denunciar'); bd.type = 'button'; bd.disabled = jaDen;
        bd.onclick = () => abrirDenuncia(post);
        acoes.append(bd);
      }

      if (email && post.email === email) {
        const be = el('button', '', '🗑️ Excluir'); be.type = 'button';
        be.onclick = () => { if (!confirm('Deseja excluir esta publicação?')) return; setPosts(getPosts().filter(p => p.id !== post.id)); render(); };
        acoes.append(be);
      }
      card.append(cab, el('p', 'demo-content', post.texto), acoes);
      lista.append(card);
    });
  }

  // ---------- Denúncia de publicações (demonstração: fica salva no navegador) ----------
  let alvo = null;
  const dlg = $('#repDlg');
  function abrirDenuncia(post) {
    alvo = post; $('#repTrecho').textContent = '“' + post.texto.slice(0, 120) + (post.texto.length > 120 ? '…' : '') + '”';
    $('#repDet').value = ''; dlg.showModal();
  }
  $('#repCancel').onclick = () => dlg.close();
  $('#repForm').addEventListener('submit', () => {
    if (!alvo) return;
    const lista = storage.get('ca_demo_denuncias', []);
    lista.push({ id: 'd' + Date.now(), postId: alvo.id, motivo: $('#repMotivo').value, detalhe: $('#repDet').value.trim(), por: email, data: Date.now() });
    storage.set('ca_demo_denuncias', lista);
    setIds('denunciadas', getIds('denunciadas').concat(alvo.id));
    $('#demoAviso').textContent = 'Denúncia enviada. Obrigado por ajudar a manter o mural seguro.';
    alvo = null; render();
  });

  function sessao() { try { return sessionStorage.getItem('ca_user') || ''; } catch (e) { return ''; } }
  document.addEventListener('ca:entrou', () => { email = sessao().trim().toLowerCase(); render(); });
  document.addEventListener('ca:saiu', () => { email = ''; filtro = 'all'; busca = ''; atualizarFiltros(); render(); });
  document.addEventListener('ca:busca', e => { busca = (e.detail || '').toLowerCase(); render(); });
  if ($('#login').classList.contains('hide')) email = sessao().trim().toLowerCase();
  render();
})();