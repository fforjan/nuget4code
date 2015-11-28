
interface INugetPackageId {
		id: string;
		version: string;
}

interface INugetPackageInfo extends INugetPackageId {
	registration: string;
	description: string;
	title: string;
	authors: string[];
	totalDownloads: number;
	versions: { version: string, download: number}[];
}
