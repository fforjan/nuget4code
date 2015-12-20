"use strict";

import * as vscode from "vscode";

import * as semver from "semver";

interface IPackageSelection extends vscode.QuickPickItem {
	associatedPackage: INugetPackageId;
}

/**
 * UI Manager for all nuget related activities.
 */
export default class UiManager {

	/**
	 * Ask the user to make a choice between packages from reduced package information
	 */
	public selectPackageFromId(activity: string, packages: INugetPackageId[]): Thenable<INugetPackageId> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach((element: INugetPackageId) => {

			packagesInfo.push({
					label: element.id,
					description: element.version,
					associatedPackage: element
				});
		});

		return vscode.window
				.showQuickPick(packagesInfo, { placeHolder: `Select a package for ${activity}`})
				.then( (result: IPackageSelection) => { return result.associatedPackage; } );
	}

	/**
	 * Ask the user to make a choice between packages from full package information
	 */
	public selectPackage(activity: string, packages: INugetPackageInfo[]): Thenable<INugetPackageInfo> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach((element: INugetPackageInfo) => {

			packagesInfo.push({
					label: `${element.title} - ${element.version}`,
					description: element.description,
					associatedPackage: element
				});
		});

		return vscode.window
				.showQuickPick(packagesInfo, { placeHolder: `Select a package for ${activity}`})
				.then( (result: IPackageSelection) => { return result.associatedPackage; } );
	}

	/**
	 * Display some information about the package.
	 * 
	 * @param message prefix to be displayed
	 * @param packageInfo package information
	 */
	public displayPackage(message: string, packageInfo: INugetPackageId): void {

		vscode.window.showInformationMessage(`${message} : ${packageInfo.id}[${packageInfo.version}]`);
	}

	/**
	 * Ask the user for a package filter information
	 */
	public queryPackagePattern(): Thenable<string> {
		return vscode.window.showInputBox({ prompt: "Enter package filter :"});
	}

	public pickForUpgrade(packages: { current: INugetPackageId, latest: INugetPackageInfo }[]): Thenable<INugetPackageInfo> {
		var packagesInfo: IPackageSelection[] = [];

		packages.forEach((element: { current: INugetPackageId, latest: INugetPackageInfo }) => {

			try {
				if (semver.gt(element.latest.version, element.current.version ) )
				{
					packagesInfo.push({
						label: `Upgrade ${element.latest.title}`,
						description: `from ${element.current.version} to ${element.latest.version}`,
						associatedPackage: element.latest
					});
				}
			} catch (exception) {
				if ((exception instanceof TypeError)) {
					console.log(`cannot parse version for package ${element.current.id} : ${exception}`);
				} else
				{
					throw exception;
				}
			}
		});

		if (packagesInfo.length === 0 ) {
			vscode.window.showInformationMessage("nothing to upgrade");
			throw "nothing to upgrade";
		}

		return vscode.window
				.showQuickPick(packagesInfo, { placeHolder: "Select a package for upgrade"} )
				.then( (result: IPackageSelection) => { return result.associatedPackage; } );
	}
}
