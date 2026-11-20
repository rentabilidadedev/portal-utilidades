
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
