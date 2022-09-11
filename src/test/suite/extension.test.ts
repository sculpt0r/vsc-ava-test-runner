import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getTestTitles } from '../../matcher';
// import * as myExtension from '../../extension';

suite( 'Extension Test Suite', () => {
	vscode.window.showInformationMessage( 'Start all tests.' );
	test( 'get test title with whitespaces around test parenthesis', () =>{
		const title = getTestTitles( `
			test ( 'spaces', t => {})
		` );

		assert.deepEqual( title, [
			[ 'spaces', 4 ]
		] );
	} );

	test( 'get test title with single quotes', () =>{
		const title = getTestTitles( `
			test('single', t => {})
		` );

		assert.deepEqual( title, [
			[ 'single', 4 ]
		] );
	} );


	test( 'get test title with double quote', () =>{
		const title = getTestTitles( `
			test("double", t => {})
		` );

		assert.deepEqual( title, [
			[ 'double', 4 ]
		] );
	} );

	test( 'get test title with singlequote and escaped singlequote and remove escape character', () =>{
		const title = getTestTitles( `
			test('dou \\'t\\' ble', t => {})
		` );

		assert.deepEqual( title, [
			// eslint-disable-next-line quotes
			[ "dou 't' ble", 4 ]
		] );
	} );

	test( 'get test title with escaped singlequote and remove escape character', () =>{
		const title = getTestTitles( `
			test("dou \\'t\\' ble", t => {})
		` );

		assert.deepEqual( title, [
			// eslint-disable-next-line quotes
			[ "dou 't' ble", 4 ]
		] );
	} );

	test( 'get test title with double quote with spaces', () =>{
		const title = getTestTitles( `
			test("double with spaces", t => {})
		` );

		assert.deepEqual( title, [
			[ 'double with spaces', 4 ]
		] );
	} );

	test( 'get test title with concatenation', () =>{
		const title = getTestTitles( `
			test( 'test' + 'title', t => {})
		` );

		assert.deepEqual( title, [
			[ 'testtitle', 4 ]
		] );
	} );

	test( 'get test title in another line', () =>{
		const title = getTestTitles( `
			test(
				'test title', t => {})
		` );

		assert.deepEqual( title, [
			[ 'test title', 4 ]
		] );
	} );

	test( 'get test title in backticks', () =>{
		const title = getTestTitles( `
			test( \`backtick\`, t => {})
		` );

		assert.deepEqual( title, [
			[ 'backtick', 4 ]
		] );
	} );

	test( 'get test title in backticks multiline', () =>{
		const title = getTestTitles( `
			test( \`backtick
			 multiline\`, t => {})
		` );

		assert.deepEqual( title, [
			[ 'backtick multiline', 4 ]
		] );
	} );


	test( 'get test titles in multicases', () =>{
		const title = getTestTitles( `
			test( 'first case', t => {})

			test( 'second case', t => {})
		` );

		assert.deepEqual( title, [
			[ 'first case', 4 ],
			[ 'second case', 37 ]
		] );
	} );

} );
