"use strict";

import * as vscode from "vscode";
import NugetManager from "./nugetManager";
import UiManager from "./uiManager";

const nugetManager: NugetManager = new NugetManager();
const uiManager: UiManager = new UiManager();

export function activate(context: vscode.ExtensionContext) {

	// register our nuget command
	var disposable : vscode.Disposable = vscode.commands.registerCommand("extension.nuGet", () => {
		// display all nuget packages to the user
		nugetManager.queryPackage("fred forjan").then(uiManager.selectPackage).then( (selected: INugetPackage) => {
			uiManager.displayPackage("selected", selected);}
			);
	});

	context.subscriptions.push(disposable);
}
