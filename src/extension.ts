"use strict";

import * as vscode from "vscode";

import NugetManager from "./nugetManager";

import UiManager from "./uiManager";

const nugetManager: NugetManager = new NugetManager();
const uiManager: UiManager = new UiManager();

export function activate(context: vscode.ExtensionContext): void {
	"use strict";

	// register our nuget command
	var disposable: vscode.Disposable = vscode.commands.registerCommand("extension.nuget4code.install", nugetInstall);
	context.subscriptions.push(disposable);

	disposable  = vscode.commands.registerCommand("extension.nuget4code.remove", nugetRemove);
	context.subscriptions.push(disposable);

	disposable  = vscode.commands.registerCommand("extension.nuget4code.upgrade", nugetUpgrade);
	context.subscriptions.push(disposable);
}

/**
 * Install a package int the current project :
 * From a package id pattern, matching results from the nuget repository are displayed
 * to be picked by the user.
 */
function nugetInstall(): void {
	"use strict";

	// display all nuget packages to the user so he can select on.
	uiManager.queryPackagePattern()
		.then( (idPattern: string ) => nugetManager.queryPackage(idPattern) )
		.then( (packages: INugetPackageInfo[]) => { return uiManager.selectPackage(packages); } )
		.then( (selected: INugetPackageInfo) => { nugetManager.addedOrUpdatePackage(selected); });
}

/**
 * Remove a package from the current project.
 */
function nugetRemove(): void {
	"use strict";
	nugetManager.getCurrentPackages()
					.then(
						( packages: INugetPackageId[] ) => { return uiManager.selectPackageFromId(packages); },
						() => vscode.window.showInformationMessage("no packages available in the current project"))
					.then(
						( packageId: INugetPackageId ) => { return nugetManager.removePackage(packageId); },
						() => { console.warn("user cancelled package selection"); });
}

function nugetUpgrade(): void {
	"use strict";

	// display all nuget packages to the user so he can select on.
	nugetManager.getCurrentPackages()
		.then( ( packages: INugetPackageId[] ) => { return nugetManager.getFullInformation(packages); })
		.then( ( information: { current: INugetPackageId, latest: INugetPackageInfo }[]) => { return uiManager.pickForUpgrade(information); })
		.then( (selected: INugetPackageInfo) => { nugetManager.addedOrUpdatePackage(selected); });
}
