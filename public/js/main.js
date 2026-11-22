
"use strict";

// Portal Utilidades — JavaScript principal

document.addEventListener("DOMContentLoaded", () => {
    atualizarAno();
    configurarBusca();
});

// Atualiza automaticamente o ano do rodapé.
function atualizarAno() {
    const elementoAno = document.getElementById("ano-atual");

    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
}

// Configura a pesquisa dinâmica dos cartões.

function configurarBusca() {
    const campoBusca = document.getElementById("busca-ferramentas");
    const lista = document.getElementById("lista-ferramentas");
    const mensagemVazia = document.getElementById("busca-sem-resultados");

    if (!campoBusca || !lista || !mensagemVazia) {
        return;
    }

    const cartoes = Array.from(lista.querySelectorAll(".tool-card"));

    let temporizadorBusca = null;

    campoBusca.addEventListener("input", () => {
        const termo = normalizarTexto(campoBusca.value);
        let encontrados = 0;

        cartoes.forEach((cartao) => {
            const conteudo = normalizarTexto(
                `${cartao.querySelector("h3")?.textContent || ""}
                 ${cartao.querySelector("p")?.textContent || ""}`
            );

            const corresponde = conteudo.includes(termo);

            cartao.hidden = !corresponde;

            if (corresponde) {
                encontrados++;
            }
        });

        mensagemVazia.hidden = encontrados > 0;

        // Evita registrar um evento a cada tecla digitada.
        clearTimeout(temporizadorBusca);

        // Não registra pesquisas vazias.
        if (!termo) {
            return;
        }

        temporizadorBusca = setTimeout(() => {
            // A coleta só ocorre após consentimento.
            let consentimento = null;

            try {
                consentimento = localStorage.getItem(
                    "rentabilidade_analytics_consent"
                );
            } catch (erro) {
                return;
            }

            if (
                consentimento !== "accepted" ||
                typeof window.gtag !== "function"
            ) {
                return;
            }

            window.gtag("event", "tool_search", {
                search_results_count: encontrados,
                search_has_results: encontrados > 0,
                search_term_length: termo.length
            });
        }, 800);
    });
}

// Permite pesquisar sem diferenciar acentos e maiúsculas.
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}
