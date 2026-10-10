import Link from "next/link";

export const metadata = { title: "Conexão suspensa" };

/** Destino do redirecionamento do walled garden para cliente bloqueado por inadimplência. */
export default function Bloqueado() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sua conexão está suspensa</h1>
        <p className="text-muted">
          Identificamos uma fatura em aberto. Você pode regularizar agora mesmo: o atendimento envia o
          PIX e, se for o caso, libera sua internet por alguns dias.
        </p>
      </div>

      <Link
        href="/chat"
        className="flex h-12 items-center justify-center rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Falar com o atendimento
      </Link>
    </main>
  );
}
