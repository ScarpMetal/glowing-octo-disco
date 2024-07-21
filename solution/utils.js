/**
 * Merge together two sorted print queue arrays
 */
function mergeQueueItems(left, right) {
  let sorted = [];
  let li = 0;
  let ri = 0;

  while (li < left.length || ri < right.length) {
    const lItem = left[li];
    const rItem = right[ri];

    if (lItem && rItem) {
      if (lItem.log.date > rItem.log.date) {
        sorted.push(lItem);
        li++;
      } else {
        sorted.push(rItem);
        ri++;
      }
    } else if (lItem) {
      sorted.push(lItem);
      li++;
    } else {
      sorted.push(rItem);
      ri++;
    }
  }

  return sorted;
}

/**
 * Sort and unsorted array using mergesort under the hood
 */
function sortQueueItems(arr) {
  if (arr.length <= 1) return arr;

  const pivotIndex = Math.floor(arr.length / 2);
  const left = sortQueueItems(arr.slice(0, pivotIndex));
  const right = sortQueueItems(arr.slice(pivotIndex, arr.length));

  return mergeQueueItems(left, right);
}

/**
 * Insert another log into the print queue using a mergesort approach
 */
function insertInQueue(arr, log, source) {
  if (arr.length <= 0) return [{ log, source }];
  if (arr.length == 1) return mergeQueueItems([{ log, source }], arr);

  const pivotIndex = Math.floor(arr.length / 2);
  const pivotItem = arr[pivotIndex];
  let left = arr.slice(0, pivotIndex);
  let right = arr.slice(pivotIndex, arr.length);

  if (log.date > pivotItem.date) {
    left = insertInQueue(left, log, source);
  } else {
    right = insertInQueue(right, log, source);
  }

  return mergeQueueItems(left, right);
}

module.exports = { mergeQueueItems, sortQueueItems, insertInQueue };
