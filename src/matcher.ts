export function hasTestDeclaration(content: string): boolean{
	const match = content.match(/test\(/);// test( followed by any whitespaces and semi / single / backtick

	return match !== null;
}