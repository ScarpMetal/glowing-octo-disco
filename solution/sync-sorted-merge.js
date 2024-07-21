"use strict";

// Print all entries, across all of the sources, in chronological order.

const { sortQueueItems, insertInQueue } = require("./utils");

module.exports = (logSources, printer) => {
  // Get the first log from each log source and sort them by date.
  // Attach the log source to each log, so after we print the log we can get the next one.
  const unsortedQueueItems = logSources
    .map((source) => ({
      log: source.pop(),
      source,
    }))
    .filter(({ log }) => !!log);
  let printQueue = sortQueueItems(unsortedQueueItems);

  // Iterate through the print queue and print the logs.
  // After each log is printed, check if there is another valid log from the log source and insert it into the print queue.
  while (printQueue.length > 0) {
    const { source, log } = printQueue.pop();
    printer.print(log);

    const nextLog = source.pop();
    if (nextLog) {
      printQueue = insertInQueue(printQueue, nextLog, source);
    }
  }

  printer.done();
  return console.log("Sync sort complete.");
};
