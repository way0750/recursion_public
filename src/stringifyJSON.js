
// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:


var stringifyObj = function(value, isArr){
	var finalString, propString;
	finalString = _.reduce(value, function(convertedValues, propValue, propName){
		propString = isArr ? stringifyJSON(propValue) : propName + ":" + stringifyJSON(propValue);
		return convertedValues.concat(propString);
	}, []).join(',');
	return isArr ? '[' + finalString + ']' : '{' + finalString + '}';
};


var stringifyJSON = function(value){
	debugger;
	if (/object|string/.test(value) !== true || value === null) {
		return String(value);
	} else if (typeof(value) === 'string'){
		
	} else if (/Object|Array/.test(value.constructor.name)){
		return Array.isArray(value) ? stringifyObj(value, true) : stringifyObj(value, false);
	}
};
