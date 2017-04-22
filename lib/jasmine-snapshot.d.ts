declare module 'jasmine-snapshot' {
	export let KeyExceptionList: string[];
	export let MatchesSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesXMLSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesJSONSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesJSSnapshot: (snapshot: string, actual: any) => void;
	export let ResetExceptionList: () => void;
}
