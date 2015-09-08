// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
// 

var hasClassValueOf = function(node, classValue){
	//we are only checking element type of node; if nodeType return 1 then it is an element type node
	return node.nodeType === 1 ? node.className.search(classValue) > -1 : false;
};

var getElementsByClassName = function(className, nodes
){
  nodes = nodes || document.childNodes;

  return _.reduce(nodes, function(passedNodes, node){

  	if (node.nodeType === 1) {

	  	if (hasClassValueOf(node, className)) {passedNodes.push(node);}
	  	
	  	var children = node.childNodes;
	  	if (children.length){
	  		passedNodes = passedNodes.concat(getElementsByClassName(className, children));
	  	}
    }

  	return passedNodes;

  }, []);

};

