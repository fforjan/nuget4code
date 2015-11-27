"use strict";

import * as vscode from "vscode"; 

import * as http from "http";

import * as fs from "fs";

export default class NugetManager {

	public getCurrentPackages(): Thenable<INugetPackageId[]> {
		return vscode.workspace.findFiles("project.json", "")
					.then((files: vscode.Uri[]) =>
					{
						var parsedJSON: any = require(files[0].fsPath);
						var result: INugetPackageId[] = [];
						for (var key in parsedJSON.dependencies) {
							if (parsedJSON.dependencies.hasOwnProperty(key)) {
								result.push({
									id: key,
									version: parsedJSON.dependencies[key]});
							}
						}

						return result;
					});
	}

	public removePackage( packageId: INugetPackageId): Thenable<void> {
		return vscode.workspace.findFiles("project.json", "")
					.then(
						(files: vscode.Uri[]) =>
							{
								var parsedJSON: any = require(files[0].fsPath);
								if (parsedJSON.dependencies.hasOwnProperty(packageId.id))
								{
									delete parsedJSON.dependencies[packageId.id];
									fs.writeFileSync(files[0].fsPath, JSON.stringify(parsedJSON, null, 4));
								}
							},
						(reason: any) => { throw "no project.json found"; });
	}

	public queryPackage(namePattern: string): Thenable<INugetPackageInfo[]> {

		return new Promise<INugetPackageInfo[]>(
			(resolve: (value: INugetPackageInfo[] ) => void, reject: (reason?: any) => void) =>
				{
					http.get(
						`http://api-v3search-0.nuget.org/query?q=Id:${namePattern}&take=10`,
						(resp: http.IncomingMessage) => {
							// explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
							resp.setEncoding("utf8");

							// incrementally capture the incoming response body
							var body: string = "";
							resp.on("data", (chunk: any) => { body += chunk; });

							// do whatever we want with the response once it's done
							resp.on("end", () => {
								try {
									var parsed: any = JSON.parse(body);
									resolve(parsed.data);
								} catch (error) {
									return reject(error);
								}});
							resp.on("error", (e: any) => { reject(e); });
						});
				});
	}
}
