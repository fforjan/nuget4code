interface INugetPackage {
	registration: string,
	id: string,
	description: string,
	title: string,
	authors: string[],
	totalDownloads: number,
	version: string,
	versions: { version: string, download:number}[]
}