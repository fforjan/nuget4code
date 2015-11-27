"user strict";

import * as vscode from "vscode";

export default class UiManager {
	public displayPackages(packages : {[id: string]: string;}): void {
		var packagesInfo: string[] = [];

		for (var packageId in packages) {
			if (packages.hasOwnProperty(packageId)) {
				var version: string = packages[packageId];
				packagesInfo.push(`${packageId}[${version}]`);
			}
		}
		
		vscode.window.showQuickPick(packagesInfo);	
	}
}
