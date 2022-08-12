import path = require( 'path' );
import * as vscode from 'vscode';
import { debug, window } from 'vscode';

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
				activeFilePath,
				args
			],
			outputCapture: 'std',
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
