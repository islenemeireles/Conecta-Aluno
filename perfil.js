// Perfil editável: nome, foto, capa (cor ou foto), sobre mim e áreas de interesse. Salvo no navegador.
(function () {
  const $ = id => document.getElementById(id);
  const em = () => { try { return (sessionStorage.getItem('ca_user') || '').toLowerCase(); } catch (e) { return ''; } };
  const key = () => 'ca_perfil_' + em();
  const ler = () => { try { return JSON.parse(localStorage.getItem(key())) || {}; } catch (e) { return {}; } };
  const base = () => (UNIS[document.documentElement.dataset.uni] || UNIS.uece).perfil;
  let draft = null;

  function efetivo() {
    const s = ler(), p = base();
    return { nome: s.nome || nomeDe(em()), foto: s.foto || '', capaTipo: s.capaTipo || 'padrao', capaCor: s.capaCor || '#8b3fdc',
             capaFoto: s.capaFoto || '', bio: s.bio || p.bio, interesses: s.interesses || p.interesses.slice() };
  }
  function aplicar() {
    const e = efetivo();
    document.querySelectorAll('.nome').forEach(n => { n.textContent = e.nome; });
    document.querySelectorAll('.me .av,.p-av').forEach(a => { a.style.backgroundImage = e.foto ? 'url("' + e.foto + '")' : ''; a.textContent = e.foto ? '' : '🧑‍🦱'; });
    const capa = document.querySelector('.capa');
    capa.style.background = e.capaTipo === 'cor' ? e.capaCor : (e.capaTipo === 'foto' && e.capaFoto ? 'url("' + e.capaFoto + '") center/cover' : '');
    $('bioTxt').textContent = e.bio;
    $('pInt').replaceChildren(...e.interesses.map(t => { const s = document.createElement('span'); s.textContent = t; return s; }));
  }

  const setRadio = v => document.querySelectorAll('input[name=capaTipo]').forEach(r => { r.checked = r.value === v; });
  function chips() {
    $('edInt').replaceChildren(...draft.interesses.map((t, i) => {
      const s = document.createElement('span'); s.textContent = t;
      const b = document.createElement('button'); b.type = 'button'; b.textContent = '×'; b.setAttribute('aria-label', 'Remover ' + t);
      b.onclick = () => { draft.interesses.splice(i, 1); chips(); };
      s.append(b); return s;
    }));
  }
  function reduzir(arq, max, cb) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.82));
      };
      im.src = r.result;
    };
    r.readAsDataURL(arq);
  }

  $('editBio').onclick = () => {
    draft = efetivo();
    $('edNome').value = draft.nome; $('edBio').value = draft.bio; $('edCapaCor').value = draft.capaCor;
    $('edFotoOk').textContent = draft.foto ? 'Foto atual mantida' : ''; setRadio(draft.capaTipo); chips();
    $('pEdit').hidden = false; $('pEdit').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  $('edCancelar').onclick = () => { $('pEdit').hidden = true; };
  $('edFoto').onchange = e => { const f = e.target.files[0]; if (f) reduzir(f, 320, d => { draft.foto = d; $('edFotoOk').textContent = '✔ Nova foto escolhida'; }); };
  $('edFotoRm').onclick = () => { draft.foto = ''; $('edFotoOk').textContent = 'Foto removida (salve para confirmar)'; };
  $('edCapaFoto').onchange = e => { const f = e.target.files[0]; if (f) reduzir(f, 1400, d => { draft.capaFoto = d; draft.capaTipo = 'foto'; setRadio('foto'); }); };
  $('edCapaCor').oninput = e => { draft.capaCor = e.target.value; draft.capaTipo = 'cor'; setRadio('cor'); };
  document.querySelectorAll('input[name=capaTipo]').forEach(r => { r.onchange = () => { draft.capaTipo = r.value; }; });
  $('edIntNovo').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const v = e.target.value.trim().slice(0, 30);
    if (v && draft.interesses.length < 12 && !draft.interesses.includes(v)) { draft.interesses.push(v); chips(); }
    e.target.value = '';
  });
  $('edSalvar').onclick = () => {
    draft.nome = $('edNome').value.trim().slice(0, 40) || nomeDe(em());
    draft.bio = $('edBio').value.trim().slice(0, 300) || base().bio;
    try { localStorage.setItem(key(), JSON.stringify(draft)); }
    catch (x) { alert('Não foi possível salvar: a imagem é grande demais para este navegador. Tente uma foto menor.'); return; }
    aplicar(); $('pEdit').hidden = true;
  };

  document.addEventListener('ca:entrou', () => setTimeout(aplicar, 0));
  document.addEventListener('ca:saiu', () => { $('pEdit').hidden = true; });
  if ($('login').classList.contains('hide')) aplicar();
})();