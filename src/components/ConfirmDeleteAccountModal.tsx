import React from 'react';

interface ConfirmDeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmDeleteAccountModal: React.FC<ConfirmDeleteAccountModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-8">
        <h3 className="text-xl font-bold text-red-600 mb-4">Confirmer la suppression du compte</h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Êtes-vous sûr de vouloir supprimer votre compte ?<br />
          <span className="text-red-500 font-semibold">Cette action est irréversible et toutes vos données seront définitivement perdues.</span>
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer mon compte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAccountModal;
