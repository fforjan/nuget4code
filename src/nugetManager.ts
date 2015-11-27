"use strict";

import * as vscode from "vscode";

import * as http from "http";

import * as fs from "fs";

export default class NugetManager {

	public getCurrentPackages(): Thenable<INugetPackageId[]> {
		return this.getCurrentProjectFile()
				.then( (project: vscode.Uri ) =>
					{
						var parsedJSON: any = require(project.fsPath);
						var result: INugetPackageId[] = [];
						for (var key in parsedJSON.dependencies) {
							if (parsedJSON.dependencies.hasOwnProperty(key)) {
								result.push({
									id: key,
									version: parsedJSON.dependencies[key]});
							}
						}

						if (result.length === 0)
						{
							throw "not packages are referenced";
						}

						return result;
					});
	}

	/**
	 * Remove a package identified by the package id from the current project file.
	 * 
	 * @param packageId package to be removed
	 */
	public removePackage( packageId: INugetPackageId): Thenable<void> {
		return this.getCurrentProjectFile()
					.then(
						(project: vscode.Uri ) =>
							{
								var parsedJSON: any = require(project.fsPath);
								if (parsedJSON.dependencies.hasOwnProperty(packageId.id))
								{
									delete parsedJSON.dependencies[packageId.id];
									fs.writeFileSync(project.fsPath, JSON.stringify(parsedJSON, null, 4));
								} else {
									throw "Packages is already removed";
								}
							}
						);
	}

	/**
	 * Query Nuget repository for returning packages information matching the id pattern
	 *
	 * @param idPattern pattern to be used for lookup.
	 */
	public queryPackage(idPattern: string): Thenable<INugetPackageInfo[]> {

		return this.getJsonResponse(this.getQueryUri(idPattern))
				.then( (result: any) => result.data);
	}

	/**
	 * Get the nuget query uri with a filter on a specific patern on the id
	 * 
	 * @param idPattern pattern to be used for filtering.
	 */
	private getQueryUri(idPattern: string): string {
		return "http://api-v3search-0.nuget.org/query?q=Id:" + idPattern + "&take=10";
	}

	private getCurrentProjectFile(): Thenable<vscode.Uri> {
		return vscode.workspace.findFiles("project.json", "")
					.then(
						(files: vscode.Uri[]) =>
							{
								if (files.length > 1) {
									throw "More than one project is available, cannot decide";
								}

								return files[0];
							},
						(reason: any) => { throw "no project.json found"; });
	}

	/**
	 * trigger a web request (no https supported at that time) and return the parse result.
	 * 
	 * @param uri URI to be used for the web request
	 * @return the JSON parsed result of the web request
	 */
	private getJsonResponse(uri: string): Thenable<any> {
		return new Promise<any>(
			(resolve: (value: any ) => void, reject: (reason?: any) => void) =>
				{
					http.get(
						uri,
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
									resolve(parsed);
								} catch (error) {
									return reject(error);
								}});
							resp.on("error", (e: any) => { reject(e); });
						});
				});
	}
}
