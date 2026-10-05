import type {WardogsItem} from "./item-library";

type ItemProse = Pick<WardogsItem, "summary" | "description" | "role" | "strengths" | "cautions" | "confirmedFacts" | "unconfirmedFacts">;
type Authored = Omit<ItemProse, "confirmedFacts">;
const p = (summary: string, description: string, role: string, strengths: string[], cautions: string[], unconfirmedFacts?: string[]): Authored => ({summary, description, role, strengths, cautions, unconfirmedFacts});
const authored: Record<string, Authored> = {
  mortar: p(
    "Arma de fogo indireto para pressionar grupos em telhados, torres, defesas de FOB e combates em torno de objetivos fixos.",
    "O morteiro foi o primeiro equipamento de WARDOGS a ganhar uma página própria de arma porque os vídeos despertaram interesse de busca. Esta página ajuda a avaliar onde usá-lo, como enfrentá-lo e quais registros sustentam cada orientação; não substitui uma tabela definitiva de atributos.",
    "Transforme as informações dos companheiros em pressão de fogo, obrigando o inimigo a sair de posições previsíveis.",
    ["Pode atingir jogadores agrupados em telhados, torres e corredores óbvios de acesso ao objetivo.", "Ajuda a enfraquecer uma FOB antes da chegada da infantaria ou dos veículos.", "Favorece equipes que compartilham marcações de alvo e correções de tiro."],
    ["Dano final, tempo de recarga, limites de munição e desbloqueio ainda não estão confirmados.", "O inimigo pode atacar a equipe de morteiro depois de descobrir sua posição.", "Sem informações confiáveis, os disparos viram tentativas pouco previsíveis."]),
  "a-91": p(
    "No Alpha 1, o A-91 era um fuzil da progressão de XP de assalto: 5.56x45mm, tiro semiautomático ou rajadas e 3.17 kg.",
    "O A-91 ocupava a opção de rajadas controladas entre os fuzis de assalto registrados no Alpha 1. O preço não foi capturado, mas calibre, dois modos de tiro, peso e progressão permitem discutir seu uso para controlar passagens sem presumir o balanceamento de lançamento.",
    "Faça disparos semiautomáticos espaçados a distância e rajadas curtas quando o alvo cruzar uma passagem movimentada. Confira o preço ainda desconhecido antes de adotá-lo como fuzil padrão.",
    ["Os modos semiautomático e de rajadas oferecem dois ritmos de combate no registro do Alpha 1.", "O calibre 5.56x45mm pertence à família de munição mais presente no catálogo.", "O peso observado de 3.17 kg ficava abaixo dos registros de FAL e Galil."],
    ["Sem o preço de compra do A-91 no Alpha 1, a comparação de custo fica incompleta.", "O registro não mostrou tiro automático; em combates próximos, as rajadas exigem disciplina.", "Os carregadores STANAG foram catalogados à parte, sem confirmar compatibilidade específica com o A-91."],
    ["O preço do A-91 não foi registrado no Alpha 1; valores de acesso antecipado e lançamento continuam sem confirmação.", "Dano, recuo, acessórios e balanceamento do A-91 podem mudar nas versões posteriores."]),
  ak74: p(
    "O AK74 registrado no Alpha 1 usava 5.45x39mm, pesava 3 kg e oferecia tiro semiautomático e automático na progressão de assalto.",
    "Entre as armas capturadas no Alpha 1, só o AK74 usava 5.45x39mm. Esse abastecimento menos compartilhado, o seletor de tiro e o peso de 3 kg definem seu perfil naquela versão; o preço da loja não apareceu no registro.",
    "Use o semiautomático para economizar munição e o automático nas entradas a curta distância. Planeje o abastecimento de 5.45x39mm, pois há menos armas documentadas que compartilham esse calibre.",
    ["Permite alternar entre disparos cadenciados e pressão automática imediata.", "Com 3 kg no Alpha 1, era mais leve que os demais fuzis de assalto capturados.", "O tambor de 75 cartuchos do AK74 foi registrado e oferece uma referência de capacidade."],
    ["A captura não permite informar o preço de compra do AK74.", "A munição 5.45x39mm tinha menos opções de compartilhamento que a 5.56x45mm na amostra.", "Preço do tambor, impacto no manuseio e disponibilidade final do carregador de 75 cartuchos não foram capturados."],
    ["Ainda faltam preços confirmados do AK74 no acesso antecipado e no lançamento.", "Custo do tambor, recuo, dano e requisitos de progressão do AK74 precisam de verificação nas versões atuais."]),
  "amp-9": p(
    "A AMP-9 custava $900 no Alpha 1, pesava 1.4 kg e usava 9x19mm com tiro semiautomático ou automático na progressão de médico.",
    "A AMP-9 era a arma de fogo mais leve entre os 14 modelos capturados e tinha quatro capacidades de carregador documentadas. É uma opção de proteção próxima para o médico, mas o custo da saída inclui carregadores e munição, além dos $900 observados para a arma.",
    "Leve a AMP-9 quando o médico precisar de uma arma principal leve. Poupe 9x19mm no semiautomático e guarde o automático para proteger reanimações ou reagir à pressão imediata no objetivo.",
    ["O peso de 1.4 kg observado deixa mais margem para considerar proteção e ferramentas médicas.", "O médico pode escolher entre economia de munição e fogo automático de perto.", "Carregadores de 15, 20, 30 e 50 cartuchos foram observados para a AMP-9."],
    ["Os $900 do Alpha 1 não incluíam munição nem carregadores de reposição.", "O carregador de 50 cartuchos custava $180, um acréscimo relevante para uma submetralhadora econômica.", "Alcance, recuo e queda de dano com a distância não constam dos registros da AMP-9."],
    ["Dano, recuo, comportamento a distância e exigências de XP médico da AMP-9 podem mudar no acesso antecipado ou lançamento.", "Os preços e a compatibilidade dos carregadores da AMP-9 no Alpha 1 não confirmam os valores da versão final."]),
  "amr-50": p(
    "O AMR 50 era um fuzil de precisão de $8,800 e 12.5 kg no Alpha 1, com ferrolho, carregador e munição .50 Cal na progressão de reconhecimento.",
    "O AMR 50 era o modelo mais caro e pesado da amostra de 14 armas. A munição .50 Cal também aparecia por $50 por cartucho e $250 por caixa. Naquele registro, montar esse equipamento de reconhecimento exigia um investimento bem acima dos fuzis mais leves.",
    "Escolha uma posição de observação preparada e alvos que justifiquem o custo de reposição, os 12.5 kg e a munição cara. Não trate o calibre como garantia de dano contra qualquer alvo.",
    ["A .50 Cal dá ao AMR 50 uma função distinta de fuzil pesado no catálogo Alpha.", "O carregador permite planejar disparos sucessivos com ferrolho sem recarregar a arma a cada tiro.", "Foi capturado um carregador de 10 cartuchos por $30."],
    ["Perder uma arma de $8,800 comprometia uma parcela grande do saldo no Alpha 1.", "O peso observado de 12.5 kg superava bastante o BMR-308 e os fuzis de assalto.", "A .50 Cal tinha o maior preço por cartucho da amostra: $50."],
    ["Dano em infantaria, interação com blindagem, oscilação da mira e manuseio do AMR 50 ainda dependem da versão jogada.", "Os $8,800 e os custos de .50 Cal são observações do Alpha 1, sem confirmar a economia de lançamento."]),
  "bmr-308": p(
    "O BMR-308 aparecia no Alpha 1 por $6,000: fuzil semiautomático de precisão, 3.9 kg e .308 Winchester na progressão de reconhecimento.",
    "O BMR-308 oferecia uma alternativa semiautomática entre o AMR 50 muito pesado e o arco composto. Compartilhava o calibre .308 Winchester com o FAL e um registro de carregador de 20 cartuchos, mas isso não basta para assegurar a compatibilidade nas versões posteriores.",
    "Mantenha uma linha de tiro de média ou longa distância para corrigir os disparos de precisão. Reserve dinheiro para .308 Winchester e evite gastar munição como se estivesse usando um fuzil de assalto de perto.",
    ["O semiautomático permite corrigir o próximo tiro mais rapidamente que o ferrolho observado no AMR 50.", "Os 3.9 kg do Alpha 1 eram mais fáceis de acomodar que os 12.5 kg do fuzil pesado.", "Um carregador de 20 cartuchos para a família FAL/BMR-308 foi registrado por $150."],
    ["A compra de $6,000 torna a reposição do BMR-308 uma decisão cara.", "A .308 Winchester padrão custava $4 por cartucho e $40 por caixa no registro.", "Encaixe de miras, manuseio do carregador, dano e alcance efetivo não foram documentados como especificações finais."],
    ["Compatibilidade de miras, recuo, dano e ajuste de alcance do BMR-308 não estão confirmados para acesso antecipado ou lançamento.", "O preço de $6,000 e o custo dos carregadores do BMR-308 podem diferir na versão atual."]),
  "bushmaster-m17s": p(
    "O Bushmaster M17S apareceu por $0 no Alpha 1, com 3.17 kg, 5.56x45mm e modos semiautomático e de rajadas na progressão de assalto.",
    "M17S, A-91 e KH-2002 compartilhavam os mesmos dados principais de calibre, modos de tiro e peso nas capturas. O detalhe do M17S era o preço de $0 na loja. Esse registro histórico não prova que a arma será gratuita permanentemente no lançamento.",
    "Considere o M17S uma opção de rajadas controladas na comparação do Alpha. Use os $0 apenas para analisar aquele registro até confirmar como a arma é obtida na versão que você joga.",
    ["O valor mostrado no Alpha 1 zerava o custo observado da arma básica.", "Semiautomático e rajadas permitem cadenciar o gasto de munição.", "O 5.56x45mm fazia parte da família de calibre mais representada nas capturas."],
    ["O preço de $0 pode indicar equipamento inicial, dado provisório ou ajuste temporário de teste.", "Não houve modo automático no registro do M17S.", "As capacidades STANAG catalogadas separadamente não comprovam encaixe no M17S."],
    ["Os $0 exibidos para o M17S no Alpha 1 não são um preço confirmado de acesso antecipado ou lançamento.", "Regras de aquisição, dano, recuo e compatibilidade de acessórios do M17S podem mudar."]),
  "compound-bow": p(
    "O arco composto custava $800 e pesava 1.3 kg no Alpha 1, com flechas padrão e disparo por puxar e soltar na progressão de reconhecimento.",
    "O arco era o mais leve dos modelos capturados e o único baseado em flechas padrão e no tempo de puxar e soltar a corda. Custava menos que os fuzis de reconhecimento, mas os registros não informam dano, velocidade, recuperação nem quantidade de flechas.",
    "Escolha o arco se você domina o tempo de puxar e soltar. Leve uma arma secundária para situações em que um carregador convencional dá mais margem para reagir.",
    ["Os 1.3 kg eram o menor peso entre os 14 modelos da amostra.", "Os $800 do Alpha 1 ficavam muito abaixo do BMR-308 e do AMR 50.", "Flechas padrão oferecem uma linha de abastecimento diferente dos calibres de armas de fogo."],
    ["Não foi observado um modo semiautomático ou automático para compensar o tempo de puxar a corda.", "Dano, velocidade, queda, recuperação e quantidade de flechas não foram capturados.", "O catálogo não tem uma página própria de flechas nem uma matriz confirmada de acessórios para o arco."],
    ["Dano, velocidade, recuperação e capacidade de flechas do arco continuam sem confirmação para as versões posteriores.", "Os $800 e o requisito de reconhecimento do arco no Alpha podem diferir no acesso antecipado ou lançamento."]),
  deagle: p(
    "A Deagle era uma secundária semiautomática em .50 AE de $900 no Alpha 1; peso e progressão não apareceram na captura.",
    "A Deagle tinha preço de arma principal na lista de secundárias e usava o pouco comum .50 AE. Um carregador de sete cartuchos foi registrado por $50. A ausência de peso e progressão no Alpha deixa parte do planejamento em aberto, embora a Temporada 1 confirme Career 85.",
    "Escolha a Deagle quando uma secundária cara e de baixa capacidade fizer sentido para a saída. Some munição .50 AE e carregadores antes de compará-la com alternativas mais baratas.",
    ["Era o único modelo em .50 AE entre as 14 armas capturadas.", "O semiautomático evita os ciclos de ferrolho ou de puxar e soltar das opções especializadas.", "Há um registro específico do carregador de sete cartuchos da Deagle."],
    ["Os $900 observados igualavam o preço da AMP-9 antes dos gastos com munição.", "O carregador de sete cartuchos custava $50 e oferece pouca margem para errar.", "A Temporada 1 confirma Career 85; o peso atual e a carga total de porte continuam sem verificação."],
    ["A captura Alpha omitiu peso e progressão da Deagle; a Temporada 1 confirma Career 85, mas ainda não confirma o peso.", "Dano, recuo e comportamento do carregador podem mudar; os $900 da Deagle no Alpha não foram verificados na loja atual."]),
  fal: p(
    "O FAL era um fuzil de assalto de $5,500 e 4.25 kg no Alpha 1, usando .308 Winchester em semiautomático ou automático.",
    "O FAL era o fuzil de assalto mais caro e pesado das capturas, trocando a munição 5.56x45mm mais comum por .308 Winchester. Os carregadores documentados de 20 e 30 cartuchos também custavam mais que muitos modelos de menor calibre.",
    "Cadencie os tiros semiautomáticos para controlar o gasto de .308. Reserve o automático para pressão curta e decisiva: arma, cartuchos e carregadores tinham custos relevantes no Alpha 1.",
    ["O seletor permite passar de tiros controlados para pressão automática de perto.", "O calibre .308 Winchester distingue o FAL dos fuzis de assalto mais leves em 5.56x45mm.", "As capturas mostram opções concretas de 20 e 30 cartuchos."],
    ["O preço de $5,500 era bem maior que o do Galil e da AMP-9 registrados.", "Com 4.25 kg, o FAL era o mais pesado dos fuzis de assalto capturados.", "O carregador de 30 cartuchos custava $250, além dos $4 por cartucho .308 padrão."],
    ["Dano, recuo, controle do automático e requisitos de XP de assalto do FAL podem mudar em versões posteriores.", "Os $5,500 e os preços de carregadores do FAL são observações Alpha, sem confirmação como valores de lançamento."]),
  galil: p(
    "O Galil custava $2,200 no Alpha 1 e pesava 3.95 kg, com 5.56x45mm e tiro semiautomático ou automático na progressão de assalto.",
    "O Galil ocupava uma faixa intermediária de preço: mais caro e pesado que os registros de 5.56x45mm com rajadas, mas mais barato que o FAL em .308 e com modo automático. Seus carregadores próprios de 35 e 50 cartuchos acrescentam contexto para comparar capacidade.",
    "Use o Galil como principal flexível de assalto. Atravesse terreno aberto economizando no semiautomático e escolha o automático quando a equipe encurtar a distância ou entrar numa posição defendida.",
    ["Os dois modos atendem tanto à conservação de munição quanto à pressão próxima.", "Foram registrados carregadores específicos de 35 e 50 cartuchos para o Galil.", "Os $2,200 observados ficavam bem abaixo do FAL, mantendo a opção automática."],
    ["Os 3.95 kg superavam A-91, AK74, M17S e KH-2002 nas capturas.", "O carregador de 50 cartuchos custava $110 antes de adicionar munição.", "Recuo, tempo de recarga, dano e efeito dos acessórios não foram capturados como valores finais."],
    ["Ainda faltam confirmação de recuo, dano, encaixe de acessórios e progressão de assalto do Galil nas versões posteriores.", "Os preços Alpha da arma e dos carregadores do Galil podem não coincidir com a loja atual."]),
  "ggx-17": p(
    "A GGX 17 era uma secundária semiautomática em 9x19mm no Alpha 1, sem preço, peso ou progressão capturados.",
    "A GGX 17 representava a opção semiautomática convencional do par de pistolas GGX. O 9x19mm a liga à caixa de munição mais barata observada, mas três campos ausentes na loja impedem uma comparação confiável de custo total ou carga transportada.",
    "Use a GGX 17 como reserva de tiros cadenciados, sem atribuir a ela o automático da GGX 18. Deixe margem no orçamento até confirmar o custo de aquisição numa versão mais recente.",
    ["O semiautomático favorece disparos de reserva controlados e economia de munição.", "O 9x19mm padrão apareceu por $1 por cartucho e $10 por caixa.", "O calibre compartilhado ajuda a pensar no abastecimento junto à AMP-9 e à GGX 18."],
    ["Preço, peso e progressão da GGX 17 ficaram ausentes da captura Alpha.", "Carregadores GGX de 33 e 50 cartuchos foram registrados, sem provar compatibilidade específica com a GGX 17.", "Dano, recuo, capacidade e manuseio não constam do registro da arma."],
    ["Preço, peso e progressão da GGX 17 continuam sem confirmação para acesso antecipado ou lançamento.", "Compatibilidade de carregadores, dano, recuo e capacidade da GGX 17 podem diferir na versão atual."]),
  "ggx-18": p(
    "A GGX 18 usava 9x19mm com semiautomático e automático no Alpha 1; preço, peso e progressão não foram registrados.",
    "A opção automática observada distinguia a GGX 18 da GGX 17, dando às secundárias uma alternativa de fogo rápido. O registro confirma esse seletor, mas não resolve custo, peso, progressão nem encaixe de carregadores, portanto ainda não sustenta uma avaliação de custo-benefício no lançamento.",
    "Mantenha a GGX 18 em semiautomático no uso normal. Reserve o automático para uma ameaça urgente de perto, quando gastar 9x19mm rapidamente for mais importante que conservar cartuchos.",
    ["Era a GGX mais versátil da captura, com dois modos de tiro.", "A munição 9x19mm padrão tinha preço observado baixo: $1 por cartucho e $10 por caixa.", "O calibre pode acompanhar um plano de abastecimento de equipe baseado na AMP-9."],
    ["A loja do Alpha não forneceu preço, peso ou progressão da GGX 18 na captura.", "O automático pode esvaziar o carregador rapidamente mesmo com munição barata.", "Os registros de carregador GGX de 33 cartuchos por $70 e tambor de 50 por $110 não confirmam encaixe final na GGX 18."],
    ["Os campos de preço, peso e progressão da GGX 18 ainda exigem confirmação em versões posteriores.", "Ajuste do automático, carregadores, recuo e dano da GGX 18 não estão estabelecidos para a versão atual."]),
  judge: p(
    "A Judge aparecia por $250 em .45 Colt no Alpha 1, sem registro de modo de tiro, peso ou progressão.",
    "A Judge tinha o menor preço não nulo entre as armas capturadas e era a única em .45 Colt. Há uma caixa de munição registrada por $33, mas faltam dados básicos para saber como essa secundária se comporta em combate.",
    "Avalie a Judge como uma candidata de baixo custo inicial cuja cadência precisa ser conferida no jogo. Inclua a caixa de .45 Colt na conta das reposições, mesmo que a arma pareça barata.",
    ["Os $250 eram o menor valor de compra diferente de zero entre os modelos observados.", "O calibre .45 Colt separa seu abastecimento das outras secundárias.", "A caixa registrada por $33 documenta ao menos parte do custo de reposição."],
    ["Modo de tiro, peso e progressão da Judge não foram capturados no Alpha 1.", "Não há registro próprio de carregador ou capacidade para a Judge.", "O preço básico de $250 não determina dano, velocidade de recarga, alcance ou valor final."],
    ["Os campos ausentes de modo de tiro, peso e progressão da Judge seguem sem confirmação no acesso antecipado ou lançamento.", "Capacidade, recarga, dano e os $250 observados podem mudar nas versões posteriores da Judge."]),
  "kh-2002": p(
    "O KH-2002 era um fuzil de assalto de 3.17 kg no Alpha 1, em 5.56x45mm, com semiautomático e rajadas; o preço não foi capturado.",
    "O KH-2002 completava o trio de fuzis de 3.17 kg em 5.56x45mm com rajadas. Ao contrário dos $0 mostrados para o M17S, seu próprio preço não apareceu. Mesmo com atributos principais parecidos, faltam dados para decidir entre os modelos só pelo custo.",
    "Escolha o semiautomático nas linhas de tiro longas e rajadas quando o alvo se expuser por pouco tempo. Aguarde registros posteriores para distinguir o manuseio e a economia do KH-2002.",
    ["Os dois modos permitem controlar o ritmo de consumo de munição.", "Os 3.17 kg registrados eram menos que o peso de Galil e FAL.", "O 5.56x45mm, calibre mais compartilhado da amostra, oferece mais referências de abastecimento da equipe."],
    ["Falta o preço de compra do KH-2002 na captura Alpha.", "O registro não distingue seu manuseio do A-91 ou do M17S.", "Há registros de miras e capacidades STANAG, mas não de compatibilidade confirmada com o KH-2002."],
    ["Sem o preço Alpha do KH-2002, valores de acesso antecipado e lançamento continuam desconhecidos.", "Manuseio específico, dano, recuo e encaixe de acessórios do KH-2002 podem mudar nas próximas versões."]),
  "ah-6m-miniguns": p(
    "O AH-6M Miniguns apareceu como helicóptero de combate de $7,000 no Alpha 1, com requisito de compra ilegível.",
    "O AH-6M é a versão armada da família leve AH-6 capturada na loja Alpha. A classificação de combate e os $7,000 o separam do MH-6 de transporte. Como o requisito de acesso e o comportamento das armas não foram registrados com clareza, esta é uma referência de função, não uma ficha final de desempenho.",
    "Planeje passagens de ataque curtas com o AH-6M e preserve o helicóptero entre os combates. Cada perda exige outra compra segundo a economia da versão observada.",
    ["O preço Alpha de $7,000 era inferior ao AH-6R Rockets e ao Havoc.", "A função de combate o distingue do MH-6 de transporte com compra livre observada.", "A designação Miniguns ajuda a compará-lo com a variante AH-6R de foguetes antes da compra."],
    ["O requisito de acesso do AH-6M ficou ilegível; preço sozinho não indica disponibilidade.", "Dano, munição, convergência e alcance das miniguns não foram capturados.", "Resistência, tripulação necessária, pilotagem e contramedidas não estão documentadas."],
    ["O requisito ilegível do AH-6M no Alpha continua sem confirmação para acesso antecipado ou lançamento.", "Desempenho das miniguns, voo, resistência e os $7,000 do AH-6M podem diferir na versão atual."]),
  "ah-6r-rockets": p(
    "O AH-6R Rockets foi listado por $12,500 como helicóptero de foguetes no Alpha 1; o requisito de acesso não pôde ser lido.",
    "O AH-6R troca a proposta de miniguns da família leve por foguetes e por uma compra bem mais cara. Os $12,500 observados pedem mais planejamento que o AH-6M, mas carga de foguetes, explosão, reposição e condições de travamento não foram capturadas com precisão.",
    "Reserve o AH-6R para uma janela de ataque planejada, com alvo valioso identificado e saída segura. Evite arriscar um helicóptero caro numa passagem sem apoio da equipe.",
    ["O rótulo de helicóptero de foguetes aponta uma função diferente do AH-6M Miniguns.", "Os nomes da mesma família permitem comparar diretamente papel e custo do AH-6M.", "Os $12,500 o colocavam abaixo do Havoc no preço Alpha, ainda como aeronave dedicada ao combate."],
    ["O requisito de compra do AH-6R não ficou legível na captura.", "Quantidade de foguetes, dano em área, precisão e reposição não foram registradas.", "O alto custo de reposição observado torna passagens sem coordenação especialmente arriscadas."],
    ["Ainda não há confirmação atual para a condição de acesso ilegível do AH-6R.", "Carga, dano e reposição dos foguetes, pilotagem e preço do AH-6R podem mudar entre versões."]),
  bobcat: p(
    "O Bobcat era um transporte leve de $500 com compra livre observada na loja de veículos do Alpha 1.",
    "O Bobcat ocupava a ponta mais barata do catálogo de veículos capturado. Transporte leve e compra livre fazem dele a referência histórica mais simples de mobilidade básica. Isso não informa assentos, espaço de carga, proteção ou velocidade, nem garante o mesmo acesso nas versões de lançamento.",
    "Considere o Bobcat para deslocamentos curtos e viagens de recuperação quando a equipe precisa de mobilidade com pouco investimento, sem depender de armas, blindagem ou capacidade de frete não verificada.",
    ["Os $500 eram o menor preço entre os vinte veículos capturados.", "A compra livre estava visível no Alpha 1, sem indicação de uma linha de nível.", "A classificação de transporte leve mantém a decisão centrada em deslocamento."],
    ["A compra livre do Bobcat foi observada só no Alpha, não prometida para o lançamento.", "Assentos, armazenamento, velocidade, resistência e comportamento no terreno não foram capturados.", "Preço baixo na loja não comprova pouco gasto com combustível, reparos ou reposições."],
    ["Acesso livre e os $500 do Bobcat são dados Alpha, sem confirmação como regras de acesso antecipado ou lançamento.", "Capacidade, proteção, pilotagem, armazenamento e custos de uso do Bobcat seguem sem verificação atual."]),
  "dune-buggy": p(
    "O Dune Buggy aparecia como transporte rápido de $1,500, exigindo Driver 10 no Alpha 1.",
    "A loja classificava o Dune Buggy como a opção de transporte terrestre voltada à velocidade. Driver 10 e $1,500 o colocavam acima da mobilidade inicial do Bobcat, mas o rótulo rápido não mede velocidade máxima, aceleração, aderência ou tolerância a colisões. A Temporada 1 já registra Driver 8, portanto o nível Alpha é histórico.",
    "Escolha o buggy para reconhecimento e mudanças de rota em que chegar depressa pesa mais que proteção. Confira passageiros e carga antes de montar um plano que dependa dessas capacidades.",
    ["Transporte rápido era a função expressamente mostrada no Alpha 1.", "Os $1,500 ficavam abaixo das famílias maiores Kodiak e Humvee.", "O requisito Driver 10 estava legível na captura histórica."],
    ["Velocidade final, aceleração, tração e comportamento ao capotar não foram capturados.", "A Temporada 1 registra Driver 8; Driver 10 pertence ao Alpha 1.", "Não há especificação capturada de proteção, assentos ou carga do Dune Buggy."],
    ["A Temporada 1 informa $25,000 para desbloquear a linha Driver; a compra Alpha do buggy por $1,500 ainda não foi verificada no acesso antecipado.", "Velocidade, dirigibilidade, resistência, assentos e carga do Dune Buggy podem diferir na versão atual."]),
  "flakpanzer-gepard": p(
    "O Flakpanzer Gepard foi registrado como blindado antiaéreo de $8,000, exigindo Wardog 45 no Alpha 1.",
    "O Gepard era o modelo blindado dedicado à defesa antiaérea da amostra. O preço observado ficava abaixo de L2A6 e SPH-2, com requisito na progressão Wardog. Essa função permite discutir proteção contra aeronaves, mas não estabelece detecção, canhões, blindagem, tripulação ou área efetiva de cobertura como sistemas finais.",
    "Posicione o Gepard para defender ativos terrestres valiosos e rotas prováveis de aproximação aérea. Mantenha apoio no solo: a função antiaérea não o torna seguro contra todos os tipos de ameaça.",
    ["A função de blindado antiaéreo era exclusiva entre os vinte veículos registrados.", "Os $8,000 do Alpha eram menos que o preço dos outros dois ativos pesados da linha Wardog.", "Wardog 45 estava legível e servia de referência histórica para a progressão."],
    ["Alcance de detecção, munição, dano dos canhões, elevação e acompanhamento de alvos não foram capturados.", "O rótulo antiaéreo não demonstra proteção contra tanques, artilharia ou infantaria.", "Wardog 45 e $8,000 do Gepard são observações anteriores ao lançamento."],
    ["Nível Wardog 45 e preço de $8,000 do Gepard permanecem sem confirmação para as versões posteriores.", "Blindagem, detecção aérea, armas, tripulação e munição do Gepard podem mudar no acesso antecipado ou lançamento."]),
  havoc: p(
    "Os $18,000 do Havoc pertencem ao Alpha; um piloto da Temporada 1 relatou custo maior para a saída equipada e fortes respostas antiaéreas.",
    "O Havoc era o veículo mais caro da lista capturada, com a função ampla de helicóptero de ataque, em vez dos nomes de arma específicos da família AH-6. Isso o tornava o maior compromisso financeiro aéreo daquele Alpha. Armamento, blindagem, organização da tripulação e acesso ainda não sustentam uma comparação definitiva.",
    "Invista no Havoc quando a equipe puder fornecer alvos, acompanhar o espaço aéreo e indicar uma rota de saída longe de fogo concentrado. Trate o preço da saída equipada como uma questão separada da compra histórica.",
    ["A classificação de helicóptero de ataque o separava das aeronaves de transporte.", "O registro de $18,000 era a referência mais clara de aeronave de alto investimento na loja observada.", "Sua função ajuda a comparar as alternativas de ataque AH-6M e AH-6R, mais baratas no Alpha."],
    ["O requisito de compra do Havoc ficou ilegível, sem caminho de acesso documentado.", "Armas, blindagem, sensores, contramedidas e tripulação não foram registrados.", "As afirmações recentes de custo e desbloqueio vêm de um piloto, não de uma lista oficial de preços.", "Defesa antiaérea coordenada pode neutralizar uma aeronave cara; avalie a rota antes de gastar."],
    ["A condição de acesso ilegível do Havoc no Alpha não confirma a disponibilidade de acesso antecipado ou lançamento.", "Um piloto da Temporada 1 relatou em 20 de setembro Pilot 35 e saída equipada de cerca de $22,000–$30,000; a observação comunitária não foi verificada.", "Armamento, blindagem, tripulação, voo, contramedidas e preço atual do Havoc precisam ser conferidos no cliente atual."]),
  "humvee-m249": p(
    "O Humvee M249 era um transporte armado de $3,750, com Driver 25 no registro do Alpha 1.",
    "A variante M249 acrescentava uma arma de apoio à plataforma Humvee sem chegar ao preço da versão Minigun. Seu Driver 25 vinha bem depois do Driver 8 do Kodiak M249. Embora os dois custassem $3,750, representavam decisões diferentes de progressão, com detalhes de arma e montagem ainda ausentes.",
    "Use o Humvee M249 para transportar a equipe com um posto de fogo defensivo. Planeje a rota sem depender da proteção ainda não verificada do atirador ou da cabine.",
    ["O rótulo de transporte armado combina deslocamento com a identificação de uma M249 montada.", "Os $3,750 eram $750 acima do Humvee básico e abaixo da variante Minigun.", "Driver 25 diferenciava claramente seu acesso do Kodiak M249 em Driver 8."],
    ["Munição, giro, proteção, precisão e exposição do atirador da M249 não foram capturados.", "Driver 25 do Humvee M249 é uma observação Alpha, não um requisito final.", "Assentos, proteção da cabine, carga e reparo permanecem sem dados."],
    ["Ainda faltam confirmação de Driver 25 e dos $3,750 do Humvee M249 no acesso antecipado ou lançamento.", "Funcionamento da M249, proteção, assentos, carga e dirigibilidade dessa variante podem diferir no jogo atual."]),
  "humvee-minigun": p(
    "O Humvee Minigun aparecia por $4,500 como transporte fortemente armado no Alpha 1, sem requisito de acesso legível.",
    "Era o Humvee mais caro da amostra e o único da família classificado como transporte fortemente armado. Os $1,500 a mais que o básico indicavam outro patamar de compra, mas faltam condição de acesso e dados da arma para concluir sobre cadência, abastecimento, blindagem ou vantagem sobre a M249.",
    "Trate o Humvee Minigun como uma plataforma móvel de fogo pesado que exige rota protegida, atirador coordenado e saída planejada. Não o use como blindado de linha de frente com proteção presumida.",
    ["A função fortemente armada o diferenciava dos demais Humvees no registro.", "O nome Minigun identifica uma proposta de arma diferente da variante M249 mais barata.", "Os $4,500 do Alpha ainda ficavam abaixo do Ural Defender M249 maior."],
    ["O requisito ilegível do Humvee Minigun deixa seu acesso desconhecido.", "Munição, tempo de aceleração da arma, giro, dano e exposição do atirador não foram capturados.", "Transporte fortemente armado descreve uma função, sem comprovar proteção de tanque."],
    ["O acesso ao Humvee Minigun continua sem confirmação atual a partir da captura Alpha ilegível.", "Desempenho da minigun, proteção, capacidade, manuseio e preço dessa variante podem mudar nas versões posteriores."]),
  humvee: p(
    "O Humvee básico foi listado por $3,000 como transporte protegido, com Driver 15 no Alpha 1.",
    "O Humvee sem arma montada servia de referência de transporte protegido da família. Custava o mesmo que o Kodiak Pickup voltado à carga e menos que os Humvees armados. Protegido, porém, era um rótulo de classe: a captura não mediu blindagem, disposição dos assentos, armazenamento ou sobrevivência comparada.",
    "Escolha o Humvee básico para mover pessoal em estradas disputadas quando manter o custo abaixo das variantes armadas for mais importante que levar uma arma montada.",
    ["Transporte protegido era a função explicitamente registrada, sem precisar inventar um valor de blindagem.", "O preço observado de $3,000 ficava abaixo das duas variantes Humvee com armas.", "Driver 15 o colocava entre Dune Buggy e Humvee M249 na progressão capturada."],
    ["Blindagem, modelo de dano, número de assentos e limite de carga não foram registrados.", "A classe protegido não garante segurança contra minas, armas pesadas ou emboscadas.", "Driver 15 e os $3,000 do Humvee básico podem mudar depois do Alpha."],
    ["A compra de $3,000 e o nível Driver 15 do Humvee básico não são regras confirmadas de acesso antecipado ou lançamento.", "Proteção, assentos, armazenamento, mobilidade, combustível e reparo do Humvee exigem verificação na versão atual."]),
  "kodiak-m249": p(
    "O Kodiak M249 era um transporte armado de $3,750, acessível em Driver 8 no registro do Alpha 1.",
    "Era o transporte armado com o menor nível Driver legível da amostra. Tinha o mesmo preço e papel do Humvee M249, mas aparecia em Driver 8 em vez de 25. A escolha de plataforma e o momento do desbloqueio eram questões distintas mesmo antes de comparar manuseio, proteção e arma, que não foram registrados.",
    "Considere o Kodiak M249 para uma equipe ainda no início da progressão Driver que precisa de apoio móvel, sem passar à família Ural Defender. Confira no jogo o desempenho da plataforma.",
    ["Driver 8 era o menor nível observado entre os veículos terrestres armados.", "A função de transporte armado junta a proposta utilitária Kodiak a uma M249 identificada.", "Os $3,750 iguais ao Humvee M249 permitem comparar o custo histórico com o acesso posterior deste."],
    ["Munição, giro da arma, proteção e exposição do atirador não constam da captura Kodiak.", "Driver 8 não garante que o Kodiak M249 continue sendo um desbloqueio inicial.", "Assentos, espaço de carga, dirigibilidade, resistência e reparo não foram registrados."],
    ["Nível Driver 8 e preço de $3,750 do Kodiak M249 ainda não foram confirmados nas versões posteriores.", "Comportamento da M249, assentos, carga, proteção e resistência do Kodiak armado podem diferir no cliente atual."]),
  "kodiak-pickup": p(
    "O Kodiak Pickup foi registrado por $3,000 como transporte de carga, após um desbloqueio de $15,000 no Alpha 1.",
    "O Pickup era o único veículo da amostra explicitamente chamado de transporte de carga. A loja separava compra de $3,000 e desbloqueio de $15,000, criando duas etapas de custo. A captura não explica volume de carga, carregamento nem se o desbloqueio era permanente.",
    "Escolha o Kodiak Pickup para viagens de abastecimento em que a função de carga importa mais que o preço menor do Kodiak básico ou a arma da versão M249.",
    ["Transporte de carga era uma função exclusiva na lista de veículos observados.", "Os $3,000 igualavam o Humvee básico, mas atendiam a outra necessidade logística.", "O desbloqueio separado de $15,000 estava legível e permite discutir o custo completo observado de entrada."],
    ["Não há explicação de permanência, repetição ou vínculo com a conta para os $15,000.", "Slots de carga, interação de carregamento, restrições de itens e perdas não foram capturados.", "Proteção, assentos, velocidade, terreno e combustível do Pickup não foram registrados."],
    ["O desbloqueio de $15,000 e a compra de $3,000 do Kodiak Pickup não estão confirmados para versões posteriores.", "Permanência do acesso, regras e capacidade de carga, assentos e dirigibilidade do Pickup precisam de verificação atual."]),
  kodiak: p(
    "O Kodiak básico aparecia por $2,500 como transporte utilitário com compra livre no Alpha 1.",
    "Na loja observada, o Kodiak básico ficava entre o Bobcat e as variantes Kodiak especializadas. Transporte utilitário e compra livre o identificam como entrada geral da família, sem definir o que essa utilidade oferece: passageiros, armazenamento, reboque e comportamento fora de estrada ficaram sem documentação.",
    "Use o Kodiak para deslocamento geral quando não precisar da função explícita de carga do Pickup ou da arma da variante M249. Teste a capacidade prática na versão ativa.",
    ["A compra livre foi observada sem linha Driver ou desbloqueio em dinheiro indicado.", "Os $2,500 eram menos que os preços das duas variantes Kodiak especializadas.", "O papel utilitário é mais amplo que a proposta de velocidade do Dune Buggy."],
    ["A compra livre do Kodiak básico era um estado do Alpha e pode mudar.", "O rótulo utilitário não especifica assentos, carga, reboque, proteção ou desempenho no terreno.", "Além de função e preço, as diferenças entre Kodiak básico e Pickup não foram capturadas."],
    ["Compra livre e preço de $2,500 do Kodiak básico não são regras confirmadas para acesso antecipado ou lançamento.", "Assentos, carga, reboque, proteção, combustível e reparos do Kodiak continuam sem confirmação atual."]),
  l2a6: p(
    "O L2A6 era o tanque de batalha de $14,000, exigindo Wardog 35 no catálogo do Alpha 1.",
    "O L2A6 era o único modelo classificado como tanque de batalha e o segundo veículo mais caro da captura. Wardog 35 vinha antes dos requisitos de Gepard e SPH-2, mas a documentação Alpha não estabelece zonas de blindagem, armas, tripulação, munição, mobilidade nem apoio necessário para mantê-lo operando.",
    "Empregue o L2A6 com apoio da equipe para pressionar áreas expostas. Combine informação da infantaria e logística, sem supor que a classificação de tanque elimina os riscos de posição.",
    ["Tanque de batalha era uma classe exclusiva entre os vinte veículos capturados.", "Wardog 35 era o menor requisito legível dos três modelos de blindagem e artilharia.", "Os $14,000 separavam claramente a compra de transportes e do blindado antiaéreo mais barato."],
    ["Valores de blindagem, pontos fracos, armas, munição, tripulantes e reparo não foram capturados.", "A função de tanque não prova imunidade a infantaria, aeronaves ou artilharia.", "Wardog 35 e $14,000 do L2A6 não são afirmações finais de progressão ou economia."],
    ["A exigência Wardog 35 e o preço de $14,000 do L2A6 seguem sem confirmação de acesso antecipado ou lançamento.", "Blindagem, armamento, tripulação, mobilidade, combustível e reparos do L2A6 podem diferir na versão atual."]),
  "mh-6": p(
    "O MH-6 era um transporte aéreo leve de $6,250 com compra livre observada no Alpha 1.",
    "O MH-6 era o helicóptero mais barato capturado e a única aeronave que combinava função de transporte com compra livre visível. Serve de comparação sem foco de combate para a família AH-6. Passageiros, pouso, carga, resistência e exigências de piloto fora da loja não foram documentados.",
    "Planeje inserções leves, resgates e reposicionamento com o MH-6 quando transportar importa mais que um rótulo de arma a bordo. Escolha pousos e rotas de retorno conservadores.",
    ["Os $6,250 eram o menor preço de aeronave observado na loja Alpha.", "A compra livre estava legível, em vez de requisito de nível ou campo ilegível.", "O transporte aéreo leve o distingue das variantes AH-6 armadas."],
    ["Compra livre do MH-6 no Alpha não é promessa de disponibilidade final.", "Assentos, exposição dos passageiros, pilotagem, resistência e tolerância de pouso não foram capturados.", "O rótulo de transporte não comprova capacidade de carga nem ausência de armas no modelo final."],
    ["Acesso livre e $6,250 do MH-6 não estão confirmados para acesso antecipado ou lançamento.", "Assentos, equipamento, voo, carga, resistência e requisitos de piloto do MH-6 continuam sem confirmação atual."]),
  "sph-2": p(
    "A Temporada 1 levou a categoria Artillery Tank a Career 90 e desbloqueio de $500,000; preços de loja e operação do SPH-2 continuam ligados aos registros de cada versão.",
    "O SPH-2 era a única artilharia autopropulsada da loja capturada, com Wardog 55 no Alpha. Vídeos posteriores do Beta fechado mostraram três postos de tripulação, estabilização, ajuste de alcance para fogo indireto, munição de 155 mm e recarga manual. A compra Alpha de $10,000 diverge dos $8,000 por reposição após desbloqueio de $400,000 vistos num guia posterior. São registros de versões distintas, não um preço final único.",
    "Organize o SPH-2 como artilharia de equipe: obtenha alvos confiáveis, proteja a posição e mantenha o abastecimento. Mude de lugar quando o inimigo puder prever de onde saem os tiros.",
    ["A estabilização mantém a mira utilizável durante correções sucessivas de fogo indireto.", "Os postos observados separam motorista, canhão principal de 155 mm e defesa pelo atirador superior.", "A sequência manual de recarga pode reduzir o intervalo quando executada corretamente."],
    ["O motorista não dispara em movimento; quem joga sozinho precisa parar e trocar de posto.", "Posições previsíveis atraem drones, aeronaves, contrabateria e infantaria à procura da artilharia.", "A Temporada 1 confirma o requisito da categoria Artillery Tank, sem confirmar o preço atual do SPH-2; confira preço, alcance e projéteis no jogo."],
    ["Os $10,000 de compra Alpha e $8,000 por reposição Beta divergem; nenhum deles foi confirmado no acesso antecipado.", "Um jogador da Temporada 1 relatou reposição de $8,000 e saída equipada de $11,000–$13,000; falta verificação independente na loja atual.", "A nota oficial cita Artillery Tank, não SPH-2; identidade atual do modelo e preço das compras seguintes exigem confirmação no cliente.", "Alcance, explosão, blindagem e custo da munição do SPH-2 precisam ser medidos ou verificados na versão atual."]),
  "uh-1y-miniguns": p(
    "O UH-1Y Miniguns aparecia no Alpha 1 por $8,000 como helicóptero utilitário armado, com requisito de compra ilegível.",
    "A variante Miniguns acrescentava a função utilitária armada à família UH-1Y por só $600 acima do transporte básico capturado. Esse intervalo pequeno torna o acesso ilegível especialmente importante: sem saber armas, passageiros ou carga, não dá para afirmar que a versão armada é sempre o melhor transporte.",
    "Empregue o UH-1Y Miniguns em inserções e retiradas escoltadas quando fogo de cobertura a bordo fizer diferença. Preserve a missão de transporte em vez de perseguir um desempenho de arma ainda não verificado.",
    ["A função utilitária armada reúne a identidade de transporte da família e uma arma identificada no nome.", "Os $8,000 observados eram apenas $600 acima do UH-1Y básico.", "As duas variantes permitem comparar diretamente transporte e transporte armado."],
    ["O requisito ilegível impede comparar seu acesso ao nível Pilot registrado no UH-1Y básico.", "Quantidade de miniguns, arcos de tiro, munição, dano e exposição dos atiradores não foram capturados.", "Passageiros, carga, resistência e diferenças de pilotagem da variante armada continuam desconhecidos."],
    ["O requisito de acesso ao UH-1Y Miniguns segue sem confirmação a partir da captura Alpha ilegível.", "Armas, assentos, carga, resistência, voo e preço do UH-1Y armado podem diferir nas versões posteriores."]),
  "uh-1y": p(
    "O UH-1Y básico era um transporte aéreo de $7,400, exigindo Pilot 10 no Alpha 1.",
    "O UH-1Y era o transporte aéreo com progressão de piloto legível no catálogo capturado. Custava mais que o MH-6 de compra livre e pouco menos que o UH-1Y Miniguns. O nível Pilot 10 estava documentado, mas assentos, carga, voo, proteção e diferenças exatas da variante armada não estavam.",
    "Planeje movimentação de esquadra e viagens aéreas repetidas com o UH-1Y depois de conferir o acesso na versão ativa. Escolha zonas de pouso pela segurança do transporte, sem deduzir armamento pela falta de um nome de arma.",
    ["Transporte aéreo era sua função explícita, distinta das classes leves e armadas.", "Pilot 10 era o único requisito legível da linha Pilot no conjunto capturado.", "Os $7,400 o posicionavam entre MH-6 e UH-1Y Miniguns para comparar a família."],
    ["Pilot 10 e os $7,400 do UH-1Y básico não são regras finais de acesso confirmadas.", "Assentos, carga, modelo de voo, resistência e contramedidas não foram registrados.", "A função de transporte não comprova que o UH-1Y permaneça desarmado ou protegido em outras versões."],
    ["Nível Pilot 10 e compra de $7,400 do UH-1Y ainda carecem de confirmação no acesso antecipado ou lançamento.", "Assentos, carga, equipamento, proteção, voo e contramedidas do UH-1Y podem mudar no cliente atual."]),
  "ural-defender-m249": p(
    "O Ural Defender M249 custava $6,750 no Alpha 1 e tinha função de logística armada, com Driver 40.",
    "O Defender M249 era o topo da família Ural capturada: logística armada, Driver 40 e $6,750. Acrescentava uma arma identificada à proposta protegida do Defender. Nenhum registro, porém, mediu quanto espaço de carga, proteção ou mobilidade a montagem da M249 consome.",
    "Use o Ural Defender M249 para apoiar o transporte de suprimentos valiosos com defesa a bordo. Dê prioridade à segurança da rota e à descarga, sem desviar para combates baseados em capacidade não comprovada.",
    ["Logística armada era uma função exclusiva entre os veículos observados.", "A M249 no nome o distingue do caminhão básico e do Defender protegido.", "Driver 40 e $6,750 estavam legíveis, separando requisito de progressão e compra."],
    ["Munição, arcos, proteção, precisão e exposição do atirador da M249 não foram capturados para esse Ural.", "A capacidade de carga e a troca entre espaço logístico e armamento continuam desconhecidas.", "Driver 40 e $6,750 do Defender M249 podem mudar após o Alpha 1."],
    ["O nível Driver 40 e a compra de $6,750 do Ural Defender M249 não estão confirmados nas versões posteriores.", "Arma, carga, proteção, assentos, mobilidade e custos de operação dessa variante Ural precisam de dados atuais."]),
  "ural-defender": p(
    "O Ural Defender apareceu como logística protegida de $6,000, exigindo Driver 30 no Alpha 1.",
    "O Defender inseria uma etapa de logística protegida entre o caminhão Ural básico e a variante M249. Driver 30 e $6,000 estavam legíveis. Protegida não é, contudo, uma medida de blindagem, e faltam volume de carga, assentos, desempenho de rota e proteção adicional em relação ao Ural.",
    "Considere o Ural Defender para rotas de abastecimento de maior risco, quando a função protegida importar mais que economizar na compra do Ural básico ou levar a arma da versão M249.",
    ["Logística protegida era uma função própria do registro, não apenas transporte genérico.", "Os $6,000 posicionavam a compra entre Ural básico e Ural Defender M249.", "Driver 30 documentava a etapa de progressão da variante intermediária."],
    ["Blindagem, modelo de dano, capacidade de carga e assentos do Defender não foram capturados.", "A função protegida não confirma resistência a toda emboscada ou tipo de arma.", "Driver 30 e o preço de $6,000 pertencem à observação anterior ao lançamento."],
    ["Acesso em Driver 30 e compra de $6,000 do Ural Defender ainda não estão confirmados para versões posteriores.", "Proteção, carga, assentos, dirigibilidade, combustível, reparos e perdas do Defender podem diferir na versão atual."]),
  ural: p(
    "O Ural básico era um caminhão logístico de $5,000 após desbloqueio de $60,000 na loja Alpha 1.",
    "O Ural abria a família dedicada à logística, com compra de $5,000 e o maior desbloqueio em dinheiro visível na captura. Os $60,000 dominavam o custo de entrada daquele Alpha, sem explicar permanência do acesso ou quantificar carga, passageiros, proteção e abastecimento. A Temporada 1 registra Driver 3 e desbloqueio da linha Driver por $35,000, separados da compra recorrente do veículo.",
    "Planeje viagens de abastecimento em volume com o Ural e faça a conta separada de desbloqueio e compra. Use escolta e disciplina de rota para compensar a proteção que o registro não especifica.",
    ["Caminhão logístico era sua função explícita no Alpha, distinta do transporte comum de pessoal.", "Os $5,000 observados ficavam abaixo das duas variantes Ural Defender.", "O desbloqueio legível de $60,000 expõe uma segunda despesa importante no registro histórico."],
    ["A Temporada 1 informa Driver 3 e $35,000 para desbloquear a linha Driver; isso não é o preço de reposição do caminhão.", "Carga, carregamento, tipos de suprimento, assentos e comportamento das perdas não foram capturados.", "Não há especificações registradas de proteção, dirigibilidade, combustível, reparos ou uso fora de estrada."],
    ["A compra do Ural por $5,000 no Alpha ainda não foi verificada no acesso antecipado; o desbloqueio de $60,000 é histórico.", "Permanência do acesso, carga, interações de suprimentos, proteção, assentos e condução do Ural podem mudar na versão atual."]),
  stingray: p(
    "O Stingray é um drone antiveículo lançado do solo, visto no Beta; preço, desbloqueio e dano atuais não foram verificados.",
    "O Stingray combina lançador e controle de um drone antiveículo de ataque único; não é um veículo convencional para dirigir. O vídeo de construção do Beta fechado mostra tubo e controle portátil. Um vídeo de setembro demonstra ataques a veículos e artilharia, mas nenhum deles confirma preço atual de loja, desbloqueio, dano ou destruição garantida.",
    "Identifique um veículo valioso ou artilharia parada antes de lançar, coloque o operador em cobertura e deixe um companheiro vigiando o ponto de lançamento. O guia antigo recomenda guardar controle para as correções finais em vez de gastar todo o impulso na aproximação; teste o voo na versão atual.",
    ["O ataque remoto pode pressionar uma posição conhecida de artilharia parada ou apoio ao reaparecimento.", "Lançador e controle estão diretamente visíveis no vídeo citado de construção do Beta.", "O vídeo de setembro oferece uma demonstração mais recente do Stingray contra veículos."],
    ["O operador pode ficar exposto durante o controle; lance de uma cobertura, não de uma FOB aberta.", "Não suponha que voo, direcionamento ou dano do Beta continuam iguais na versão atual.", "Preço de compra, desbloqueio, custo de implantação e dano do Stingray não foram verificados de forma independente."],
    ["Não há captura atual de loja ou nota oficial que confirme preço, acesso, implantação ou dano do Stingray.", "O método de voo visto no Beta pode diferir dos controles e da orientação atuais do Stingray."]),
};

