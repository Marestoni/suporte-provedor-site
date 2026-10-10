"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, enviarMensagem, type Situacao } from "@/lib/api";
import { MessageBubble, type Mensagem } from "@/components/MessageBubble";

interface Props {
  conversaId: string;
  token: string;
  nome: string;
  situacao: Situacao;
}

export function Chat({ conversaId, token, nome, situacao }: Props) {
  const bloqueado = situacao === "bloqueado_inadimplencia";
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      papel: "assistant",
      texto: bloqueado
        ? `Olá, ${nome}! Sua conexão está suspensa por fatura em aberto. Posso enviar a segunda via ou ver um desbloqueio em confiança. Como prefere?`
        : `Olá, ${nome}! Como posso ajudar? Posso enviar a segunda via, verificar sua conexão ou abrir uma visita técnica.`,
    },
  ]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [encerrada, setEncerrada] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: "end" });
  }, [mensagens, enviando]);

  async function enviar(conteudo: string) {
    const t = conteudo.trim();
    if (!t || enviando || encerrada) return;
    setErro(null);
    setTexto("");
    setMensagens((m) => [...m, { papel: "user", texto: t }]);
    setEnviando(true);
    try {
      const r = await enviarMensagem(conversaId, token, t);
      setMensagens((m) => [...m, { papel: "assistant", texto: r.resposta }]);
      if (r.protocolo) setProtocolo(r.protocolo);
      if (r.status !== "aberta") setEncerrada(true);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Algo deu errado. Tente novamente.");
      if (e instanceof ApiError && e.status === 409) {
        setEncerrada(true);
      } else {
        // Não foi processada: tira o balão otimista e devolve o texto ao campo para reenviar sem redigitar.
        setMensagens((m) => m.slice(0, -1));
        setTexto(t);
      }
    } finally {
      setEnviando(false);
    }
  }

  const sugestoes = bloqueado
    ? ["Quero a segunda via", "Quero o desbloqueio em confiança"]
    : ["Quero a segunda via", "Minha internet está lenta", "Estou sem internet"];

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold">Atendimento</h1>
        {protocolo && (
          <p className="text-sm text-muted">
            Chamado aberto: <strong className="text-foreground">{protocolo}</strong>
          </p>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Conversa">
        <ul className="flex flex-col gap-3">
          {mensagens.map((m, i) => (
            <li key={i}>
              <MessageBubble mensagem={m} />
            </li>
          ))}
          {enviando && (
            <li className="text-sm text-muted" aria-label="Digitando">
              Digitando...
            </li>
          )}
        </ul>
        <div ref={fimRef} />
      </div>

      <footer className="border-t border-border bg-background px-4 py-3">
        {erro && (
          <p role="alert" className="mb-2 text-sm text-red-700 dark:text-red-300">
            {erro}
          </p>
        )}

        {encerrada ? (
          <p className="text-sm text-muted">
            Este atendimento foi encerrado. Um atendente dará continuidade, se necessário.
          </p>
        ) : (
          <>
            {mensagens.length <= 1 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {sugestoes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => enviar(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                enviar(texto);
              }}
            >
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={1000}
                placeholder="Digite sua mensagem"
                aria-label="Mensagem"
                className="h-12 flex-1 rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-2 focus-visible:outline-brand"
              />
              <button
                type="submit"
                disabled={enviando || !texto.trim()}
                className="h-12 rounded-xl bg-brand px-5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Enviar
              </button>
            </form>
          </>
        )}
      </footer>
    </div>
  );
}
