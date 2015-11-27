import * as vscode from 'vscode'; 

export default class uiManager {
	public static DisplayPackages(packages : {[id: string] : string; }) {
		var packagesInfo: string[] = [];
		
		for (var packageId in packages) {
			if (packages.hasOwnProperty(packageId)) {
				var version = packages[packageId];
				packagesInfo.push( `${packageId}[${version}]`);
			}
		}
		
		vscode.window.showQuickPick(packagesInfo);	
	}
}