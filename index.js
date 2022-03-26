import { createReadStream, promises as fs } from 'fs';
import * as csv from 'csv';

const transactionsPath = './input.csv';

async function main() {
  const records = [];
  const readStream = createReadStream(transactionsPath).pipe(csv.parse());

  for await (const record of readStream) {
    records.push(record);
  }

  console.log(`Found ${records.length - 1} transactions`);

  // Remove headings.
  records.shift();

  const transformedRecords = records
    .map((record) => {
      const [
        utcTime,
        destination,
        destinationAmount,
        destinationCurrency,
        feeAmount,
        feeCurrency,
        id,
        origin,
        originAmount,
        originCurrency,
        status,
        operation,
      ] = record;
      if (status !== 'completed') return null;

      const date = formatDateToCointracker(utcTime);
      const receivedQuantity = formatFloatToCointracker(destinationAmount);
      const receivedCurrency = destinationCurrency;

      let tag;
      switch (operation) {
        case 'in':
          tag = 'payment';
          break;
        default:
          tag = null;
          break;
      }

      return [date, receivedQuantity, receivedCurrency, null, null, null, null, tag];
    })
    .filter((record) => record !== null);

  const result = csv.stringify(transformedRecords, {
    header: true,
    columns: [
      'Date',
      'Received Quantity',
      'Received Currency',
      'Sent Quantity',
      'Sent Currency',
      'Fee Amount',
      'Fee Currency',
      'Tag',
    ],
  });

  await fs.writeFile('./output.csv', result);
  console.log(`Converted ${transformedRecords.length} transactions to CoinTracker's format`);
}

function formatDateToCointracker(unparsedDate) {
  const date = new Date(unparsedDate);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const seconds = `${date.getSeconds()}`.padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatFloatToCointracker(input) {
  const floatAmount = +input;
  return floatAmount == 0 ? null : floatAmount.toFixed(8);
}

main();
