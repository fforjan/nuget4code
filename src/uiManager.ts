"user strict";

import * as vscode from "vscode";

export default class UiManager {
	public displayPackages(packages: { [ id: string ]: string; }): void {
		var packagesInfo: string[] = [];

		for (var packageId in packages) {
			if (packages.hasOwnProperty(packageId)) {
				var version: string = packages[packageId];
				packagesInfo.push(`${packageId}[${version}]`);
			}
		}
		
		vscode.window.showQuickPick(packagesInfo);	
	}
	
	public displayPackage(packageInfo:  { id: string, version: string}): void {
		
		vscode.window.showInformationMessage(`matching package : ${packageInfo.id}[${packageInfo.version}]`);	
	}
}
