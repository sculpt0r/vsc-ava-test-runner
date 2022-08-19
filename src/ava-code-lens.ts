import * as vscode from 'vscode';
import { getTestTitles } from './matcher';
import { Configuration } from './configuration';

export class AvaCodelens implements vscode.CodeLensProvider {
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