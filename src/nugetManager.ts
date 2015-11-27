"use strict"

import * as vscode from "vscode"; 

export default class NugetManager {
	public getCurrentPackages(): Thenable<{ [id: string] : string; }> {
		return vscode.workspace.findFiles("project.json", "")
					.then((files: vscode.Uri[]) =>
					{
						var parsedJSON: any = require(files[0].fsPath);
						return parsedJSON.dependencies;
					});
	}
}
