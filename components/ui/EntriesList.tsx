import {FC, useContext, useMemo, DragEvent} from "react";
import {List, Paper} from "@mui/material";
import {EntriesContext} from "../../context/entries";
import {EntryStatus} from "../../interfaces";
import {EntryCard} from "./";
import {UIContext} from "../../context/ui";
import styles from './Entry.module.css';

interface Props {
    status: EntryStatus
}

export const EntriesList:FC<Props> = ({status}) => {

    const {
        isDragging,
        endDragging
    } = useContext(UIContext);

    const {
        entries,
        updateEntry
    } = useContext(EntriesContext);

    const entriesByStatus = useMemo(() =>   entries.filter(entry => entry.status === status), [entries])

    const onDropEntry = (event: DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData('id')
        const entry = entries.find(e => e._id === id)!;
        updateEntry({...entry, status});
        endDragging();
    }

    const allowDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    return (
        <div className={ isDragging ? styles.dragging : ''} onDrop={onDropEntry} onDragOver={allowDrop}>
            <Paper elevation={0} sx={{height: 'calc(100vh - 250px)', padding: 1, overflow: 'auto', backgroundColor: 'transparent'}}>
                <List sx={{opacity: isDragging ? 0.2 : 1, padding: 0, transition: 'all .3s'}}>
                    {
                        entriesByStatus.map(entry => (
                            <EntryCard key={entry._id} entry={entry}/>
                        ))
                    }
                </List>
            </Paper>
        </div>
    )
}