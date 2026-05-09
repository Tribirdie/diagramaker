const getAllPropertyNames = () => {
	var names = [];
	var style = getComputedStyle(document.documentElement);
	for (var i = 0; i < style.length; i++) {
		var name = style[i];
		if (!name.startsWith('--')) {
			names.push(name);
		}
	}
	
	return names;
}

export {getAllPropertyNames}
