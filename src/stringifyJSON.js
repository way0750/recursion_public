
// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:


var stringifyObj = function(value, isArr){
	var finalString, propString;
	finalString = _.reduce(value, function(convertedValues, propValue, propName){
		if (propValue !== undefined && typeof propValue !== 'function') {
			propString = isArr ? stringifyJSON(propValue) : stringifyJSON(propName) + ":" + stringifyJSON(propValue);
			convertedValues = convertedValues.concat(propString);
		}
		return convertedValues;
	}, []).join(',');
	return isArr ? '[' + finalString + ']' : '{' + finalString + '}';
};


var stringifyJSON = function(value){
	if (/object|string/.test(typeof value) !== true || value === null) {
		return String(value);
	} else if (typeof(value) === 'string'){
		return '"' + value + '"';
	} else if (/Object|Array/.test(value.constructor.name)){
		return Array.isArray(value) ? stringifyObj(value, true) : stringifyObj(value, false);
	}
};
