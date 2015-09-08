// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
// 

var convertToArray = function(json){
	//trim off the bracket
	json = json.slice(1, json.length-1);

	var arr = [], bracketQ = [], curValue = '', i, length, curChar;

	for (i = 0, length=json.length; i <= length; i++){
		curChar = json[i];
		if (/[\[\]\{\}]/.test(curChar)){
			var pair = bracketQ[bracketQ.length-1] + curChar;
			if (/\[\]|\{\}/.test(pair)){
				bracketQ.pop();
			} else {
				bracketQ.push(curChar);
			}
		}

		if (bracketQ.length===0 && curChar === ',' || i === length){
		    console.log(curValue, curValue.length, curChar, 'passing');
			arr.push(parseJSON(curValue));
			curValue = '';
		} else {
			curValue+=curChar;
		}
	}
	return arr;
};


var parseJSON = function(json) {
  //first alway trim() away unesassary sapce characters front and back
  json = json.trim();

  if (/^\[/.test(json)){ 
  	//if true then it's an array
  	return convertToArray(json);

  } else if (json[0]==='"' && json[json.length-1]==='"'){
  	//string test
  	return json.slice(1, json.length-1);

  } else if (json === 'null'){
  	//null test
  	return null;

  } else if (/true|false/.test(json)){
  	//boolean test
    return json === "true";

  } else if (/NaN|-?Infinity/.test(Number(json)) !== true){
    return Number(json);

  } else {
  	//if nothing is matched, then throw error
      throw new SyntaxError('Unexpected token ' + json[0]);
  }

};