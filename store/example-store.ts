import {createStore, partializeInclude} from './create-store';

interface IState {
    isExample: boolean;
}

interface IStore extends IState {
    setIsExample: (isExample: IState['isExample']) => void;
}

const initialState: IState = {
    isExample: false
};

const useExampleStore = createStore<IStore>({
    store: set => ({
        ...initialState,
        setIsExample: isExample => set({isExample})
    }),
    partialize: state => partializeInclude(state, []),
    name: 'exampleStore'
});

export default useExampleStore;
