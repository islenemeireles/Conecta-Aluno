// Páginas do menu: Bolsas e Vagas, Universidade mais sustentável e Professores.
// Os dados de bolsas, vagas e cursos ESG são FICTÍCIOS (exemplos para a demonstração).
(function () {
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  const uni = () => UNIS[document.documentElement.dataset.uni] || UNIS.uece;
  const mail = () => { try { return (sessionStorage.getItem('ca_user') || '').toLowerCase(); } catch (e) { return ''; } };
  const ler = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const aviso = t => el('p', 'aviso-f', t);

  function filtros(opcoes, atual, aoMudar) {
    const f = el('div', 'fil');
    opcoes.forEach(o => {
      const b = el('button', o === atual ? 'on' : '', o);
      b.type = 'button';
      b.onclick = () => aoMudar(o);
      f.append(b);
    });
    return f;
  }

  function alternar(chave, id, btn, on, off) {
    const ids = ler(chave), tem = ids.includes(id);
    gravar(chave, tem ? ids.filter(i => i !== id) : ids.concat(id));
    btn.classList.toggle('on', !tem);
    btn.textContent = tem ? off : on;
  }

  // ---------- Bolsas e Vagas ----------
  const VAGAS = [
    ['b1', 'Bolsa', 'Iniciação Científica (PIBIC)', 'Pró-reitoria de pesquisa', 'R$ 700/mês', '15/12/2026', 'Estar entre o 3º e o 8º semestre e ter um professor orientador.'],
    ['b2', 'Bolsa', 'Bolsa de Extensão: Educação Ambiental', 'Pró-reitoria de extensão', 'R$ 600/mês', '10/12/2026', 'Disponibilidade de 12 horas semanais.'],
    ['b3', 'Monitoria', 'Monitoria de Administração Financeira', 'Curso de Administração', 'Bolsa de monitoria', '05/12/2026', 'Aprovação na disciplina com nota mínima 8,0.'],
    ['b4', 'Estágio', 'Estágio em Recursos Humanos', 'Empresa Exemplo Ltda.', 'R$ 1.200/mês + auxílio transporte', '20/12/2026', 'Cursando Administração a partir do 5º semestre.'],
    ['b5', 'Estágio', 'Estágio em Marketing Digital', 'Agência Horizonte (fictícia)', 'R$ 1.000/mês', '18/12/2026', 'Familiaridade com redes sociais e criação de conteúdo.'],
    ['b6', 'Vaga', 'Assistente administrativo (trainee)', 'Grupo Litoral (fictício)', 'R$ 2.400/mês', '30/12/2026', 'Graduação em andamento ou concluída.'],
    ['b7', 'Bolsa', 'Auxílio Permanência Estudantil', 'Assistência estudantil', 'R$ 450/mês', '12/01/2027', 'Critério de renda definido em edital (exemplo).'],
    ['b8', 'Vaga', 'Pesquisador voluntário em Gestão de Projetos', 'Laboratório de inovação', 'Voluntário, com certificado', '22/12/2026', 'Interesse em pesquisa e escrita acadêmica.']
  ];

  const TIPOS = ['Todas', 'Bolsa', 'Monitoria', 'Estágio', 'Vaga', 'Salvas'];

  function bolsas(c, tipo, q) {
    tipo = tipo || 'Todas';
    q = q || '';

    c.replaceChildren(aviso('Dados fictícios, só para a demonstração. Na versão real, cada oportunidade leva ao edital oficial.'));

    const busca = el('input', 'pbusca');
    busca.type = 'search';
    busca.placeholder = 'Buscar por título ou organização';
    busca.value = q;
    busca.setAttribute('aria-label', 'Buscar bolsas e vagas');

    busca.oninput = () => {
      const p = busca.selectionStart;
      bolsas(c, tipo, busca.value);
      const n = c.querySelector('.pbusca');
      n.focus();
      n.setSelectionRange(p, p);
    };

    const chave = 'ca_vagas_' + mail(), salvas = ler(chave);

    c.append(busca, filtros(TIPOS, tipo, t => bolsas(c, t, q)));

    const lista = VAGAS.filter(v =>
      (tipo === 'Todas' || (tipo === 'Salvas' ? salvas.includes(v[0]) : v[1] === tipo)) &&
      (v[2] + ' ' + v[3]).toLowerCase().includes(q.toLowerCase())
    );

    if (!lista.length) c.append(el('p', '', 'Nenhuma oportunidade encontrada.'));

    lista.forEach(v => {
      const it = el('article', 'item'), tg = el('span', 'tg', v[1]);
      const h = el('h3', '', v[2]);
      h.prepend(tg);

      const det = el('details');
      det.append(el('summary', '', 'Ver requisitos'), el('p', '', v[6]));

      const a = el('div', 'acao');
      const bs = el('button', salvas.includes(v[0]) ? 'on' : '', salvas.includes(v[0]) ? '📌 Salva' : '🔖 Salvar');
      bs.type = 'button';
      bs.onclick = () => alternar(chave, v[0], bs, '📌 Salva', '🔖 Salvar');

      a.append(bs);
      it.append(h, el('div', 'meta', v[3] + ' • ' + v[4] + ' • Inscrições até ' + v[5]), det, a);
      c.append(it);
    });
  }

  // ---------- Universidade mais sustentável (cursos de ESG) ----------
  const ESG = [
    ['e1', 'E', 'Introdução a ESG e Sustentabilidade', '20 h', 'EaD', 'Conceitos, indicadores e o papel das instituições.'],
    ['e2', 'E', 'Gestão de Resíduos no Campus', '30 h', 'Presencial', 'Coleta seletiva, compostagem e redução de desperdício.'],
    ['e3', 'E', 'Energia Solar e Eficiência Energética', '40 h', 'Híbrido', 'Fundamentos de geração solar e economia de energia.'],
    ['e4', 'S', 'Diversidade e Inclusão nas Organizações', '20 h', 'EaD', 'Práticas de equidade, acessibilidade e combate ao assédio.'],
    ['e5', 'S', 'Voluntariado e Impacto Social', '30 h', 'Presencial', 'Planejamento de projetos sociais com a comunidade.'],
    ['e6', 'G', 'Ética, Compliance e Governança', '30 h', 'EaD', 'Integridade, transparência e prestação de contas.'],
    ['e7', 'G', 'Relatórios de Sustentabilidade', '30 h', 'EaD', 'Como medir, relatar e comunicar resultados ESG.']
  ];

  const AREAS = { E: 'Ambiental', S: 'Social', G: 'Governança' };

  function esg(c, f) {
    f = f || 'Todos';

    c.replaceChildren(aviso('Cursos fictícios, só para a demonstração. As inscrições reais dependerão das ações da universidade.'));

    c.append(el('p', '', 'ESG reúne três dimensões: Ambiental (E), Social (S) e Governança (G). Escolha uma área e registre seu interesse.'));

    c.append(filtros(['Todos', 'Ambiental', 'Social', 'Governança', 'Meus interesses'], f, x => esg(c, x)));

    const chave = 'ca_esg_' + mail(), meus = ler(chave), g = el('div', 'grid2');

    ESG.filter(e =>
      f === 'Todos' ||
      (f === 'Meus interesses' ? meus.includes(e[0]) : AREAS[e[1]] === f)
    ).forEach(e => {
      const it = el('article', 'item'), h = el('h3', '', e[2]);
      h.prepend(el('span', 'tg', AREAS[e[1]]));

      const b = el('button', meus.includes(e[0]) ? 'on' : '', meus.includes(e[0]) ? '✔ Tenho interesse' : '＋ Tenho interesse');
      b.type = 'button';
      b.onclick = () => alternar(chave, e[0], b, '✔ Tenho interesse', '＋ Tenho interesse');

      const a = el('div', 'acao');
      a.append(b);

      it.append(h, el('div', 'meta', e[3] + ' • ' + e[4]), el('p', '', e[5]), a);
      g.append(it);
    });

    c.append(g);
  }

  // ---------- Professores (UECE) ----------

  // Links oficiais para consulta do corpo docente em cada centro/faculdade.
  // No CESA, os links são separados por curso para direcionar à página correta.

  const UNIDADES = [
    ['CESA', 'Centro de Estudos Sociais Aplicados', 'Administração, Ciências Contábeis e Serviço Social', [
      ['Serviço Social', 'https://www.uece.br/cesa/servico-social/sobre-o-curso-de-servico-social/corpo-docente/'],
      ['Ciências Contábeis', 'https://www.uece.br/cesa/ciencias-contabeis/sobre-o-curso-de-ciencias-contabeis/corpo-docente/'],
      ['Administração', 'https://www.uece.br/cesa/curso-de-administracao/sobre-o-curso-de-administracao/corpo-docente/']
    ]],
    ['CH', 'Centro de Humanidades', 'Ciências Sociais, História, Música, Psicologia, Filosofia e Letras', [
      ['Música', 'https://www.uece.br/ch/musica/sobre-o-curso-de-musica/corpo-docente/']
    ]],
    ['CED', 'Centro de Educação', 'Pedagogia', [
      ['Consultar docentes', 'https://www.uece.br/quem-e-quem/menu/centros/']
    ]],
    ['CCS', 'Centro de Ciências da Saúde', '', [
      ['Enfermagem', 'https://www.uece.br/ccs/cursos/graduacao/curso-de-graduacao-em-enfermagem/conheca-o-curso/docentes/']
    ]],
    ['CCT', 'Centro de Ciências e Tecnologia', '', [
      ['Ciências da Computação', 'https://www.uece.br/cct/ciencias-da-computacao/conheca-o-curso/corpo-docente/']
    ]],
    ['FAVET', 'Faculdade de Veterinária', '', [
      ['Medicina Veterinária', 'https://www.uece.br/favet/cursos/graduacao/curso-de-medicina-veterinaria/conheca-o-curso/docentes/']
    ]],
    ['FAFIDAM', 'Faculdade de Filosofia Dom Aureliano Matos (Limoeiro do Norte)', 'Matemática e Pedagogia, entre outros', [
      ['Pedagogia', 'https://www.uece.br/fafidam/category/institucional/pedagogia/']
    ]]
  ];

  const PPGA = [
    ['Ana Augusta Ferreira de Freitas', 'Pós-doutorado em Administração (FGV, 2011)'],
    ['Ana Silvia Rocha Ipiranga', 'Pós-doutorado em Administração (FGV, 2010)'],
    ['Elda Fontinele Tahim', 'Doutorado em Administração de Empresas (FGV, 2016)'],
    ['Felipe Gerhard Paula Sousa', 'Doutorado em Administração (UECE, 2019)'],
    ['Felipe Roberto da Silva', 'Doutorado em Administração (UECE, 2023)'],
    ['Márcio de Oliveira Mota', 'Pós-doutorado em Administração (FGV, 2016)']
  ];

  const buscaUece = t => 'https://www.google.com/search?q=' + encodeURIComponent('site:uece.br corpo docente ' + t);

  function professores(c, q) {
    q = q || '';

    c.replaceChildren(aviso('A UECE não tem uma lista única de todos os docentes: cada curso e programa publica a sua. Por isso, cada botão abaixo busca a página de docentes direto no site da UECE.'));

    const f = el('form'), busca = el('input', 'pbusca');
    busca.type = 'search';
    busca.placeholder = 'Nome do professor, curso ou centro (Enter para buscar no site da UECE)';
    busca.setAttribute('aria-label', 'Buscar professor');
    busca.value = q;

    f.append(busca);

    f.onsubmit = e => {
      e.preventDefault();
      window.open(buscaUece(busca.value.trim()), '_blank', 'noopener');
    };

    busca.oninput = () => {
      const p = busca.selectionStart;
      professores(c, busca.value);
      const n = c.querySelector('.pbusca');
      n.focus();
      n.setSelectionRange(p, p);
    };

    c.append(f, el('h3', '', 'Centros e faculdades'));

    const g = el('div', 'grid2');

    UNIDADES.filter(u =>
      (u[0] + u[1] + u[2] + u[3].map(link => link[0]).join(' ')).toLowerCase().includes(q.toLowerCase())
    ).forEach(u => {
      const it = el('article', 'item');

      it.append(el('h3', '', u[0] + ' — ' + u[1]));

      if (u[2]) it.append(el('div', 'meta', u[2]));

      const a = el('div', 'acao');

      u[3].forEach(link => {
        const l = el('a', 'btn-link');
        l.href = link[1];
        l.target = '_blank';
        l.rel = 'noopener';
        l.textContent = '👨‍🏫 Buscar docentes — ' + link[0] + ' ↗';
        a.append(l);
      });

      it.append(a);
      g.append(it);
    });

    c.append(g, el('h3', '', 'Exemplo: Programa de Pós-Graduação em Administração (PPGA)'));

    c.append(el('p', 'meta', 'Corpo docente permanente. Fonte: página do programa em uece.br/ppga. Confira a página oficial para a lista completa e atualizada.'));

    const g2 = el('div', 'grid2');

    PPGA.filter(p => (p[0] + p[1]).toLowerCase().includes(q.toLowerCase())).forEach(p => {
      const it = el('article', 'item');
      it.append(el('h3', '', p[0]), el('div', 'meta', p[1]));
      g2.append(it);
    });

    const l = el('a');
    l.href = 'https://www.uece.br/ppga/instituicional/corpo-docente';
    l.target = '_blank';
    l.rel = 'noopener';
    l.textContent = 'Ver a página oficial do PPGA ↗';

    c.append(g2, l);
  }

  // ---------- Biblioteca (link oficial de cada universidade) ----------
  function biblioteca(c) {
    const b = uni().biblioteca;
    c.replaceChildren();

    if (!b) {
      c.textContent = 'O link da biblioteca desta universidade ainda não foi cadastrado.';
      return;
    }

    const it = el('article', 'item');

    it.append(
      el('h3', '', '📚 ' + b.nome),
      el('p', '', 'Consulte o acervo, renovações, empréstimos e serviços no site oficial. Você será levado para fora do Conecta Aluno.')
    );

    const a = el('a', 'btn-link');
    a.href = b.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Acessar a biblioteca ↗';

    it.append(a);
    c.append(it);
  }

  window.PAGINAS = {
    'Biblioteca': biblioteca,
    'Bolsas e Vagas': c => bolsas(c),
    'Universidade mais sustentável': c => esg(c),
    'Professores': c => professores(c)
  };
})();