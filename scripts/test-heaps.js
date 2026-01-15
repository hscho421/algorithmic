import assert from 'node:assert/strict';
import {
  buildHeapFromArray,
  initialState,
  executeStep,
} from '../src/lib/algorithms/heaps/minHeap.js';

const isHeap = (heap, type) => {
  for (let i = 0; i < heap.length; i += 1) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heap.length) {
      if (type === 'min') {
        assert.ok(heap[i] <= heap[left], `min-heap violation at ${i} -> ${left}`);
      } else {
        assert.ok(heap[i] >= heap[left], `max-heap violation at ${i} -> ${left}`);
      }
    }
    if (right < heap.length) {
      if (type === 'min') {
        assert.ok(heap[i] <= heap[right], `min-heap violation at ${i} -> ${right}`);
      } else {
        assert.ok(heap[i] >= heap[right], `max-heap violation at ${i} -> ${right}`);
      }
    }
  }
};

const runToEnd = (state) => {
  let current = state;
  while (!current.done) {
    current = executeStep(current);
  }
  return current;
};

const sample = [5, 3, 8, 1, 2, 9, 4, 7];

const minHeap = buildHeapFromArray(sample, 'min');
const maxHeap = buildHeapFromArray(sample, 'max');

isHeap(minHeap, 'min');
isHeap(maxHeap, 'max');

let state = initialState({ heap: minHeap, operation: 'insert', value: 0, heapType: 'min' });
state = runToEnd(state);
assert.ok(state.heap.includes(0));
isHeap(state.heap, 'min');

state = initialState({ heap: minHeap, operation: 'extract-root', heapType: 'min' });
state = runToEnd(state);
isHeap(state.heap, 'min');

state = initialState({ heap: maxHeap, operation: 'extract-root', heapType: 'max' });
state = runToEnd(state);
isHeap(state.heap, 'max');

state = initialState({ heap: minHeap, operation: 'change-key', heapType: 'min', index: 3, newValue: 0 });
state = runToEnd(state);
isHeap(state.heap, 'min');

state = initialState({ heap: maxHeap, operation: 'change-key', heapType: 'max', index: 3, newValue: 99 });
state = runToEnd(state);
isHeap(state.heap, 'max');

state = initialState({ heap: minHeap, operation: 'delete-index', heapType: 'min', index: 2 });
state = runToEnd(state);
isHeap(state.heap, 'min');

state = initialState({ operation: 'heapify', heapType: 'max', inputValues: sample });
state = runToEnd(state);
isHeap(state.heap, 'max');

console.log('Heap tests passed.');
