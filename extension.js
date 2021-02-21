// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bionicscripttools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('bionicscripttools.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from BionicScriptTools!');
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerDefinitionProvider('bs', {
        provideDefinition(document, position, token) {
			const regex = /\w+\s+:\w+\s{0,}(?!.{0,}(\.|Object).{0,})/;//\w*\s+:(\w|_)*\s*(?!.*(\.|Object).*)
			const range = document.getWordRangeAtPosition(position,regex);
			if (range === undefined) {
				return null;
			}
			const word = document.getText(range).trim();

			const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

			const regexBlock ="("+escapedWord+"\\s{1,}\\.\\s{1,}\\{([^\\}]+)\\};"+")|("+escapedWord+"\\s{1,}Object\\.Name([^;]+);"+")";//    "
			const block = RegExp(regexBlock,"m");
			const wholeDoc = document.getText();

			const extractedBlock = wholeDoc.match(block);
			if (extractedBlock.index>-1){
				var pos = document.positionAt(extractedBlock.index); 
				return new vscode.Location(document.uri,pos);
			}
			return null;
        }
    });	

//https://code.visualstudio.com/api/language-extensions/programmatic-language-features
    vscode.languages.registerHoverProvider('bs', {
        provideHover(document, position, token) {
			const regex = /\w+\s+:\w+\s{0,}(?!.{0,}(\.|Object).{0,})/;//\w*\s+:(\w|_)*\s*(?!.*(\.|Object).*)
			const range = document.getWordRangeAtPosition(position,regex);
			if (range === undefined) {
				return;
			}
			const word = document.getText(range).trim();

			const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

			const regexBlock ="("+escapedWord+"\\s{1,}\\.\\s{1,}\\{([^\\}]+)\\};"+")|("+escapedWord+"\\s{1,}Object\\.Name([^;]+);"+")";//    "
			const block = RegExp(regexBlock,"m");
			const wholeDoc = document.getText();

			const extractedBlock = wholeDoc.match(block);
			var convertedBlock = extractedBlock[0];//"\t"+
			//convertedBlock = convertedBlock.replace(/\n/g, "\r\n\t");
			//convertedBlock = convertedBlock.replace(new RegExp("\\.","gm"), "\\\.");

			const markdownString = new vscode.MarkdownString();//extractedBlock[0]);
			markdownString.appendCodeblock(convertedBlock);
			//const markdownString = new vscode.MarkdownString(" "+extractedBlock);
			return new vscode.Hover(markdownString);
        }
    });


}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

