const fs = require('fs');
var json = require('./broken-database.json');

var jsonCorrectedLetters = changeLetters(JSON.stringify(json));
var jsonConverted = JSON.parse(jsonCorrectedLetters);
jsonConverted.forEach(element => {
    element = changePrices(element);
    element = addQuantity(element);
});

exportDatabase(JSON.stringify(jsonConverted));

var orderedJson = orderedDatabase(jsonConverted);
totalSum(orderedJson);


function changeLetters(jsonText) {
    
    var jsonUpdated = jsonText.replace(new RegExp('æ', 'g'),'a');
    jsonUpdated = jsonUpdated.replace(new RegExp('¢', 'g'),'c');
    jsonUpdated = jsonUpdated.replace(new RegExp('ø', 'g'),'o');
    jsonUpdated = jsonUpdated.replace(new RegExp('ß', 'g'),'b');
   
    return jsonUpdated;
}

function changePrices(product){
    if(typeof product.price === 'string'){
        product.price = parseFloat(product.price);
    }
    return product;
}

function addQuantity(product){
    if(!product.hasOwnProperty("quantity")){
        product.quantity = 0;
    }
    return product;
}

function exportDatabase(jsonData){
    //trecho copiado e adaptado de https://www.tutorialkart.com/nodejs/node-js-write-json-object-to-file/
    fs.writeFile("saida.json", jsonData, 'utf8', function (err) {
        if (err) {
            console.log("Houve um erro na exportação do arquivo JSON.");
            return console.log(err);
        }
        console.log("O arquivo JSON foi salvo.");
    });
}

function orderedDatabase(jsonConverted){
    //trecho copiado e adaptado de https://gomakethings.com/sorting-an-array-by-multiple-criteria-with-vanilla-javascript/
    jsonConverted.sort(function ( a, b){
        if(a.category < b.category) {
            return -1;
        } else {
            if ((a.category == b.category) && (a.id < b.id)) {
                return -1;
            }
            return true;
        }
    });
    console.log(jsonConverted);
    return jsonConverted;
}

function totalSum(orderedJson){
    var totalSum = 0, category = "", oldCategory = "";
    orderedJson.forEach(element => {
        category = element.category;
        if(category == oldCategory || oldCategory == ""){
            totalSum = totalSum + element.price * element.quantity;
        } else {
            console.log(oldCategory, totalSum);
            totalSum = element.price * element.quantity;
        }
        oldCategory = category;
    });
        
}
    
