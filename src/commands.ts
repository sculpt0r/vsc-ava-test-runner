import * as vscode from 'vscode';

export function runTestsInFile(){
	console.log('all test runned!');
	const activeFilePath = vscode.window.activeTextEditor?.document.uri.path;
	if(activeFilePath !== undefined)
	{
		const cmd = `npx ava --verbose ${activeFilePath}`;
		runTerminalCmd(cmd);
	} else {
		vscode.window.showWarningMessage('No active file to run a test...');
	}
}

export function runTestsInFileDebug() {}

function runTerminalCmd(cmd: string): void {
	const terminalName = 'AVA';
	const terminal = vscode.window.terminals
		.find( ({name}) => name === terminalName)
		??
		vscode.window.createTerminal(terminalName);

	terminal.sendText(cmd);
	terminal.show();

}