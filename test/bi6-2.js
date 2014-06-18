import fs from 'fs';

export default function () {
  return fs.readFileSync('./test/null.js', {encoding: 'utf8'});
};