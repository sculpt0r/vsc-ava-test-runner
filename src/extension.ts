// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runTestsInFile, runTestsInFileDebug } from './commands';
import { hasTestDeclaration } from './matcher';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsc-ava-test-runner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let runTestsCommand = vscode.commands.registerCommand('vsc-ava-test-runner.runTestsInFile',runTestsInFile);
	// let runTestsDebugCommand = vscode.commands.registerCommand('vsc-ava-test-runner.runTestsInFileDebug',runTestsInFileDebug);

	context.subscriptions.push(runTestsCommand);
	// context.subscriptions.push(runTestsDebugCommand);

	vscode.languages.registerCodeLensProvider(
		[
			'javascript',
			'typescript'
		],
		new AvaCodelens()
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class AvaCodelens implements vscode.CodeLensProvider {
	onDidChangeCodeLenses?: vscode.Event<void> | undefined;
	provideCodeLenses(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.CodeLens[]> {
		const codeLenses = [];

		const re = /(.+)/g;
		const regex = new RegExp(re);

		const text = document.getText();
		let matches;
		// od znalezienia `test` zbieramy linijke za linijka
		//wyczaj czy titel zaczyna sie od apos, double czy backtick
		// i wtedy czekamy na pojawienie sie tego znaku i przecinka za nim
		//wten sposob zgarniemy nazwe testu -> byc moze trzeba zrobic eval -> np jak mamy konkatenacje znakow
		//zbieramy tez range do ktorych bedziemy aplikowac codelensy

		// all powyzsze ma byc na testach!!
		while ((matches = regex.exec(text)) !== null) {
			// Iterate through end lines to get each line number
			const line = document.lineAt( document.positionAt( matches.index ).line );
			const hasTestDeclared = hasTestDeclaration( line.text );



			if(hasTestDeclared) {
				// Where `test` phrase in given line is started
				const indexOf = line.text.indexOf(matches[0]);
				const position = new vscode.Position(line.lineNumber, indexOf);

				const range = document.getWordRangeAtPosition(position, new RegExp(re));

				// Need a range to apply CodeLens
				if (range) {
					const command = this.createRunTestCaseCommand(line.lineNumber);
					codeLenses.push(new vscode.CodeLens(range, command));
				}

			}
		}


		return codeLenses;
	}

	createRunTestCaseCommand(lineNumber: number){
		const command = {
			title: 'Run',
			command: 'vsc-ava-test-runner.runTestsInFile',
			arguments: [`:${lineNumber+1}`]
		};

		return command;
	}
}