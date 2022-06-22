import * as vscode from 'vscode';

export function runTestsInFile( args?: string ){
	console.log( 'all test runned!' );
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

export function runTestsInFileDebug() {}

function runTerminalCmd( cmd: string ): void {
	const terminalName = 'AVA';
	const terminal = vscode.window.terminals
		.find( ( {name} ) => name === terminalName )
		??
		vscode.window.createTerminal( terminalName );

	terminal.sendText( cmd );
	terminal.show();

}