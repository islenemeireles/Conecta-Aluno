// Configuração de cada universidade. Os dados da UFC e da Unifor são EXEMPLOS fictícios (exceto nomes, domínios e links oficiais).
// Para adicionar outra universidade: copie um bloco, informe os domínios de e-mail e crie as cores em extras.css.
// EMAIL_LIVRE = true  -> e-mails de outros domínios entram como UECE (útil para testes).
// EMAIL_LIVRE = false -> só entram e-mails institucionais das universidades abaixo.
const EMAIL_LIVRE = false;
const UNIS = {
  uece: {
    dominios: ['uece.br'],
    foto: 'foto-uece.jpg', // foto do topo (mesma pasta do index.html); troque o nome se a extensão for outra
    biblioteca: { nome: 'Bibliotecas da UECE', url: 'https://siduece.uece.br/siduece/' },
    sigla: 'UECE', assistente: 'Francis',
    slogan: 'Sua jornada na UECE, mais conectada',
    curso: 'Administração - UECE',
    quote: '“Mais conhecimento, mais possibilidades.”',
    signNome: 'UNIVERSIDADE ESTADUAL DO CEARÁ', campus: 'Campus do Itaperi',
    mapaEmbed: 'https://www.google.com/maps?q=Universidade+Estadual+do+Cear%C3%A1+Campus+do+Itaperi&output=embed',
    mapaLink: 'https://www.google.com/maps/search/?api=1&query=Universidade+Estadual+do+Cear%C3%A1+Campus+do+Itaperi',
    mapaTitulo: 'Mapa da UECE - Campus do Itaperi', lago: 'Lagoa do Itaperi',
    areas: ['🏛️ Reitoria', '📗 Biblioteca Central', '🟥 CESA', '🟧 CCSA', '🟦 CCBS', '🟪 FAEC'],
    eventos: [
      { m: 'FEV/27', d: 1, t: 'International Summer School on AI Engineering (AIEng 2027)', l: 'Campus Itaperi' },
      { m: 'NOV', d: 5, t: 'Feira do Conhecimento 2026 (FdCX)', l: 'Centro de Eventos do Ceará' },
      { m: 'OUT', d: 19, t: 'Semana Universitária UECE', l: 'Campus Itaperi' }
    ],
    p1a: 'Lia Rodrigues', p1m: 'Pós-Graduação em Administração - UECE • 2 h',
    p1t: 'Saiu o edital de bolsas de iniciação científica!<br>Ótima oportunidade para quem quer se aproximar da pesquisa. ✨<br>Link no site da UECE.',
    p2a: 'Grupo de Estudos - Trabalho e Sociedade', p2m: 'Comunidade • 5 h',
    p2t: 'Nosso próximo encontro será na terça (16/09), às 14h, no CESA.<br>Tema: “Trabalho, tecnologia e universidade”.<br>Todos são bem-vindos!',
    chatUrl: 'https://francis-chat-bot.netlify.app/',
    sac: { email: 'conectaaluno@uece.br (exemplo)', telefone: '(85) 0000-0000 (exemplo)', horario: 'Seg a sex, 8h às 17h (exemplo)', prazo: 'Até 2 dias úteis (exemplo)' },
    perfil: {
      universidade: 'Universidade Estadual do Ceará', curso: 'Administração', semestre: '5º semestre', matricula: '2023.1.00000 (exemplo)', campus: 'Itaperi',
      bio: 'Estudante de Administração, interessado em gestão de pessoas, projetos universitários e tecnologia.',
      disciplinas: [['Gestão de Pessoas', 'Seg e qua, 14h'], ['Administração Financeira', 'Ter e qui, 10h'], ['Marketing', 'Sex, 8h'], ['Metodologia Científica', 'Qua, 16h']],
      interesses: ['Gestão de pessoas', 'Empreendedorismo', 'Pesquisa', 'Tecnologia', 'Voluntariado']
    }
  },
  ufc: {
    dominios: ['ufc.br'],
    foto: 'foto-ufc.jpg',
    biblioteca: { nome: 'Bibliotecas da UFC', url: 'https://biblioteca.ufc.br/pt/' },
    sigla: 'UFC', assistente: 'Francis',
    slogan: 'Sua jornada na UFC, mais conectada',
    curso: 'Engenharia - UFC',
    quote: '“Conhecer é o primeiro passo para transformar.”',
    signNome: 'UNIVERSIDADE FEDERAL DO CEARÁ', campus: 'Campus do Pici',
    mapaEmbed: 'https://www.google.com/maps?q=Universidade+Federal+do+Cear%C3%A1+Campus+do+Pici&output=embed',
    mapaLink: 'https://www.google.com/maps/search/?api=1&query=Universidade+Federal+do+Cear%C3%A1+Campus+do+Pici',
    mapaTitulo: 'Mapa da UFC - Campus do Pici', lago: 'Bosque do Pici',
    areas: ['🏛️ Reitoria', '📗 Biblioteca Universitária', '🟦 Centro de Tecnologia', '🟧 Centro de Ciências', '🍽️ Restaurante Universitário', '🏃 Ginásio'],
    eventos: [
      { m: 'OUT', d: 8, t: 'Encontros Universitários (exemplo)', l: 'Campus do Pici' },
      { m: 'OUT', d: 14, t: 'Workshop: Currículo e Entrevistas', l: 'Auditório do Centro de Tecnologia' },
      { m: 'OUT', d: 22, t: 'Feira de Monitoria e Pesquisa', l: 'Praça de Convivência' }
    ],
    p1a: 'Carlos Mendes', p1m: 'Engenharia Civil - UFC • 2 h',
    p1t: 'Abriu a seleção para monitoria!<br>Ótima chance de ganhar experiência e se aproximar dos professores. ✨<br>Detalhes no site da UFC.',
    p2a: 'Liga de Empreendedorismo', p2m: 'Comunidade • 5 h',
    p2t: 'Nosso próximo encontro será na quarta, às 15h, no Centro de Tecnologia.<br>Tema: “Ideias que viram negócios”.<br>Todos são bem-vindos!',
    chatUrl: null, // ainda sem assistente configurado
    sac: { email: 'conectaaluno@ufc.br (exemplo)', telefone: '(85) 0000-0000 (exemplo)', horario: 'Seg a sex, 8h às 17h (exemplo)', prazo: 'Até 2 dias úteis (exemplo)' },
    perfil: {
      universidade: 'Universidade Federal do Ceará', curso: 'Engenharia Civil', semestre: '3º semestre', matricula: '2024.2.00000 (exemplo)', campus: 'Pici',
      bio: 'Estudante de Engenharia Civil, curioso por estruturas, sustentabilidade e monitoria.',
      disciplinas: [['Cálculo II', 'Seg e qua, 8h'], ['Física Experimental', 'Ter, 14h'], ['Mecânica dos Sólidos', 'Qui, 10h'], ['Topografia', 'Sex, 14h']],
      interesses: ['Estruturas', 'Sustentabilidade', 'Monitoria', 'Projetos sociais', 'Fotografia']
    }
  },
  unifor: {
    dominios: ['unifor.br'],
    foto: 'foto-unifor.jpg',
    biblioteca: { nome: 'Biblioteca da Unifor', url: 'https://unifor.br/cesta-de-servicos/biblioteca' },
    sigla: 'Unifor', assistente: 'Francis',
    slogan: 'Sua jornada na Unifor, mais conectada',
    curso: 'Administração - Unifor',
    quote: '“Conhecimento que abre caminhos.”',
    signNome: 'UNIVERSIDADE DE FORTALEZA', campus: 'Campus Edson Queiroz',
    mapaEmbed: 'https://www.google.com/maps?q=Universidade+de+Fortaleza+Campus+Edson+Queiroz&output=embed',
    mapaLink: 'https://www.google.com/maps/search/?api=1&query=Universidade+de+Fortaleza+Campus+Edson+Queiroz',
    mapaTitulo: 'Mapa da Unifor - Campus Edson Queiroz', lago: 'Área verde',
    areas: ['🏛️ Reitoria', '📗 Biblioteca', '🟦 Centro de Ciências da Comunicação e Gestão', '🍽️ Praça de alimentação', '🏃 Quadras'],
    eventos: [
      { m: 'DEZ', d: 3, t: 'Feira de Carreiras (exemplo)', l: 'Campus Edson Queiroz' },
      { m: 'DEZ', d: 9, t: 'Roda de Conversa: Empreendedorismo Universitário', l: 'Auditório' },
      { m: 'DEZ', d: 14, t: 'Workshop: Currículo e LinkedIn', l: 'Sala de eventos' }
    ],
    chatUrl: null, // ainda sem assistente configurado
    sac: { email: 'conectaaluno@unifor.br (exemplo)', telefone: '(85) 0000-0000 (exemplo)', horario: 'Seg a sex, 8h às 17h (exemplo)', prazo: 'Até 2 dias úteis (exemplo)' },
    perfil: {
      universidade: 'Universidade de Fortaleza', curso: 'Administração', semestre: '4º semestre', matricula: '2024.2.00000 (exemplo)', campus: 'Edson Queiroz',
      bio: 'Estudante de Administração, interessado em empreendedorismo, marketing e projetos sociais.',
      disciplinas: [['Marketing', 'Seg e qua, 19h'], ['Contabilidade Gerencial', 'Ter e qui, 19h'], ['Gestão de Pessoas', 'Sex, 19h'], ['Empreendedorismo', 'Qua, 21h']],
      interesses: ['Empreendedorismo', 'Marketing', 'Projetos sociais', 'Inovação', 'Networking']
    }
  }
};