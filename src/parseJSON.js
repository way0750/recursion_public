// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
// 

var convertToArray = function(json, convertItem){
	//trim off the bracket
	json = json.slice(1, json.length-1);

	convertItem = arguments.length < 2 ? true : convertItem;

	var arr = [], bracketQ = [], curValue = '', i, length, curChar;

	for (i = 0, length=json.length; i < length; i++){
		curChar = json[i];

		//bracket test:
		//return true if any of these is found: [, ], {, or }
		if (/[\[\]\{\}\"]/.test(curChar)){

			//try to create a pair of bracker by combining last value in bracketQ and curChar
			var pair = bracketQ[bracketQ.length-1] + curChar;
			//if it is an actual pair then ok to pop out the last value from bracketQ because a complete set is found
			if (/\[\]|\{\}|\"\"/.test(pair)){
				bracketQ.pop();
			} else {
			//if not a complete set then push current bracket side at the end of bracketQ
				bracketQ.push(curChar);
			}
		}
		//if all possible brackets are accounted for and looping hits a comma or the end of the json string
		//then we have a complete value
		//but of curse we need to convert that value by parseJSON too beforing pushing in the final array
		if (bracketQ.length===0 && curChar === ',' || i === length-1){
			//since we can reuse convertToArray for converting objects too
			//but we should not convert the part of stirng we have since it is a key value pair
			if (i === length-1) {curValue += (curChar);}
			arr.push(convertItem ? parseJSON(curValue) : curValue);
			curValue = '';
		} else {
		//if we don't have complete value yet, then keep adding characters to the temporary character
		//holding string until a complete value is found.
			curValue += (curChar);
		}
	}
	return arr;
};

//trim both end
//then replace all \n\r\t if not in between two " "
//yeah but what if there are some random but escapd " "
//all over the place
//but the all the " within a string are escaped
//
var isValidString = function(json){
	//var validContainer = json[0] === json[json.length-1] === '"';
	var validContent =  /.*\\[^\"bfnrt]|\\$|.*[^\\]*"/.test(json.slice(1, json.length-1)) === false;
	return validContent;
};


var convertToObject = function(json){
	//we can simply use convertToArray extract key value pair;
	var keyValuePairs = convertToArray(json, false), obj = {}, key, value;
	keyValuePairs.forEach(function(pair){
		pair = pair.match(/([^]*?):([^]*)/); //match(/^([^:]+):/)
		key = parseJSON(pair[1]);
		value = parseJSON(pair[2]);
		obj[key] = value;
	});
	return obj;
};


var parseJSON = function(json) {
  //first alway trim() away unesassary sapce characters front and back
  json = json.trim();
  // /(^\{[^]*\}$/
  if ( /^\{[^]*\}$/.test(json)){
  	//if true then it is an object
  	return convertToObject(json);

  } else if (/^\[.*\]$/.test(json)){ 
  	//if true then it's an array
  	return convertToArray(json);

  } else if (json === 'null'){
  	//null test
  	return null;

  } else if (/^true$|^false$/.test(json)){
  	//boolean test
    return json === "true";

  } else if (/NaN|-?Infinity/.test(Number(json)) !== true && json.length){
    return Number(json);

  } else if (isValidString(json)){
  	//string test
  	return json.slice(1, json.length-1);

  } else {
  	//if nothing is matched, then throw error
    throw (new SyntaxError('SyntaxError'));
  }

};