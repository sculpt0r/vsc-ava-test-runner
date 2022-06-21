import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getTestTitles } from '../../matcher';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');



	// test('`test (` is recognizable as test declaration', () => {
	// 	const result = hasTestDeclaration('test (');

	// 	assert.ok(result);
	// });
// neeed more test cases!!!!! wielolinijkowce itd
// clean up w matcherach!
	test('get test title with single quotes', () =>{
		const title = getTestTitles(`
			test('single', t => {})
		`);

		assert.deepEqual(title, [
			['single', 4]
		]);
	});

	test('get test title with double quote', () =>{
		const title = getTestTitles(`
			test("double", t => {})
		`);

		assert.deepEqual(title, [
			['double', 4]
		]);
	});
	test('get test title with double quote with spaces', () =>{
		const title = getTestTitles(`
			test("double with spaces", t => {})
		`);

		assert.deepEqual(title, [
			['double with spaces', 4]
		]);
	});
	test('get test title in another line', () =>{
		const title = getTestTitles(`
			test(
				'test title', t => {})
		`);

		assert.deepEqual(title, [
			['test title', 4]
		]);
	});
});
