"use strict";

function numeroAleatorio(qt) {
  return Math.round(Math.random() * qt);
}

const QUADRADOS = document.querySelectorAll(".linha");
const POPUP = document.querySelector(".popupBg");
const POPUP_MENSAGEM = POPUP.querySelector(".mensagem");
const POPUP_BOTAO_REINICIA_JOGO = POPUP.querySelector("#botaoJogarNovamente");
const BOTAO_ATIVACPU1 = document.querySelector("#botaoAtivaCPU1");
const BOTAO_ATIVACPU2 = document.querySelector("#botaoAtivaCPU2");

const PONTUACAO_JOGADORES = document.querySelectorAll(".pontuacaoJogadores");

let vencedorPartida = 0;
let vezDoJogador = 1;
const PONTUACAO = [0, 0];
const TABULEIRO = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const SEQUENCIA_VITORIA = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

function marcaQuadrado(quadrado, jogador) {
  const item = QUADRADOS[quadrado];
  if (item.getAttribute("marcado") === "true") {
    return;
  }
  item.setAttribute("marcado", "true");
  item.classList.add(`jogador${jogador}`);
  vezDoJogador = vezDoJogador === 1 ? 2 : 1; // passa a vez para o proximo jogador.

  TABULEIRO[quadrado] = jogador;

  const RESULTADO = verificaGanhador(jogador);

  mostraJanelaFimDoJogo(RESULTADO);
}

function abreFechaPopUp() {
  if (POPUP && (vencedorPartida !== 0 || vencedorPartida === 3)) {
    POPUP.classList.toggle("oculto");
  }
}

function mostraJanelaFimDoJogo(resultado) {
  if (!resultado) {
    return;
  }

  abreFechaPopUp();

  if (resultado === 3) {
    POPUP_MENSAGEM.textContent = "OPS! Deu Velha!!!";
    return;
  }

  POPUP_MENSAGEM.textContent = `O JOGADOR ${resultado}, ganhou a partida.`;

  definePontuacao(resultado);
}

function definePontuacao(jogador) {
  const NUMERO_JOGADOR = jogador - 1;
  PONTUACAO[NUMERO_JOGADOR]++;
  PONTUACAO_JOGADORES[NUMERO_JOGADOR].textContent = PONTUACAO[NUMERO_JOGADOR];
}

function jogarNovamente() {
  abreFechaPopUp();
  TABULEIRO.fill(0);
  vencedorPartida = 0;
  QUADRADOS.forEach((quadrado) => {
    quadrado.classList.remove("jogador1");
    quadrado.classList.remove("jogador2");
    quadrado.removeAttribute("marcado");
  });
}

function verificaGanhador(jogador) {
  let vencedor;
  SEQUENCIA_VITORIA.forEach((sequencia) => {
    if (
      TABULEIRO[sequencia[0]] === jogador &&
      TABULEIRO[sequencia[1]] === jogador &&
      TABULEIRO[sequencia[2]] === jogador
    ) {
      console.log(`Jogador${jogador} ganhou`);
      vencedor = jogador;
      vencedorPartida = jogador;
    }
  });

  if (TABULEIRO.includes(0) === false && !vencedor) {
    console.log("Deu Veia!");
    vencedorPartida = 3;
    return 3; // deu velha
  }

  return vencedor;
}

QUADRADOS.forEach((quadrado, pos) => {
  quadrado.addEventListener("click", function () {
    marcaQuadrado(pos, vezDoJogador);
  });
});

function statusCPU(cpuNum) {
  const cpuAtivada = localStorage.getItem(`cpuAtivada${cpuNum}`) || "false";

  const BOTAO_ATIVACPU = document.querySelector(`#botaoAtivaCPU${cpuNum}`);

  if (cpuAtivada === "true") {
    BOTAO_ATIVACPU.classList.remove("botaoDesativado");
    return;
  }
  BOTAO_ATIVACPU.classList.add("botaoDesativado");
}

