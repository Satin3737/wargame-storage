'use client';

import {useEffect, useRef, useState} from 'react';

interface IInternal {
    blob: Blob | null;
    url: string | null;
}

const useObjectUrl = (blob: Blob | null): string | null => {
    const [state, setState] = useState<IInternal>({blob: null, url: null});
    const latestUrlRef = useRef<string | null>(null);

    if (state.blob !== blob) {
        if (state.url) URL.revokeObjectURL(state.url);
        setState({blob, url: blob ? URL.createObjectURL(blob) : null});
    }

    useEffect(() => {
        latestUrlRef.current = state.url;
    }, [state.url]);

    useEffect(
        () => () => {
            if (latestUrlRef.current) URL.revokeObjectURL(latestUrlRef.current);
        },
        []
    );

    return state.url;
};

export default useObjectUrl;
