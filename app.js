const _ = require('lodash')
const fs = require("fs")

cutJson = (file, beginToWordSearched, wordSearched) => {
    const initialPosition = beginToWordSearched ? (file.indexOf(wordSearched)-1) : file.lastIndexOf(wordSearched)
    const breakpoint = initialPosition + wordSearched.length
    const substringInitial = beginToWordSearched ? 0 : breakpoint
    const substringFinal = beginToWordSearched ? breakpoint :  file.length
    
    return file.substring(substringInitial, substringFinal)
}

const findDuplicates = (array) => {
    let index = 0, duplicate = [];
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                duplicate[index] = array[i];
                index++;
            }
        }
    }
    return duplicate;
 }

const getSplittedRows = (file) => {
    const array = new Array();
    const splittedNewFile = _.split(file, '\r\n')
    splittedNewFile.forEach( swf => {
        if(_.includes(swf, [sysTokenInitial])){
            array.push(swf.substring(swf.lastIndexOf(sysTokenInitial), swf.length))
        }
    })
    return array
}

const readAndPrepareFile = (pathFileName) => {
    const fileReaded = fs.readFileSync(pathFileName , {encoding:'utf8', flag:'r'})
    const header =  cutJson(fileReaded, false, ':root {')
    const footer =  cutJson(header, true, '}')

    return(footer)
}

const compareFiles = (primary, toCompare) => {
    const differences = new Array();
    let thereIsNewData
    primary.filter(p=>{
        thereIsNewData = true
        toCompare.forEach(c => {
            if(p===c){
                thereIsNewData = false
                return;
            }
        })
        if(thereIsNewData) differences.push(p)
    })
    
    return differences;
}

let dataFile = ''
let date = new Date()



const sysTokenInitial = '--nv-sys'
const newFile = readAndPrepareFile('./nova.css')
const previousFile = readAndPrepareFile('./oldNova.css')
  
const newFileSplitted = getSplittedRows(newFile)
const previousFileSplitted = getSplittedRows(previousFile)
    
const duplicates = findDuplicates(newFileSplitted)
const newRows = compareFiles(newFileSplitted, previousFileSplitted)
const deleteRows = compareFiles(previousFileSplitted, newFileSplitted)
    
dataFile = "INFORME."
dataFile += "\nElementos duplicados"
dataFile += !duplicates ? "\nNo se encontraron elementos duplicados." : duplicates.map(d => `\n${d}`)

dataFile += "\n\nElementos nuevos"
dataFile += newRows.length === 0 ? "\nNo se encontraron nuevos elementos." : newRows.map(r => `\n${r}`)
    
dataFile += "\n\nElementos eliminados"
dataFile += deleteRows.length === 0 ? console.log("\nNo se encontraron elementos eliminados.") : deleteRows.map(r => `\n${r}`)

let now = `${date.getDate()}-${date.getDay()}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}`
setTimeout(() => {
    fs.appendFileSync(`Whats-News_.txt`, dataFile, { encoding: 'utf8', flag: "a" })
}, 2000);

