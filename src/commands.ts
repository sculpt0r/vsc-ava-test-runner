import path = require( 'path' );
import { env } from 'process';
import * as vscode from 'vscode';
import { debug, window } from 'vscode';
import { Configuration } from './configuration';

export function runTestsInFile( args?: string ){
	const activeFilePath = vscode.window.activeTextEditor?.document.uri.path;
	if( activeFilePath !== undefined )
	{
		args ??= '';
		const cmd = `npx ava --verbose ${activeFilePath}${args}`;
		runTerminalCmd( cmd );
	} else {
		vscode.window.showWarningMessage( 'No active file to run a test...' );
	}
}

export function runDebugTestsInFile( args?: string ) {
	args ??= '';

	try {
		const activeFilePath = vscode.window.activeTextEditor?.document.uri.path;
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

function runTerminalCmd( cmd: string ): void {
	const terminalName = 'AVA';
	const terminal = vscode.window.terminals
		.find( ( {name} ) => name === terminalName )
		??
		vscode.window.createTerminal( terminalName );

	terminal.sendText( cmd );
	terminal.show();
}