function ativaDesativaCPU(cpuNum) {
  if (confirm("Ativar ou desativar o CPU vai reiniciar o jogo. Tem certeza?")) {
    jogarNovamente();
  } else {
    return;
  }
  localStorage.setItem(
    `cpuAtivada${cpuNum}`,
    localStorage.getItem(`cpuAtivada${cpuNum}`) === "true" ? "false" : "true"
  );
  statusCPU(1);
  statusCPU(2);
}

function cpu(cpuNum) {
  if (
    localStorage.getItem(`cpuAtivada${cpuNum}`) === "false" ||
    !localStorage.getItem(`cpuAtivada${cpuNum}`)
  ) {
    return;
  }

  if (vezDoJogador != cpuNum || vencedorPartida != 0) {
    return;
  }

  function atacar() {
    let quadro;

    SEQUENCIA_VITORIA.forEach((sequencia) => {
      if (
        TABULEIRO[sequencia[0]] === cpuNum &&
        TABULEIRO[sequencia[1]] === cpuNum &&
        TABULEIRO[sequencia[2]] === 0
      ) {
        quadro = sequencia[2];
      }
      if (
        TABULEIRO[sequencia[0]] === cpuNum &&
        TABULEIRO[sequencia[1]] === 0 &&
        TABULEIRO[sequencia[2]] === cpuNum
      ) {
        quadro = sequencia[1];
      }
      if (
        TABULEIRO[sequencia[0]] === 0 &&
        TABULEIRO[sequencia[1]] === cpuNum &&
        TABULEIRO[sequencia[2]] === cpuNum
      ) {
        quadro = sequencia[0];
      }
    });

    if (quadro) {
      marcaQuadrado(quadro, vezDoJogador);
      console.log("CPU " + cpuNum + ": ataque Intencional: " + quadro);
    } else {
      defender();
    }
  }

  function defender() {
    let quadro;

    const oponente = cpuNum == 1 ? 2 : 1;

    SEQUENCIA_VITORIA.forEach((sequencia) => {
      if (
        TABULEIRO[sequencia[0]] === oponente &&
        TABULEIRO[sequencia[1]] === oponente &&
        TABULEIRO[sequencia[2]] === 0
      ) {
        quadro = sequencia[2];
      }
      if (
        TABULEIRO[sequencia[0]] === oponente &&
        TABULEIRO[sequencia[1]] === 0 &&
        TABULEIRO[sequencia[2]] === oponente
      ) {
        quadro = sequencia[1];
      }
      if (
        TABULEIRO[sequencia[0]] === 0 &&
        TABULEIRO[sequencia[1]] === oponente &&
        TABULEIRO[sequencia[2]] === oponente
      ) {
        quadro = sequencia[0];
      }
    });

    if (quadro) {
      marcaQuadrado(quadro, vezDoJogador);
      console.log("CPU " + cpuNum + ": defesa Intencional: " + quadro);
    } else {
      marcaAleatoriamente();
    }
  }

  function marcaAleatoriamente() {
    const quadradosVazio = [];

    TABULEIRO.forEach((quadrado, index) => {
      if (quadrado == 0) {
        quadradosVazio.push(index);
      }
    });

    const numAleatorio = quadradosVazio[numeroAleatorio(quadradosVazio.length-1)];
    
    if (TABULEIRO[numAleatorio] != 0) {
      console.log("CPU " + cpuNum + ": numero ja marcado");
      return false;
    }

    marcaQuadrado(numAleatorio, vezDoJogador);
    console.log("CPU " + cpuNum + ": jogada Aleatoria: " + numAleatorio);
  }
  atacar();
}

setInterval(function () {
  setTimeout(function () {
    cpu(1);
  }, 500);
  setTimeout(function () {
    cpu(2);
  }, 1000);
}, 1000);

BOTAO_ATIVACPU1.addEventListener("click", function () {
  ativaDesativaCPU(1);
});
BOTAO_ATIVACPU2.addEventListener("click", function () {
  ativaDesativaCPU(2);
});
window.addEventListener("load", function () {
  statusCPU(1);
  statusCPU(2);
});

POPUP_BOTAO_REINICIA_JOGO.addEventListener("click", function () {
  jogarNovamente();
});
