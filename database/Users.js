let mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  id: { type: String },
  assinaturas: {
    all: { type: Array, default: [] },
    now: { type: String, default: "None" },
    endIn: { type: String },
  },
  exp: {
    nivel: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
  },
  onnycoins: { type: Number, default: 0 },
  onnycash: { type: Number, default: 0 },
  description: {
    type: String,
    default: "Não sabemos muito sobre essa pessoa!",
  },
  rep: {
    amigavel: { type: Number, default: 0 },
  },
  profile: {
    banners: {
      obtained: { type: Array, default: ["PADRAO"] },
      equipped: { type: String, default: "PADRAO" },
    },
    titles: {
      obtained: { type: Array, default: ["USUARIO"] },
      equipped: { type: String, default: "USUARIO" },
    },
    badges: {
      obtained: { type: Array, default: [] },
      equipped: { type: Array, default: [] },
    },
  },
  onnyWorld: {
    itens: { type: Array, default: [] },
    pdr: { type: Number, default: 0 },
    class: { type: String },
    /**
     *
     *  Samurai - Um guerreiro habilidoso, leal e honrado, que domina a arte da espada e segue um código rigoroso de conduta.
     *  [1] Ganha um escudo equivalente a 50% do dano sofrido no último round.
     *  [2] Redução de cooldown equivalente a 20% do tempo total do combate.
     *  [3] Carregar golpe poderoso que pode causar sangramento.
     *  [Z] Neutraliza o inimigo por 1 round e recebe escudo equivalente a 10% da vida máxima.
     *  [PASSIVA] Caminho da Lâmina: A destreza incomparável do Samurai com sua espada é ampliada em combate.
     *  A cada terceiro ataque básico consecutivo em um mesmo alvo, o Samurai desfere um golpe poderoso, causando dano adicional equivalente a 200% do dano básico.
     *
     *  Shinobi - Um assassino especializado em técnicas furtivas, conhecido por sua agilidade e habilidades de camuflagem.
     *  [Hibrido (75% Melee [Q] [W] [E]) (25% Ranged [R])] [Dano Físico]
     *  [1] Dano + Desvia da proxima skill do inimigo caso não seja target.
     *  [2] Torna-se ivulneravel por 1 round.
     *  [3] Caso desvie de uma skill pode devolver o dano e usar [Q] [W] ou [R]
     *  [Z] Usa sua sombra e seu dano é duplicado até o fim do desafio.
     *  [PASSIVA] Graça da Sombra: A agilidade e habilidades furtivas do Shinobi lhe permitem desviar de ataques inimigos com facilidade.
     *  A cada 3 esquivas bem-sucedidas consecutivas, o tempo de recarga de suas habilidades é resetado. Esse efeito pode ser acumulado até 3 vezes em combate.
     *
     *  ⚠ Caso Kannushi seja escolhido em modos de combate 1v1 os efeitos são dados para ele mesmo.
     *  Kannushi - Um sacerdote sagrado que invoca os poderes divinos para proteger e fortalecer sua equipe.
     *  [1]
     *  [2]
     *  [3]
     *  [Z]
     *  [PASSIVA] Benção Divina: A conexão espiritual do Kannushi com os deuses o torna capaz de abençoar seus aliados.
     *  A cada 30 segundos, ele pode conceder uma bênção a um aliado, aumentando sua velocidade de ataque e velocidade de conjuração, pode conjurar 2 habilidades do round.
     *
     *  Tengu-Ken - Um mestre de lanças, especializado em técnicas de combate à distância e velocidade.
     *  [1]
     *  [2]
     *  [3]
     *  [Z]
     *  [PASSIVA] A maestria do Tengu-Ken com a lança lhe permite atacar com velocidade e precisão.
     *  Cada terceiro ataque básico Tengu-Ken estrassalha seu oponente causando sangramento e dano equivalente a 2% da vida atual.
     *
     *  PROXIMAS CLASSES A SEREM LIBERADAS:
     *  Shugoki    : Um guerreiro imenso e poderoso, especializado em combate corpo a corpo e resistência, inspirado nos lendários Oni.
     *  Kijo       : Uma classe mística, capaz de canalizar a energia negativa dos Oni para lançar feitiços sombrios e causar danos devastadores aos inimigos.
     *  Koi-Koi    : Uma classe inspirada na lenda do Koi, que usa a força e a determinação do peixe para resistir a ataques e se tornar cada vez mais poderoso.
     *  Tengu-Ken  : Um mestre de lanças, especializado em técnicas de combate à distância e velocidade.
     *
     */
    stats: {
      life: {
        max: { type: Number },
        regeneration: { type: Number } /** [0.5%/s] */,
        shield: {
          min: { type: Number } /** [60 Base] */,
          max: { type: Number },
          cooldown: { type: Number } /** [8s] */,
          teamheal: { type: String } /** [True] [False] */,
        },
      },
      armor: {
        fisic: { type: Number } /** [45 Base] */,
        magic: { type: Number } /** [30 Base] */,
      },
      damage: {
        fisic: { type: Number } /** [78 Base] */,
        magic: { type: Number } /** [52 Base] */, // Miketsu tem danos convertidos em Teamheal e Shield.
        cooldown: { type: Number } /** [5s] */,
      },
      furtividade: { type: Number } /** % value */,
      range: { type: String } /** [Melee] [Ranged] [Hibrido] */,
      item_effects: { type: Array, default: [] } /** [5.2% Lifesteal] */,
    },
  },
  language: { type: String, default: "pt-BR" },
});

module.exports = mongoose.model("User", userSchema, "user");
