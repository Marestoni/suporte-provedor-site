import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Suporte ao cliente</h1>
        <p className="text-muted">
          Segunda via de fatura, problemas na conexão e visita técnica. Tudo por aqui, sem fila.
        </p>
      </div>

      <Link
        href="/chat"
        className="flex h-12 items-center justify-center rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Iniciar atendimento
      </Link>

      <p className="text-sm text-muted">
        Você vai precisar do seu CPF e da sua data de nascimento para confirmar quem é você.
      </p>
    </main>
  );
}
