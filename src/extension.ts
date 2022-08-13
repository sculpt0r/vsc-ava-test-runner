import * as vscode from 'vscode';
import { AvaCodelens } from './ava-code-lens';
import { runTestsInFile, runDebugTestsInFile } from './commands';

export function activate( context: vscode.ExtensionContext ) {
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

	let runDebugTestsCommand = vscode.commands.registerCommand(
		'vsc-ava-test-runner.runDebugTestsInFile',
		runDebugTestsInFile
	);

	context.subscriptions.push( runTestsCommand );
	context.subscriptions.push( runDebugTestsCommand );

	vscode.languages.registerCodeLensProvider(
		[ 'javascript', 'typescript' ],
		new AvaCodelens()
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
