
"use strict";

// Portal Utilidades — Privacidade e Google Analytics 4

const PRIVACY_CONFIG = {
    storageKey: "rentabilidade_analytics_consent",
    measurementId: "G-Z8RGKSKD23"
};

document.addEventListener("DOMContentLoaded", () => {
    iniciarPrivacidade();
});

function iniciarPrivacidade() {
    const aviso = document.getElementById("aviso-privacidade");
    const aceitar = document.getElementById("aceitar-analytics");
    const recusar = document.getElementById("recusar-analytics");
    const configuracoes = document.getElementById("abrir-privacidade");

    if (!aviso || !aceitar || !recusar || !configuracoes) {
        console.error("Elementos de privacidade não encontrados.");
        return;
    }

    let analyticsCarregado = false;
    const preferencia = localStorage.getItem(
        PRIVACY_CONFIG.storageKey
    );

    function carregarAnalytics() {
        if (analyticsCarregado) return;

        analyticsCarregado = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        // Consent Mode v2
        window.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });

        window.gtag("js", new Date());

        window.gtag("consent", "update", {
            analytics_storage: "granted"
        });

        window.gtag("config", PRIVACY_CONFIG.measurementId);

        const script = document.createElement("script");
        script.async = true;
        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(PRIVACY_CONFIG.measurementId);

        document.head.appendChild(script);
    }

    function salvarPreferencia(valor) {
        localStorage.setItem(PRIVACY_CONFIG.storageKey, valor);
        aviso.hidden = true;

        if (valor === "accepted") {
            carregarAnalytics();
        } else if (analyticsCarregado) {
            // Interrompe a coleta e reinicia sem carregar GA4.
            window.gtag?.("consent", "update", {
                analytics_storage: "denied"
            });

            removerCookiesAnalytics();
            window.location.reload();
        }
    }

    function removerCookiesAnalytics() {
        document.cookie.split(";").forEach((item) => {
            const nome = item.split("=")[0].trim();

            if (nome === "_ga" || nome.startsWith("_ga_")) {
                document.cookie =
                    nome + "=; Max-Age=0; path=/; SameSite=Lax";
            }
        });
    }

    aceitar.addEventListener("click", () => {
        salvarPreferencia("accepted");
    });

    recusar.addEventListener("click", () => {
        salvarPreferencia("rejected");
    });

    configuracoes.addEventListener("click", () => {
        aviso.hidden = false;
    });

    if (preferencia === "accepted") {
        carregarAnalytics();
        aviso.hidden = true;
    } else if (preferencia === "rejected") {
        aviso.hidden = true;
    } else {
        aviso.hidden = false;
    }
}
