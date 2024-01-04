const returnVal = <T>(value: T) => {
  return value
}

const personName = returnVal('Michel Jackson')
const personAge = returnVal(48)

console.log(personName, personAge)