const labels: Readonly<Record<string, string>> = {Ammunition: "Munição", "Fire modes": "Modos de tiro", Weight: "Peso", Progression: "Progressão", "Alpha price": "Preço no Alpha", Role: "Função", "Observed gate": "Requisito observado", Track: "Linha de progressão"};
const values: Readonly<Record<string, string>> = {
  "Standard Arrows": "Flechas padrão", "12 Gauge": "Calibre 12", "Semi / Burst": "Semiautomático / rajadas", "Semi / Full Auto": "Semiautomático / automático", "Bolt-action / Magazine": "Ferrolho / carregador", "Semi automatic": "Semiautomático", "Pull and Release": "Puxar e soltar", "Assault XP": "XP de assalto", "Medic XP": "XP de médico", "Recon XP": "XP de reconhecimento", "Support XP": "XP de apoio",
  "Combat helicopter": "Helicóptero de combate", "Rocket helicopter": "Helicóptero de foguetes", "Light transport": "Transporte leve", "Fast transport": "Transporte rápido", "Anti-air armor": "Blindado antiaéreo", "Attack helicopter": "Helicóptero de ataque", "Armed transport": "Transporte armado", "Heavy armed transport": "Transporte fortemente armado", "Protected transport": "Transporte protegido", "Cargo transport": "Transporte de carga", "Utility transport": "Transporte utilitário", "Main battle tank": "Tanque de batalha", "Light air transport": "Transporte aéreo leve", "Self-propelled artillery": "Artilharia autopropulsada", "Armed utility helicopter": "Helicóptero utilitário armado", "Air transport": "Transporte aéreo", "Armed logistics": "Logística armada", "Protected logistics": "Logística protegida", "Logistics truck": "Caminhão logístico", "Open purchase": "Compra livre", Driver: "Motorista", Pilot: "Piloto", Wardog: "Wardog",
};
const sentences: Readonly<Record<string, string>> = {
  "Observed across creator footage: stabilize the platform before firing and use a manual reload sequence": "Observado em vídeos de criadores: estabilize a plataforma antes de disparar e execute a sequência de recarga manual.",
  "Observed across creator footage: driver, main-gun and top-gunner positions": "Observado em vídeos de criadores: postos de motorista, canhão principal e atirador superior.",
  "Official Season 1 Artillery Tank category: Career level 90 and $500,000 one-time unlock; model association comes from the versioned catalogue": "Categoria oficial Artillery Tank na Temporada 1: Career 90 e desbloqueio único de $500,000; a associação ao modelo vem do catálogo daquela versão.",
  "The launch tube and handheld controller are visible in the cited Closed Beta building footage.": "O tubo de lançamento e o controle portátil aparecem no vídeo citado de construção do Beta fechado.",
  "The cited September gameplay clip shows Stingray use against enemy vehicles and artillery.": "O vídeo de setembro citado mostra o Stingray contra veículos inimigos e artilharia.",
};
function translateFact(source: string): string {
  if (Object.hasOwn(sentences, source)) return sentences[source];
  const match = /^Observed in Alpha 1: ([^:]+): (.+)$/.exec(source);
  if (!match || !Object.hasOwn(labels, match[1])) throw new Error(`Missing pt-br confirmed fact: ${source}`);
  const [, label, value] = match;
  let translation = values[value];
  if (!translation && /^(?:\$[\d,]+|\d+(?:\.\d+)? kg|\d+(?:\.\d+)?x\d+mm|\.\d+ (?:Winchester|Colt|AE|Cal))$/.test(value)) translation = value;
  const gate = /^(Driver|Wardog|Pilot) Level (\d+)$/.exec(value);
  if (!translation && gate) translation = `${values[gate[1]]}, nível ${gate[2]}`;
  const unlock = /^(\$[\d,]+) unlock$/.exec(value);
  if (!translation && unlock) translation = `Desbloqueio de ${unlock[1]}`;
  if (!translation) throw new Error(`Missing pt-br fact value: ${source}`);
  return `Observado no Alpha 1: ${labels[label]}: ${translation}`;
}

