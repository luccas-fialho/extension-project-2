// components/DeleteWorkoutModal.tsx
"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean; // Para desativar os botões enquanto exclui
}

export function DeleteWorkoutModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-[#00FF00]/20 bg-gray-900 p-6 shadow-2xl">
        {/* Cabeçalho de Alerta */}
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
            Excluir <span className="text-[#00FF00]">Ficha</span>
          </h3>
        </div>

        {/* Mensagem */}
        <p className="mb-6 text-sm text-gray-400">
          Tem a certeza que deseja excluir esta ficha? Esta ação apagará todo o
          histórico de treinos do aluno e{" "}
          <strong className="text-white">não pode ser desfeita</strong>.
        </p>

        {/* Botões de Ação */}
        <div className="flex gap-3 border-t border-gray-800 pt-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-xl bg-gray-800 p-3 text-xs font-bold uppercase tracking-widest text-gray-300 transition-all hover:bg-gray-700 active:scale-95 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-xl bg-red-500 p-3 text-xs font-black uppercase italic tracking-widest text-white transition-all hover:bg-red-600 active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
