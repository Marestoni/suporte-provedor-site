"use client";

import { useState } from "react";

export interface Mensagem {
  papel: "user" | "assistant";
  texto: string;
}

/** Códigos longos sem espaço (PIX copia e cola, linha digitável) ganham botão "Copiar". */
const CODIGO = /([A-Za-z0-9._\-/+=:*]{40,})/g;

function CopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard indisponível: o código segue selecionável no texto */
    }
  }

  return (
    <span className="my-1 flex flex-col gap-1">
      <code className="break-all rounded-lg bg-black/10 px-2 py-1 text-xs dark:bg-white/10">{codigo}</code>
      <button
        type="button"
        onClick={copiar}
        className="self-start rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
      >
        {copiado ? "Copiado!" : "Copiar"}
      </button>
    </span>
  );
}

export function MessageBubble({ mensagem }: { mensagem: Mensagem }) {
  const usuario = mensagem.papel === "user";
  // Sempre renderizado como texto (React escapa); nada de HTML vindo do agente.
  const partes = mensagem.texto.split(CODIGO);

  return (
    <div className={`flex ${usuario ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
          usuario ? "bg-brand text-white" : "border border-border bg-card"
        }`}
      >
        {partes.map((p, i) => (i % 2 === 1 ? <CopiarCodigo key={i} codigo={p} /> : <span key={i}>{p}</span>))}
      </div>
    </div>
  );
}
