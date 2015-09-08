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


var isValidString = function(json){
	//string must be contained in '"content"' format
	var validContainer = /^"[^]*"$/.test(json);
	//string content can not have the following: '"content\\"'(escaping the last "),
	//nor: '"\\"' having \\ without special characters of "bfnrt\\
	//nor: 
	var validContent =  /.*\\[^"bfnrt\\]|\\$|\\"$/.test(json) === false;
	return validContent && validContainer;
};


var convertToObject = function(json){
	//we can simply use convertToArray to extract key value pair;
	var keyValuePairs = convertToArray(json, false), obj = {}, key, value;
	keyValuePairs.forEach(function(pair){
		pair = pair.match(/([^]*?):([^]*)/);
		key = parseJSON(pair[1]);
		value = parseJSON(pair[2]);
		obj[key] = value;
	});
	return obj;
};

var stringEsc = function(str) {
	return str.slice(1, str.length-1).replace(/\\([bfnrt"\\])/g, function(wholeMatch, specialChar){
		if (specialChar === 'b'){
			return String.fromCharCode(8);
		} else 	if (specialChar === 't'){
			return String.fromCharCode(9);
		} else 	if (specialChar === 'n'){
			return String.fromCharCode(10);
		} else  if (specialChar === 'f'){
			return String.fromCharCode(12);
		} else 	if (specialChar === 'r'){
			return String.fromCharCode(13);
		} else 	if (specialChar === '"'){
			return String.fromCharCode(34);
		} else 	if (specialChar === '\\'){
			return String.fromCharCode(92);
		} 
	});
};



var parseJSON = function(json) {
  //first alway trim() away unesassary sapce characters front and back
  json = json.trim();

  if ( /^\{[^]*\}$/.test(json)){
  	//if true then it is an object
  	return convertToObject(json);

  } else if (/^\[.*\]$/.test(json)){ 
  	//if true then it's an array
  	return convertToArray(json);

  } else if (/^true$|^false$|^null$/.test(json)){
  	//boolean and null test
    return json === 'null' ? null : json === "true";

  } else if (isFinite(json) && !isNaN(json) && json.length){
  	//only non-empty string with numeric literials but not NaN or +/-Infinity are valid
    return Number(json);

  } else if (isValidString(json)){
  	//string test
  	return stringEsc(json);

  } else {
  	//if nothing is matched, then throw error
    throw (new SyntaxError('the end of the world is near'));
  }

};