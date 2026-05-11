"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  studentName: string;
}

export function DeleteStudentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  studentName,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-red-500/20 dark:bg-gray-900">
        {/* Cabeçalho com Alerta */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-500/10">
            ⚠️
          </div>
          <h3 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">
            Excluir{" "}
            <span className="text-red-600 dark:text-red-500">Aluno</span>
          </h3>
        </div>

        {/* Mensagem de confirmação */}
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Tem certeza que deseja excluir{" "}
          <strong className="text-gray-900 dark:text-white capitalize">
            {studentName}
          </strong>
          ? Esta ação apagará permanentemente a matrícula, as fichas e todo o
          histórico de treinos.
        </p>

        {/* Botões de Ação */}
        <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-xl bg-gray-100 p-3 text-xs font-bold uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-xl bg-red-600 p-3 text-xs font-black uppercase italic tracking-widest text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
