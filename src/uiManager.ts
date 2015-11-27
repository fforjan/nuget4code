"user strict";

import * as vscode from "vscode";

interface IPackageSelection extends vscode.QuickPickItem {
	associatedPackage: INugetPackage;
}

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
	
	public selectPackage(packages: INugetPackage[]): Thenable<INugetPackage> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach(element => {

			packagesInfo.push({
					label: element.title,
					description: element.description,
					associatedPackage: element
				});
		});
		
		return vscode.window.showQuickPick(packagesInfo).then( result => { return result.associatedPackage});
	}
	
	public displayPackage(message: string, packageInfo: INugetPackage): void {
		
		vscode.window.showInformationMessage(`${message} : ${packageInfo.id}[${packageInfo.version}]`);	
	}
}
