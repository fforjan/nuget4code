"use strict";

import * as vscode from "vscode";

import NugetManager from "./nugetManager";

import UiManager from "./uiManager";

const nugetManager: NugetManager = new NugetManager();
const uiManager: UiManager = new UiManager();

export function activate(context: vscode.ExtensionContext): void {
	"use strict";

	// register our nuget command
	var disposable: vscode.Disposable = vscode.commands.registerCommand("extension.nuGet.query", () => {
		// display all nuget packages to the user
		nugetManager.queryPackage("fluent").then(uiManager.selectPackage).then( (selected: INugetPackageInfo) => {
			uiManager.displayPackage("selected", selected); }
			);
	});
	context.subscriptions.push(disposable);

	disposable  = vscode.commands.registerCommand("extension.nuGet.remove", () => {
		// display all nuget packages to the user
		nugetManager.getCurrentPackages().then(uiManager.selectPackageFromId).then( nugetManager.removePackage);
	});
}
