window.onload = function () {

  const textEl = document.getElementById("text");
  const choicesEl = document.getElementById("choices");
  const flash = document.getElementById("flash");
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  const music = document.getElementById("bg-music");

  let state = {};

  // ---------- MÚSICA ----------
  function startMusic() {
    if (music) {
      music.volume = 0.4;
      music.play().catch(() => {});
    }
  }

  // ---------- CANVAS ----------
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ---------- PARTÍCULAS ----------
  let particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5,
      speed: Math.random() * 2,
      color: Math.random() > 0.5 ? "#167fbb" : "#004277"
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speed;
      p.x += Math.sin(Date.now() * 0.002 + p.y) * 0.8;

      if (p.y < 0) p.y = canvas.height;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ---------- TEXTO ----------
  function typeText(text, callback) {
    textEl.style.opacity = 0;
    textEl.innerHTML = "";

    let i = 0;

    setTimeout(() => {
      textEl.style.opacity = 1;

      let interval = setInterval(() => {

        if (i < text.length) {
          textEl.innerHTML += text[i];
          i++;
        }

        if (i >= text.length) {
          clearInterval(interval);
          if (callback) callback();
        }

      }, 25);

    }, 200);
  }

  // ---------- EFEITO DE "TEMPO" ----------
  function timeFlash(callback) {
    flash.style.opacity = 1;

    setTimeout(() => {
      flash.style.opacity = 0;
      if (callback) setTimeout(callback, 150);
    }, 120);
  }

  // ---------- ESCOLHAS ----------
  function showChoices(options) {
    choicesEl.innerHTML = "";

    options.forEach(opt => {
      let btn = document.createElement("button");
      btn.innerText = opt.text;

      btn.onclick = () => {
        startMusic();
        choicesEl.innerHTML = "";

        if (opt.setState) opt.setState();

        timeFlash(opt.action);
      };

      choicesEl.appendChild(btn);
    });
  }

  // ---------- INÍCIO ----------
  function start() {
    typeText(
      "Eu sabia que você viria...\n\n" +
      "Mas eu não imaginava\n\n" +
      "Que seria tão rápido.",
      () => {
        showChoices([
          { text: "Jogar", action: pergunta1 }
        ]);
      }
    );
  }

  // ---------- PERGUNTA 1 ----------
  function pergunta1() {
    typeText(
      "Você estava ansiosa por esse jogo ?\n\n" +
      "Perguntinha leve pra começar...",
      () => {
        showChoices([
          {
            text: "Eu estava...",
            setState: () => state.memoria = "profunda",
            action: pergunta2
          },
          {
            text: "Mais ou menos, ainda estou decidindo.",
            setState: () => state.memoria = "leve",
            action: pergunta2
          },
          {
            text: "Não estava, me surpreeenda.",
            setState: () => state.memoria = "evasiva",
            action: pergunta2
          }
        ]);
      }
    );
  }

  // ---------- PERGUNTA 2 ----------
  function pergunta2() {
    typeText(
      "Como está sendo estar tão ligada a alguém ?\n\n" +
      "Você está se sentindo bem ?",
      () => {
        showChoices([
          {
            text: "Sim, me sinto muito bem com isso.",
            setState: () => state.defesa = "aberta",
            action: pergunta3
          },
          {
            text: "Mais ou menos, tem dias que é difícil.",
            setState: () => state.defesa = "meio",
            action: pergunta3
          },
          {
            text: "Não sei, as vezes me sinto sufocada.",
            setState: () => state.defesa = "fechada",
            action: pergunta3
          }
        ]);
      }
    );
  }

  // ---------- PERGUNTA 3 ----------
  function pergunta3() {
    typeText(
      "É verdade que você se sente confortavel comigo ?\n\n" +
      "Você se sente segura ao meu lado?",
      () => {
        showChoices([
          {
            text: "Sim, gosto muito de estar com você.",
            setState: () => state.identidade = "real",
            action: pergunta4
          },
          {
            text: "Nem sei, as vezes me sinto meio perdida.",
            setState: () => state.identidade = "confusa",
            action: pergunta4
          }
        ]);
      }
    );
  }

  // ---------- PERGUNTA 4 ----------
  function pergunta4() {
    typeText(
      "Se você pudesse escolher...\n\n" +
      "O que seria o presente que gira ?",
      () => {
        showChoices([
          {
            text: "Um presente bobo...",
            setState: () => state.desejo = "entendido",
            action: final
          },
          {
            text: "Um presente significativo...",
            setState: () => state.desejo = "amado",
            action: final
          }
        ]);
      }
    );
  }

  // ---------- FINAIS ----------
  // ---------- REWIND (VOLTAR NO TEMPO) ----------
function rewindEffect(callback) {
  let rewindTime = 1200;
  let start = Date.now();

  function rewindFrame() {
    let elapsed = Date.now() - start;

    // inverter movimento das partículas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speed * 2; // descendo (invertido)
      p.x -= Math.sin(Date.now() * 0.002 + p.y) * 1.5;

      if (p.y > canvas.height) p.y = 0;

      ctx.fillStyle = "#93c5fd";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // glitch no texto
    textEl.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;

    if (elapsed < rewindTime) {
      requestAnimationFrame(rewindFrame);
    } else {
      textEl.style.transform = "translate(0,0)";
      flash.style.opacity = 1;

      setTimeout(() => {
        flash.style.opacity = 0;
        if (callback) callback();
      }, 150);
    }
  }

  rewindFrame();
}
 function final() {

  let texto = "";

  // FINAL 1
  if (state.memoria === "profunda" && state.defesa === "aberta") {
    texto =
      "Parabéns, você chegou ao final do jogo...\n\n" +
      "Peço perdão, não pensei muito bem nas perguntas.\n\n" +
      "Na verdade esse jogo é só para eu ganhar tempo\n\n" +
      " E agora que vc sabe, talvez perca o brilho.\n\n" +
      "mas o final vai ser bom... Eu acho.";
  }

  // FINAL 2
  else if (state.defesa === "fechada") {
    texto =
      "Ding DIng Ding\n\n" +
      "Novo record batido \n\n" +
      "Temos uma campeã.\n\n" +
      "E como recompensa...\n\n" +
      "Nada !!!!!.";
  }

  // FINAL 3
  else if (state.identidade === "confusa") {
    texto =
      "Eu sei que é dificil me aturar mas eu juro que sou legal\n\n" +
      "E vou te provar com o tempo...\n\n" +
      "Asim como espero já estar fazendo...\n\n" +
      "E para mostrar isso... Uma recompensa.";
  }

  // FINAL 4
  else if (state.desejo === "amado") {
    texto =
      "Primeiro, eu te amo...\n\n" +
      "Mas você sabe disso.\n\n" +
      "O que você não sabe é que eu tenho muito o que te falar.\n\n" +
      "E para saber... É só me perguntar, mas vc não tem coragem.\n\n" +
      "E no dia que tiver em dúvida sobre algo, me pergunte, eu vou te responder.\n\n" +
      "E para mostrar isso... Te ofereço uma recompensa.";
  }

  else {
    texto =
      "Algumas escolhas não têm resposta certa.\n\n" +
      "O vento pode nos soprar para qualquer lado.\n\n" + 
      "Porém, como um bom marinheiro que sou, eu sempre voarei em sua direção\n\n" +
      "E para mostrar isso... Te ofereço uma recompensa.";
  }

 typeText(texto, () => {
  setTimeout(() => {

    rewindEffect(() => {
      window.location.href = "mensagem.html";
    });

  }, 6000);
});

  document.title = "se eu voltasse...";
};

  start();
};