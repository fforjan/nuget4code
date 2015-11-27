"user strict";

import * as vscode from "vscode";

interface IPackageSelection extends vscode.QuickPickItem {
	associatedPackage: INugetPackageId;
}

export default class UiManager {
	public selectPackageFromId(packages: INugetPackageId[]): Thenable<INugetPackageId> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach((element: INugetPackageId) => {

			packagesInfo.push({
					label: element.id,
					description: element.version,
					associatedPackage: element
				});
		});

		return vscode.window.showQuickPick(packagesInfo).then( (result: IPackageSelection) => { return result.associatedPackage; } );
	}

	public selectPackage(packages: INugetPackageInfo[]): Thenable<INugetPackageInfo> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach((element: INugetPackageInfo) => {

			packagesInfo.push({
					label: element.title,
					description: element.description,
					associatedPackage: element
				});
		});

		return vscode.window.showQuickPick(packagesInfo).then( (result: IPackageSelection) => { return result.associatedPackage; } );
	}

	public displayPackage(message: string, packageInfo: INugetPackageId): void {

		vscode.window.showInformationMessage(`${message} : ${packageInfo.id}[${packageInfo.version}]`);	
	}
}
