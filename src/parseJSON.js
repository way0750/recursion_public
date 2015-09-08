// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
// 

var convertToArray = function(json, converItem){
	//trim off the bracket
	json = json.slice(1, json.length-1);

	converItem = arguments.length < 2 ? true : converItem;

	var arr = [], bracketQ = [], curValue = '', i, length, curChar;

	for (i = 0, length=json.length; i <= length; i++){
		curChar = json[i];

		//bracket test:
		//return true if any of these is found: [, ], {, or }
		if (/[\[\]\{\}]/.test(curChar)){

			//try to create a pair of bracker by combining last value in bracketQ and curChar
			var pair = bracketQ[bracketQ.length-1] + curChar;
			//if it is an actual pair then ok to pop out the last value from bracketQ because a complete set is found
			if (/\[\]|\{\}/.test(pair)){
				bracketQ.pop();
			} else {
			//if not a complete set then push current bracket side at the end of bracketQ
				bracketQ.push(curChar);
			}
		}

		//if all possible brackets are accounted for and looping hits a comma or the end of the json string
		//then we have a complete value
		//but of curse we need to convert that value by parseJSON too beforing pushing in the final array
		if (bracketQ.length===0 && curChar === ',' || i === length){
			//since we can reuse convertToArray for converting objects too
			//but we should not convert the key of a key value pair in an object
			//that's why we should have control over when to convert what
			
			arr.push(convertItem ? parseJSON(curValue) : curValue);
			curValue = '';
		} else {
		//if we don't have complete value yet, then keep adding characters to the temporary character
		//holding string until a complete value is found.
			curValue+=curChar;
		}
	}
	return arr;
};



var convertToObject = function(json){
	var keyValuePairs = convertToArray(json, false), obj = {}, key, value;
	keyValuePairs.forEach(function(pair){
		pair = pair.match(/^([^\:]+)\:(.+)/);
		key = pair[1].trim();
		value = pair[2].trim();
		obj[key] = parseJSON(value);
	});
	return obj;
};


var parseJSON = function(json) {
  //first alway trim() away unesassary sapce characters front and back
  json = json.trim();

  if (/^\{.*\}$/.test(json)){
  	//if true then it is an object
  	return convertToObject(json);

  } else if (/^\[.*\]$/.test(json)){ 
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