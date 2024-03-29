import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha( {
		ui: 'tdd',
		color: true
	} );

	const testsRoot = path.resolve( __dirname, '..' );

	return new Promise( async ( resolve, reject ) => {
		const testFiles = await glob( '**/**.test.js', { cwd: testsRoot } );

		testFiles.forEach( f => mocha.addFile( path.resolve( testsRoot, f ) ) );

		try {
			// Run the mocha test
			mocha.run( failures => {
				if ( failures > 0 ) {
					reject ( new Error( `${failures} tests failed.` ) );
				} else {
					resolve();
				}
			} );
		} catch ( err ) {
			console.error( err );
			reject( err );
		}
		} );
}
