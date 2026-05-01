export type IUpcLookupResult =
    | {kind: 'found'; name: string}
    | {kind: 'not-found'}
    | {kind: 'rate-limited'}
    | {kind: 'error'};
