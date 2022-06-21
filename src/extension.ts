// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runTestsInFile, runTestsInFileDebug } from './commands';
import {
	findEndTestTitle,
	findTestTitleOpeningCharacter,
	getTestTitles,
} from './matcher';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate( context: vscode.ExtensionContext ) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "vsc-ava-test-runner" is now active!'
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let runTestsCommand = vscode.commands.registerCommand(
		'vsc-ava-test-runner.runTestsInFile',
		runTestsInFile
	);
	// let runTestsDebugCommand = vscode.commands.registerCommand('vsc-ava-test-runner.runTestsInFileDebug',runTestsInFileDebug);

	context.subscriptions.push( runTestsCommand );
	// context.subscriptions.push(runTestsDebugCommand);

	vscode.languages.registerCodeLensProvider(
		[ 'javascript', 'typescript' ],
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
		const text = document.getText();
		const results = getTestTitles( text );

		const codeLenses = results.map( ( [ title, match ] ) => {
			const line = document.lineAt( document.positionAt( match ).line );
			const position = new vscode.Position( line.lineNumber, 0 );
			const range = document.getWordRangeAtPosition( position );

			// Need a range to apply CodeLens
			const command = this.createRunTestCaseCommand( title ); // Anything for now
			// If title and match were found correctly
			// It the range have to be valid
			return new vscode.CodeLens( range!, command );
		} );

		return codeLenses;
	}

	createRunTestCaseCommand( testCaseTitle: string ) {
		const command = {
			title: 'Run',
			command: 'vsc-ava-test-runner.runTestsInFile',
			// https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles
			// * might be problematic it test title
			arguments: [ ` --match='${testCaseTitle}'` ],
		};

		return command;
	}
}
