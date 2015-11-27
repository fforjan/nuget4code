'use strict'

import * as vscode from 'vscode'; 
import nugetManager from './nugetManager';
import uiManager from './uiManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nuget4code" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.nuGet', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
			nugetManager.GetCurrentPackages()
			.then( uiManager.DisplayPackages)
	});
	
	context.subscriptions.push(disposable);
}