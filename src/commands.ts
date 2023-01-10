import path = require( 'path' );
import { env } from 'process';
import * as vscode from 'vscode';
import { debug, window } from 'vscode';
import { Configuration } from './configuration';

export function runTestsAndWatchInFile( args?: string ){
	const activeFilePath = getActiveFilePath();
	if( activeFilePath !== undefined )
	{
		args ??= '';
		const cmd = `npx ava --verbose ${activeFilePath}${args} --watch`;
		const terminalName = 'AVA--watch';

		// kill current running watch
		const terminal = vscode.window.terminals
			.find( ( {name} ) => name === terminalName );

		// WORKING 1 refactor
		if( terminal !== undefined ){
			// Kill current working process with Ctrl + C
			terminal.sendText( '\u0003Y\u000D' );
		}

		runTerminalCmd( terminalName, cmd );
	} else {
		vscode.window.showWarningMessage( 'No active file to run a test...' );
	}
}

export function runTestsInFile( args?: string ){
	const activeFilePath = getActiveFilePath();
	if( activeFilePath !== undefined )
	{
		args ??= '';
		const cmd = `npx ava --verbose ${activeFilePath}${args}`;
		runTerminalCmd( 'AVA', cmd );
	} else {
		vscode.window.showWarningMessage( 'No active file to run a test...' );
	}
}

export function runDebugTestsInFile( args?: string ) {
	args ??= '';

	try {
		const activeFilePath = getActiveFilePath();
		const cwd = path.dirname( activeFilePath! );

		debug.startDebugging( undefined, {
			type: 'node',
			request: 'launch',
			name: 'AVA debug',
			cwd: cwd,
			runtimeExecutable: 'npx',
			runtimeArgs: [
				'ava',
				'--serial',
				activeFilePath,
				args
			],
			outputCapture: 'std',
			hideFromUser: false,
			skipFiles: [ '<node_internals>/**/*.js' ]
		} );
	} catch ( e: any ) {
		window.showErrorMessage( e.message );
	}

}
function runTerminalCmd( terminalName: string, cmd: string ): void {
	const terminal = vscode.window.terminals
		.find( ( {name} ) => name === terminalName )
		??
		vscode.window.createTerminal( terminalName );

	terminal.sendText( cmd );
	terminal.show();
}

function getActiveFilePath(){
	return vscode.window.activeTextEditor?.document.uri.fsPath;
}