const proseFields = ["summary", "description", "role", "strengths", "cautions", "confirmedFacts", "unconfirmedFacts"] as const;
// FNV-1a binds the authored translation to the reviewed source prose.
// Review changed source text before replacing a stored signature.
const sourceSignatures: Readonly<Record<string, number>> = {
  "mortar": 946147160,
  "a-91": 3564184816,
  "ak74": 1234932988,
  "amp-9": 2552907126,
  "amr-50": 52669468,
  "bmr-308": 1273688832,
  "bushmaster-m17s": 599086592,
  "compound-bow": 2629019334,
  "deagle": 1363857278,
  "fal": 3394191882,
  "galil": 2821114921,
  "ggx-17": 1608308093,
  "ggx-18": 2790174075,
  "judge": 3343345660,
  "kh-2002": 4103215550,
  "ah-6m-miniguns": 2410786903,
  "ah-6r-rockets": 1068931827,
  "bobcat": 463663693,
  "dune-buggy": 1684686213,
  "flakpanzer-gepard": 174352401,
  "havoc": 3507696841,
  "humvee-m249": 4122572175,
  "humvee-minigun": 2916947329,
  "humvee": 453603387,
  "kodiak-m249": 1733401081,
  "kodiak-pickup": 531206343,
  "kodiak": 2453781162,
  "l2a6": 1845948473,
  "mh-6": 288104274,
  "sph-2": 1067568384,
  "uh-1y-miniguns": 1247177127,
  "uh-1y": 1754700448,
  "ural-defender-m249": 2859494211,
  "ural-defender": 4210406545,
  "ural": 293740691,
  "stingray": 2044688453,
};
function sourceSignature(item: WardogsItem): number {
  const source = JSON.stringify([item.name, item.type, item.subtype, ...proseFields.map((field) => item[field])]);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  return hash >>> 0;
}

export function localizeItemProsePtBr(item: WardogsItem): ItemProse {
  if (!Object.hasOwn(authored, item.slug)) throw new Error(`Missing pt-br item prose: ${item.slug}`);
  if (sourceSignature(item) !== sourceSignatures[item.slug]) throw new Error(`Stale pt-br item prose: ${item.slug}`);
  return {...authored[item.slug], confirmedFacts: item.confirmedFacts?.map(translateFact)};
}
