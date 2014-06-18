import {readFileSync} from 'fs';

export default function () {
  return readFileSync('./test/null.js', {encoding: 'utf8'});
};