"use client";

import { useState } from "react";
import { ApiError, criarConversa, identificar, type Identificado } from "@/lib/api";
import { Chat } from "@/components/Chat";
import { IdentifyForm } from "@/components/IdentifyForm";

interface Sessao {
  conversaId: string;
  ident: Identificado;
}

/** Etapa 1: identificação (CPF + nascimento). Etapa 2: chat. Token só em memória (nunca em storage/URL). */
export function ChatApp() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [conversaId, setConversaId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(cpf: string, nascimento: string) {
    setErro(null);
    setCarregando(true);
    try {
      const id = conversaId ?? (await criarConversa());
      setConversaId(id);
      const ident = await identificar(id, cpf, nascimento);
      setSessao({ conversaId: id, ident });
    } catch (e) {
      if (e instanceof ApiError && (e.status === 429 || e.status === 404)) setConversaId(null);
      setErro(e instanceof ApiError ? e.message : "Algo deu errado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (sessao) {
    return (
      <Chat conversaId={sessao.conversaId} token={sessao.ident.token} nome={sessao.ident.nome} situacao={sessao.ident.situacao} />
    );
  }

  return <IdentifyForm onSubmit={entrar} erro={erro} carregando={carregando} />;
}
