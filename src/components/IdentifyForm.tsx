"use client";

import { useState } from "react";

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

interface Props {
  onSubmit: (cpf: string, nascimento: string) => void;
  erro: string | null;
  carregando: boolean;
}

export function IdentifyForm({ onSubmit, erro, carregando }: Props) {
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const valido = cpf.replace(/\D/g, "").length === 11 && nascimento !== "";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Vamos confirmar seus dados</h1>
        <p className="text-muted">Para sua segurança, informe seu CPF e sua data de nascimento.</p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valido && !carregando) onSubmit(cpf.replace(/\D/g, ""), nascimento);
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          CPF
          <input
            value={cpf}
            onChange={(e) => setCpf(maskCpf(e.target.value))}
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            className="h-12 rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-2 focus-visible:outline-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Data de nascimento
          <input
            type="date"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            autoComplete="off"
            className="h-12 rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-2 focus-visible:outline-brand"
          />
        </label>

        {erro && (
          <p role="alert" className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={!valido || carregando}
          className="h-12 rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand-dark disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {carregando ? "Verificando..." : "Continuar"}
        </button>
      </form>
    </main>
  );
}
