/**
 * Looking for:
 * - single quote '
 * - double quote "
 * - backtick `
 * @param content
 */
export function findTestTitleOpeningCharacter(
	content: string
): [string, number] {
	const re = /(?<character>('|"|`){1})/;
	const match = content.match( re );

	const char = match?.groups?.character ?? '';
	const pos = match?.index ?? -1;

	return [ char, pos ];
}

export function findEndTestTitle( content: string, char: string ): number {
	// find endquote followed by coma
	// given char is the char used for quotation

	const result = content.indexOf( `${char},` );

	return result;
}

/**
 * Find test case titles & theor place in the code
 *
 * @param codeContent
 * @returns [test title, index] index of character in the code that starts the test case declaration
 */
export function getTestTitles( codeContent: string ): Array<[string, number]> {
	const re = /test( )?\(/g;
	const eachLineRegExp = new RegExp( re );

	let matches;
	const testCases: Array<[string, number]> = [];
	while ( ( matches = eachLineRegExp.exec( codeContent ) ) !== null ) {
		const testCaseStartingContent = codeContent.slice( matches.index );
		const [ char, startPos ] = findTestTitleOpeningCharacter(
			testCaseStartingContent
		);
		const endPos = findEndTestTitle( testCaseStartingContent, char );
		let title = testCaseStartingContent.slice( startPos + 1, endPos );
		title = title.replace( /(\n|\t)/g, '' );

		testCases.push( [ title, matches.index ] );
	}

	return testCases;
}
