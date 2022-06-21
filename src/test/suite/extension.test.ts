import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { hasTestDeclaration } from '../../matcher';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test( 'Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('empty string is not recognizable as test declaration', () => {
		const result = hasTestDeclaration('');

		assert.equal(result, false);
	});

	test ('`test(` is recognizable as test declaration', () => {
		const result = hasTestDeclaration('test(');

		assert.ok(result);
	});
	//TODO
	// test('`test (` is recognizable as test declaration', () => {
	// 	const result = hasTestDeclaration('test (');

	// 	assert.ok(result);
	// });
});
