import { useState } from 'react';
import { Input, Button } from '../ui';
import useAuthContext from '../../../context/useAuthContext';

export default function SavedInputsPanel({
  items = [],
  isLoading = false,
  onSave,
  onLoad,
  onDelete,
}) {
  const { isAuthenticated } = useAuthContext();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Name is required.');
      return;
    }
    const { error } = await onSave(name.trim());
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setName('');
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        Saved inputs
      </div>
      {!isAuthenticated && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Sign in to save and reuse inputs.
        </div>
      )}
      <div className="flex gap-2">
        <Input
          label={null}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this input"
          className="flex-1"
          disabled={!isAuthenticated}
        />
        <Button
          onClick={handleSave}
          variant="primary"
          className="self-end"
          disabled={!isAuthenticated}
        >
          Save
        </Button>
      </div>
      {errorMessage && <div className="text-xs text-rose-500">{errorMessage}</div>}
      <div className="space-y-2">
        {isLoading && <div className="text-xs text-zinc-500">Loading…</div>}
        {!isLoading && items.length === 0 && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">No saved inputs yet.</div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300"
          >
            <span className="truncate">{item.name}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onLoad(item)}
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              >
                Load
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="text-rose-500 hover:text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
