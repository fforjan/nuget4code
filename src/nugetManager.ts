import * as vscode from 'vscode'; 

export default class nugetManager {
	public static GetCurrentPackages(): Thenable<{ [id: string] : string; }> {
		return vscode.workspace.findFiles('project.json', '')
					.then((files:vscode.Uri[]) =>
					{
						var parsedJSON = require(files[0].fsPath); 
						return parsedJSON.dependencies;
					});
	}
}