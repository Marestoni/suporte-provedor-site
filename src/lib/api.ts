const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5180";

export type Situacao = "ativo" | "bloqueado_inadimplencia" | "liberado_em_confianca" | "suspenso" | "cancelado";

export interface Identificado {
  token: string;
  nome: string;
  situacao: Situacao;
}

export interface Resposta {
  resposta: string;
  status: "aberta" | "encerrada" | "transferida_humano";
  protocolo: string | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError(0, "Sem conexão com o atendimento. Verifique sua internet e tente de novo.");
  }
  if (!res.ok) {
    // A API devolve erros em ProblemDetails (RFC 7807); a mensagem ao cliente vai em "detail".
    const corpo = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new ApiError(res.status, corpo?.detail ?? "Algo deu errado. Tente novamente.");
  }
  return (await res.json()) as T;
}

export async function criarConversa(): Promise<string> {
  const r = await request<{ id: string }>("/api/conversas", { method: "POST" });
  return r.id;
}

export function identificar(id: string, cpf: string, dataNascimento: string) {
  return request<Identificado>(`/api/conversas/${id}/identificar`, {
    method: "POST",
    body: JSON.stringify({ cpf, dataNascimento }),
  });
}

export function enviarMensagem(id: string, token: string, texto: string) {
  return request<Resposta>(`/api/conversas/${id}/mensagens`, {
    method: "POST",
    token,
    body: JSON.stringify({ texto }),
  });
}
