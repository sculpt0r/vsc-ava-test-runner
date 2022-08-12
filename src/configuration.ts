import { workspace } from 'vscode';

export class Configuration {
	private readonly configNamespace = 'ava-runner';
	private featuresEnabled = false;
	private packageManager = '';

	private constructor(){
		const vscWorksapceConfig = workspace.getConfiguration( this.configNamespace );

		this.featuresEnabled = vscWorksapceConfig.get<boolean>( 'experimentalEnabled' ) ?? false;
		this.packageManager = vscWorksapceConfig.get<string>( 'packageManager' ) ?? 'npm';
	}

	public static load(): Configuration{
		const config = new Configuration();

		return config;
	}

	public areExperimentalsEanbled(): boolean{
		return this.featuresEnabled;
	}

	public getPackageManager(): string{
		return this.packageManager;
	}
}
