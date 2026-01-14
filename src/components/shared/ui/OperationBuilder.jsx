import { useState } from 'react';
import Button from './Button';
import Select from './Select';

const OPERATION_TYPES = {
  UNION: 'union',
  FIND: 'find',
  CONNECTED: 'connected',
};

export default function OperationBuilder({
  elements,
  operations,
  onOperationsChange,
}) {
  const [opType, setOpType] = useState(OPERATION_TYPES.UNION);
  const [opX, setOpX] = useState('');
  const [opY, setOpY] = useState('');

  const handleAddOperation = () => {
    if (!opX) return;
    if ((opType === OPERATION_TYPES.UNION || opType === OPERATION_TYPES.CONNECTED) && !opY) return;

    const newOp =
      opType === OPERATION_TYPES.FIND
        ? { type: opType, x: opX }
        : { type: opType, x: opX, y: opY };

    onOperationsChange([...operations, newOp]);
    setOpX('');
    setOpY('');
  };

  const handleRemoveOperation = (index) => {
    onOperationsChange(operations.filter((_, i) => i !== index));
  };

  const elementOptions = [
    { value: '', label: 'Select...' },
    ...elements.map((el) => ({ value: el, label: el })),
  ];

  const opTypeOptions = [
    { value: OPERATION_TYPES.UNION, label: 'Union' },
    { value: OPERATION_TYPES.FIND, label: 'Find' },
    { value: OPERATION_TYPES.CONNECTED, label: 'Connected?' },
  ];

  const formatOperation = (op) => {
    if (op.type === OPERATION_TYPES.UNION) return `Union(${op.x}, ${op.y})`;
    if (op.type === OPERATION_TYPES.FIND) return `Find(${op.x})`;
    if (op.type === OPERATION_TYPES.CONNECTED) return `Connected(${op.x}, ${op.y})?`;
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Add Operation */}
      <div>
        <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
          Add Operation
        </label>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={opType}
            onChange={(e) => setOpType(e.target.value)}
            options={opTypeOptions}
            className="w-28"
          />
          <Select
            value={opX}
            onChange={(e) => setOpX(e.target.value)}
            options={elementOptions}
            className="w-20"
          />
          {opType !== OPERATION_TYPES.FIND && (
            <Select
              value={opY}
              onChange={(e) => setOpY(e.target.value)}
              options={elementOptions}
              className="w-20"
            />
          )}
          <Button onClick={handleAddOperation} disabled={!opX || (opType !== OPERATION_TYPES.FIND && !opY)}>
            Add
          </Button>
        </div>
      </div>

      {/* Operations List */}
      {operations.length > 0 && (
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
            Operations ({operations.length})
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {operations.map((op, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="text-sm">
                  <span className="text-zinc-500 mr-2">{idx + 1}.</span>
                  <span className={`font-mono ${
                    op.type === OPERATION_TYPES.UNION
                      ? 'text-blue-600 dark:text-blue-400'
                      : op.type === OPERATION_TYPES.FIND
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    {formatOperation(op)}
                  </span>
                </span>
                <button
                  onClick={() => handleRemoveOperation(idx)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
