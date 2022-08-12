import * as vscode from 'vscode';
import { runTestsInFile, runDebugTestsInFile } from './commands';
import { getTestTitles } from './matcher';
import { Configuration } from './configuration';

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

class AvaCodelens implements vscode.CodeLensProvider {
	onDidChangeCodeLenses?: vscode.Event<void> | undefined;
	provideCodeLenses(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.CodeLens[]> {
		const text = document.getText();
		const results = getTestTitles( text );

		const config = Configuration.load();

		const codeLenses = results.flatMap( ( [ title, match ] ) => {
			const line = document.lineAt( document.positionAt( match ).line );
			const position = new vscode.Position( line.lineNumber, 0 );
			const range = document.getWordRangeAtPosition( position );

			const lenses = [];

			const runCommand = this.createRunTestCaseCommand( title );
			const runDebugCommand = this.createRunDebugTestCaseCommand( title );

			lenses.push( new vscode.CodeLens( range!, runCommand ) );
			lenses.push( new vscode.CodeLens( range!, runDebugCommand ) );

			if( config.areExperimentalsEanbled() ){
				const runByLineCommand = this.createRunTestByLineCommand( line.lineNumber + 1 );
				lenses.push( new vscode.CodeLens( range!, runByLineCommand ) );
			}

			return lenses;
		} );

		return codeLenses;
	}

	createRunTestCaseCommand( testCaseTitle: string ) {
		const command = {
			title: 'Run',
			command: 'vsc-ava-test-runner.runTestsInFile',
			// https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles
			// * might be problematic it test title
			arguments: [ ` --match="${testCaseTitle}"` ],
		};

		return command;
	}

	createRunDebugTestCaseCommand( testCaseTitle: string ) {
		const command = {
			title: 'Debug',
			command: 'vsc-ava-test-runner.runDebugTestsInFile',
			// https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles
			// * might be problematic it test title
			arguments: [ ` --match="${testCaseTitle}"` ],
		};

		return command;
	}

	createRunTestByLineCommand( lineNumber: number ) {
		const command = {
			title: `Run [L:${lineNumber}]`,
			command: 'vsc-ava-test-runner.runTestsInFile',
			arguments: [ `:${lineNumber}` ],
		};

		return command;
	}
}
