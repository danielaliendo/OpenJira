import {FC, ReactNode, useEffect, useReducer} from "react";
import {entriesReducer} from "./entriesReducer";
import {EntriesContext} from "./EntriesContext";
import {Entry} from "../../interfaces";
import {entriesApi} from "../../api";
import {useSnackbar} from "notistack";

export interface EntriesState {
    entries: Entry[];
}

const ENTRIES_INITIAL_STATE: EntriesState = {
    entries: []
}

interface Props {
    children: ReactNode
}

export const EntriesProvider: FC<Props> = ({children}) => {

    const [state, dispatch] = useReducer(entriesReducer, ENTRIES_INITIAL_STATE);
    const {enqueueSnackbar} = useSnackbar();

    const refreshEntries = async () => {

        const {data} = await entriesApi.get<Entry[]>('/entries');
        dispatch({type: '[Entries] - refresh Entries data', payload: data})

    }

    useEffect(() => {
        refreshEntries();
    }, []);

    const addNewEntry = async (description: string) => {

        const {data} = await entriesApi.post<Entry>('/entries', {description});

        dispatch({
            type: '[Entries] - Add Entry',
            payload: data
        });

    };

    const updateEntry = async ({_id, status, description}: Entry, showSnackbar = false) => {

        try {

            const {data} = await entriesApi.put<Entry>(`/entries/${_id}`, {description, status})
            dispatch({type: '[Entries] - Update Entry', payload: data})

            if (showSnackbar) {

                enqueueSnackbar('Entrada actualizada', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <EntriesContext.Provider value={{
            ...state,
            addNewEntry,
            updateEntry
        }}>
            {children}
        </EntriesContext.Provider>
    )

}
