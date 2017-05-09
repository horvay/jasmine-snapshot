declare module 'jasmine-snapshot' {
	export let KeyExceptionList: string[];
	export let MatchesSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesXMLSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesJSONSnapshot: (snapshot: string, actual: string) => void;
	export let MatchesJSSnapshot: (snapshot: string, actual: any) => void;
	export let ResetExceptionList: () => void;

	export function registerSnapshots(snapshot_object: { [key: string]: string }, suiteNname: string)

	export class SnapshotJSInner
	{
		constructor(actual: Object);
		public toMatchSnapshot(snapshot?: string): void;
		public afterApplying(transformFunction: (actual: Object) => Object);
	}


	export class SnapshotXMLInner
	{
		constructor(actual: string);
		public toMatchSnapshot(snapshot?: string): void;
		public afterApplying(transformFunction: (actual: string) => string);
	}

	export function expectjs(actual: Object): SnapshotJSInner;
	export function expectxml(xml_actual: string): SnapshotJSInner;
}
