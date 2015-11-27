"use strict"

import * as vscode from "vscode"; 
import * as http from "http";

export default class NugetManager {
	public getCurrentPackages(): Thenable<{ [id: string] : string; }> {
		return vscode.workspace.findFiles("project.json", "")
					.then((files: vscode.Uri[]) =>
					{
						var parsedJSON: any = require(files[0].fsPath);
						return parsedJSON.dependencies;
					});
	}

	public queryPackage(namePattern: string) : Thenable<{ id: string, version: string}> {

		return new Promise<{ id: string, version: string}>(
			(resolve: (value: { id: string, version: string} ) => void, reject: (reason?: any) => void) =>
				{
					http.get("http://api-v3search-0.nuget.org/query?q=Id:fluent",
							(resp: http.IncomingMessage) => {
								// explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
								resp.setEncoding('utf8');

								// incrementally capture the incoming response body
								var body: string = "";
								resp.on("data", chunk => { body += chunk;});

								// do whatever we want with the response once it's done
								resp.on("end", () => {
									try {
										var parsed: any = JSON.parse(body);
										resolve(parsed.data[0]);
									} catch (error) {
										return reject(error);
									}});
								resp.on("error", (e: any) => { reject(e); });
								});
				});
	}
}
