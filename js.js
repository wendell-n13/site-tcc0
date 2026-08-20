document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  const botao = document.getElementById("chat-enviar");
  const mensagensBox = document.getElementById("chat-mensagens");

  if (!input || !botao || !mensagensBox) return;

  function adicionarMensagem(texto, remetente) {
    const div = document.createElement("div");
    div.style.padding = "10px 14px";
    div.style.borderRadius = "12px";
    div.style.maxWidth = "80%";
    div.style.lineHeight = "1.5";
    div.style.wordBreak = "break-word";

    if (remetente === "usuario") {
      div.style.background = "var(--rose)";
      div.style.color = "#2A1A18";
      div.style.alignSelf = "flex-end";
    } else {
      div.style.background = "var(--bg-soft-2)";
      div.style.color = "var(--cream)";
      div.style.alignSelf = "flex-start";
    }

    div.textContent = texto;
    mensagensBox.appendChild(div);
    mensagensBox.scrollTop = mensagensBox.scrollHeight;
  }

  async function enviarMensagem() {
    const textoPergunta = input.value.trim();
    if (!textoPergunta) return;

    adicionarMensagem(textoPergunta, "usuario");
    input.value = "";

    const idEspera = "carregando-" + Date.now();
    const divEspera = document.createElement("div");
    divEspera.id = idEspera;
    divEspera.style.cssText = "background: var(--bg-soft-2); padding: 10px 14px; border-radius: 12px; max-width: 80%; align-self: flex-start; color: var(--cream); opacity: 0.7;";
    divEspera.textContent = "Acolhendo sua dúvida...";
    mensagensBox.appendChild(divEspera);
    mensagensBox.scrollTop = mensagensBox.scrollHeight;

    try {
      const SUA_API_KEY_GROQ = "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"; 
      const url = "https://api.groq.com/openai/v1/chat/completions";
      
      const promptComportamento = "Você é a assistente virtual acolhedora de um site de saúde mental voltado para mulheres chamado 'Entre nós, Mulheres'. Responda de forma empática, curta e humanizada. Se houver risco de vida, lembre sempre do CVV (188).";

      const dadosEnvio = {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: promptComportamento },
          { role: "user", content: textoPergunta }
        ]
      };

      const resposta = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUA_API_KEY_GROQ}`
        },
        body: JSON.stringify(dadosEnvio)
      });

      const resultado = await resposta.json();
      document.getElementById(idEspera).remove();

      if (resultado.choices && resultado.choices[0].message) {
        const textoResposta = resultado.choices[0].message.content;
        adicionarMensagem(textoResposta, "ia");
      } else if (resultado.error) {
        adicionarMensagem("Erro da API: " + resultado.error.message, "ia");
      } else {
        adicionarMensagem("Recebido, mas formato inesperado.", "ia");
      }

    } catch (erro) {
      document.getElementById(idEspera).remove();
      console.error("Erro técnico:", erro);
      adicionarMensagem("Erro de conexão.", "ia");
    }
  }

  botao.addEventListener("click", enviarMensagem);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });
});