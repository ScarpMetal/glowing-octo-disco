"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const { sortQueueItems, insertInQueue } = require("./utils");

function createQueueRequest(source) {
  return new Promise(async (resolve, reject) => {
    const log = await source.popAsync();
    resolve({
      source,
      log,
      nextQueueRequest: log ? createQueueRequest(source) : null,
    });
  });
}

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    // Create, preload, and sort the first items from the log sources
    const initialQueueRequests = logSources.map((source) =>
      createQueueRequest(source)
    );
    let unsortedQueueItems = await Promise.all(initialQueueRequests);
    unsortedQueueItems = unsortedQueueItems.filter((item) => !!item.log);
    let printQueue = sortQueueItems(unsortedQueueItems);

    // Iterate through the print queue and print the logs.
    // After each log is printed, check if there is another valid log from the log source and insert it into the print queue.
    while (printQueue.length > 0) {
      const { log, nextQueueRequest } = printQueue.pop();
      printer.print(log);

      if (nextQueueRequest) {
        const nextQueueItem = await nextQueueRequest;
        if (nextQueueItem.log) {
          printQueue = insertInQueue(printQueue, nextQueueItem);
        }
      }
    }

    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
