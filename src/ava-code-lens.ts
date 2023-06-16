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

			// (GH-8) Skip code lenses for commented lines.
			if( this.isLineCommented( line.text ) ){ return []; }

			const position = new vscode.Position( line.lineNumber, 0 );
			const range = document.getWordRangeAtPosition( position );

			const lenses = [];

			const runCommand = this.createRunTestCaseCommand( 'Run', title );
			const runCommandAndWatch = this.createRunTestCaseAndWatchCommand( '--watch', title );
			const runDebugCommand = this.createRunDebugTestCaseCommand( 'Debug', title );

			lenses.push( new vscode.CodeLens( range!, runCommand ) );
			lenses.push( new vscode.CodeLens( range!, runCommandAndWatch ) );
			lenses.push( new vscode.CodeLens( range!, runDebugCommand ) );

			if( config.areExperimentalsEanbled() ){
				const runByLineCommand = this.createRunTestByLineCommand( line.lineNumber + 1 );
				lenses.push( new vscode.CodeLens( range!, runByLineCommand ) );
			}

			return lenses;
		} );

		return codeLenses;
	}

	isLineCommented( line: string ): boolean {
		const commentedLineRegExp = /^\s*(\/\/|\/\*|\*).*/;

		return commentedLineRegExp.test( line );
	}

	createRunTestCaseCommand( lensDisplayName: string, testCaseTitle: string ) {
		const command = {
			title: lensDisplayName,
			command: 'vsc-ava-test-runner.runTestsInFile',
			// https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles
			// * might be problematic it test title
			arguments: [ ` --match="${testCaseTitle}"` ],
		};

		return command;
	}

	createRunTestCaseAndWatchCommand( lensDisplayName: string, testCaseTitle: string ) {
		const command = {
			title: lensDisplayName,
			command: 'vsc-ava-test-runner.runTestsAndWatchInFile',
			// https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles
			// * might be problematic it test title
			arguments: [ ` --match="${testCaseTitle}"` ],
		};

		return command;
	}

	createRunDebugTestCaseCommand( lensDisplayName: string, testCaseTitle: string ) {
		const command = {
			title: lensDisplayName,
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