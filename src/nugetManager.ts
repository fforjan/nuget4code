"use strict";

import * as vscode from "vscode";

import * as https from "https";

import * as http from "http";

import * as fs from "fs";

/**
 * Manager related to nuget and visual studio code
 * FIXME base class unrelated to vs code could be completely reused outisde ?? 
 */
export default class NugetManager {

	private queryEndpoint: string;
	private endPointsInitialization: Thenable<void>;

	/**
	 * Constructor
	 * 
	 * @initialize only use for unit testing to not trigger full initialization
	 */
	constructor(initialize: boolean = true) {
		if ( initialize) {
			var repository: string = vscode.workspace.getConfiguration("nuget4code")["repository"];
			this.endPointsInitialization = this.getJsonResponse(repository)
				.then( (servicesIndex: any) => {
					var allEndpoints: { "@id": string, "@type": string}[] = servicesIndex.resources;
					return allEndpoints
							.find( (endpoint: { "@id": string, "@type": string}) => endpoint["@type"] === "SearchQueryService")
							["@id"];
				})
				.then( (endpoint: string) => { this.queryEndpoint = endpoint; });

				// fixme support invalid endpoint !
		}
	}

	/**
	 * Get the list of the currently referenced packages
	 */
	public getCurrentPackages(): Thenable<INugetPackageId[]> {
		return this.getCurrentProjectFile()
				.then( (project: vscode.TextDocument ) =>
					{
						var parsedJSON: any = JSON.parse(fs.readFileSync(project.fsPath, "utf8"));
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

	public getFullInformation(packages: INugetPackageId[]): Thenable<{ current: INugetPackageId, latest: INugetPackageInfo }[]>
	{
		var requests: Thenable<{ current: INugetPackageId, latest: INugetPackageInfo }>[] = [];

		packages.forEach( (element: INugetPackageId) => {
			requests.push(
					this.queryPackage(element.id)
						.then( (result: INugetPackageInfo[] ) => { return { current: element, latest: result[0] }; }) );
		});

		return Promise.all(requests);
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
								var parsedJSON: any = JSON.parse(fs.readFileSync(project.fsPath, "utf8"));
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
	 * Add a package identified by the package id from the current project file.
	 * 
	 * @param packageId package to be added
	 */
	public addedOrUpdatePackage( packageId: INugetPackageId): Thenable<void> {
		return this.getCurrentProjectFile()
					.then(
						(project: vscode.Uri ) =>
							{
								var parsedJSON: any = JSON.parse(fs.readFileSync(project.fsPath, "utf8"));
								if (!parsedJSON.hasOwnProperty("dependencies"))
								{
									parsedJSON.dependecies = [];
								}

								parsedJSON.dependencies[packageId.id] = packageId.version;

								fs.writeFileSync(project.fsPath, JSON.stringify(parsedJSON, null, 4));
							}
						);
	}

	/**
	 * Query Nuget repository for returning packages information matching the id pattern
	 *
	 * @param idPattern pattern to be used for lookup.
	 */
	public queryPackage(idPattern: string): Thenable<INugetPackageInfo[]> {
		// we can only do our query if it was initialised properly
		return this.endPointsInitialization
			.then(
				() => {
					return this.getJsonResponse(this.getQueryUri(idPattern))
						.then( (result: any) => result.data); },
				() => {
					return [];
				});
	}

	/**
	 * Get the nuget query uri with a filter on a specific patern on the id
	 * 
	 * @param idPattern pattern to be used for filtering.
	 */
	private getQueryUri(idPattern: string): string {
		return this.queryEndpoint + "?q=Id:" + idPattern + "&take=10";
	}

	private getCurrentProjectFile(): Thenable<vscode.TextDocument> {
		return this.getAllProjectFile().then(
						(files: vscode.Uri[]) =>
							{
								if (files.length === 0 ) {
									throw "no project.json found";
								}

								if (files.length > 1) {
									var openedProjectFile: vscode.Uri = this.getActiveDocumentAsProjectJson();
									if (openedProjectFile !== null)
									{
										return openedProjectFile;
									}

									throw "More than one project is available with no active one, cannot decide";
								}

								return files[0];
							},
						(reason: any) => {
							throw "error while looking for project.json"; });
	}

	/**
	 * Get all project file from the workspace.
	 * @remark specific method for unit testing.
	 */
	private getAllProjectFile(): Thenable<vscode.Uri[]> {
		return vscode.workspace.findFiles("**/project.json", "");
	}

	/**
	 * Get active project file from the workspace, return null if none.
	 * @remark specific method for unit testing.
	 */
	private getActiveDocumentAsProjectJson(): vscode.Uri {
		if (!vscode.window.activeTextEditor.document.isUntitled
										&& vscode.window.activeTextEditor.document.fileName.endsWith("project.json"))
		{
			return vscode.window.activeTextEditor.document;
		}

		return null;
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
					https.get(
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
