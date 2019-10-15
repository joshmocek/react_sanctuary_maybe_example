exports.consoleLeft = func => param => {
	console.error(param);
	return func(param);
};
exports.consoleIdentity = consoleLeft(x => x);