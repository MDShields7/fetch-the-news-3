export function fieldsNotEmpty(field) {
  console.log('Lib, start fieldsNotEmpty')
  for (let i = 0; i < arguments.length; i++) {
    if (
      typeof arguments[i] === 'object' ||
      typeof arguments[i] === 'array' ||
      typeof arguments[i] === 'boolean' ||
      typeof arguments[i] === 'null' ||
      typeof arguments[i] === 'undefined' ||
      typeof arguments[i] === 'number' ||
      typeof arguments[i] === 'symbol' ||
      (typeof arguments[i] === 'string' && arguments[i] === '')
    ) {
      return 'All fields must be filled out. No empty fields are allowed.';
    }
  }
  return true;
}
export function fieldsCharsMin(min, field) {
  console.log('Lib, start fieldsCharsMin')
  for (let i = 0; i < arguments.length;) {
    // console.log(arguments)
    if (arguments[(i + 1)].length < arguments[i]) {
      return `All fields must contain the minimum character count: ${arguments[i + 1]} does not meet the ${arguments[i]} minimum`;
    }
    i += 2;
  }
  return true;
}
export function fieldsCharsMax(max, field) {
  console.log('Lib, start fieldsCharsMax')
  for (let i = 0; i < arguments.length;) {
    // console.log(arguments)
    if (arguments[i + 1].length > arguments[i]) {
      return `All fields must not surpass the maximum character count: ${arguments[i + 1]} does not meet the ${arguments[i]} maximum`;
    }
    i += 2;
  }
  return true;
}
export function fieldsIsEmail(field) {
  console.log('Lib, start fieldsIsEmail')
  for (let i = 0; i < arguments.length; i++) {
    if (!arguments[i].includes('@') || !arguments[i].includes('.')) {
      console.log('Lib, fieldsIsEmail complete, false')
      return 'Please enter a valid email address.';
    }
  }
  console.log('Lib, fieldsIsEmail complete, true')
  return true;
}
export function checkListEntryNotUsed(list, entryName, entry) {
  // console.log('Lib, checkListForEntry, list', list)
  // console.log('Lib, checkListForEntry, entryName', entryName)
  // console.log('Lib, checkListForEntry, entry', entry)
  for (let i = 0; i < list.length; i++) {
    for (let j = 1; j < arguments.length;) {
      // console.log('i is', i, 'j is', j)
      // console.log('list[i]', list[i])
      // console.log('list[i][j]', list[i][j])
      // console.log('arguments[j + 1]', arguments[j + 1])
      // console.log(list[i][arguments[j]] === arguments[j + 1])
      if (list[i][arguments[j]] === arguments[j + 1]) {
        // console.log(`${entry} for ${entryName} is already taken. Please choose another.`)
        return `${entry} for ${entryName} is already taken. Please choose another.`
      }
      j += 2;
    }
  }
  return true
}