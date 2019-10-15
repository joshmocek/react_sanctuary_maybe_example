exports.consoleLeft = func => param => {
	console.error(param);
	return func(param);
};
exports.consoleIdentity = exports.consoleLeft(x => x);