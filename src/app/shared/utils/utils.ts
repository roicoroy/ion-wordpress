import { format, parseISO } from "date-fns";
const nanoid = require('nanoid');

export function numberize(x: any) {
  return Number(x);
}

export function titleCaseWord(word: string) {
  if (!word) {
    return word;
  };
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function generateId(): number {
  return nanoid();
}

export function sumPointsArray(array: any): any {
  const sum = array.reduce((a: any, b: any) => a + b, 0);
  return sum;
}

export function formatFormDate(value: string) {
  return format(parseISO(value), 'dd MMM yyyy');
}

export const pickerColumns = [
  {
    name: 'hours',
    options: [
      {
        text: '1',
        value: 1
      },
      {
        text: '2',
        value: 2
      },
      {
        text: '3',
        value: 3
      },
      {
        text: '4',
        value: 4
      },
      {
        text: '5',
        value: 5
      },
      {
        text: '6',
        value: 6
      },
      {
        text: '7',
        value: 7
      },
      {
        text: '8',
        value: 8
      },
      {
        text: '9',
        value: 9
      },
      {
        text: '10',
        value: 10
      },
      {
        text: '11',
        value: 11
      },
      {
        text: '12',
        value: 12
      },
      {
        text: '13',
        value: 13
      },
    ]
  },
  {
    name: 'quarters',
    options: [
      {
        text: '00',
        value: 0
      },
      {
        text: '25',
        value: 25
      },
      {
        text: '50',
        value: 50
      },
      {
        text: '75',
        value: 75
      },
    ]
  }
];