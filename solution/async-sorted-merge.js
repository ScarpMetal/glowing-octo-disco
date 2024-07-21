"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const { sortQueueItems, insertInQueue } = require("./utils");

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    // Fetch the first log from each log source and sort them by date.
    // Attach the log source to each log, so after we print the log we can get the next one.
    let unsortedQueueItems = await Promise.all(
      logSources.map((source) => {
        return new Promise(async (resolve, reject) => {
          const log = await source.popAsync();
          resolve({ log, source });
        });
      })
    );
    unsortedQueueItems = unsortedQueueItems.filter(({ log }) => !!log);
    let printQueue = sortQueueItems(unsortedQueueItems);

    // Iterate through the print queue and print the logs.
    // After each log is printed, check if there is another valid log from the log source and insert it into the print queue.
    while (printQueue.length > 0) {
      const { source, log } = printQueue.pop();
      printer.print(log);

      const nextLog = await source.popAsync();
      if (nextLog) {
        printQueue = insertInQueue(printQueue, nextLog, source);
      }
    }

    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
