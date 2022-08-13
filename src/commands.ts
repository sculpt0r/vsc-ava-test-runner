import path = require( 'path' );
import * as vscode from 'vscode';
import { debug, window } from 'vscode';
import { Configuration } from './configuration';

export function runTestsInFile( args?: string ){
	const activeFilePath = vscode.window.activeTextEditor?.document.uri.path;
	if( activeFilePath !== undefined )
	{
		const executable = getExecutableName();

		args ??= '';
		const cmd = `${executable} ava --verbose ${activeFilePath}${args}`;
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

		const executable = getExecutableName();

		debug.startDebugging( undefined, {
			type: 'node',
			request: 'launch',
			name: 'AVA debug',
			cwd: cwd,
			runtimeExecutable: executable,
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

function getExecutableName(): string | undefined {
	const packageManagerToBinary = new Map<string, string>( [
		[ 'npm', 'npx' ],
		[ 'pnpm', 'pnpx' ],
		[ 'yarn', 'yarn dxl' ]
	] );

	const packageManager = Configuration.load().getPackageManager();

	const executable = packageManagerToBinary.get( packageManager );

	if( executable === undefined ){
		throw new Error( 'Cannot find executable for your package manager. Check plugin config. Currently set package manager: ' + packageManager );
	}

	return executable;
}
