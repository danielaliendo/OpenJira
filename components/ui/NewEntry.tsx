import {ChangeEvent, useContext, useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import {AddRounded, SaveOutlined} from "@mui/icons-material";
import {EntriesContext} from "../../context/entries";
import {UIContext} from "../../context/ui";

export const NewEntry = () => {

    const {
        isAddingEntry,
        setIsAddingEntry
    } = useContext(UIContext);

    const {
        addNewEntry
    } = useContext(EntriesContext);

    const [inputValue, setInputValue]  = useState('');
    const [touched, setTouched]  = useState(false);

    const onTextFieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const onSaveChanges = () => {
        if (inputValue.length === 0) return;

        addNewEntry(inputValue);

        setIsAddingEntry(false);
        setInputValue('');
        setTouched(false);
    }

    return (
        <Box sx={{marginBottom: 2, paddingX: 1}}>
            {isAddingEntry
                ? (
                    <>
                        <TextField
                            fullWidth
                            sx={{marginTop: 2, marginBottom: 1}}
                            placeholder={'Nueva entrada'}
                            autoFocus
                            multiline
                            label={'Nueva entrada'}
                            onBlur={() => setTouched(true)}
                            value={inputValue}
                            error={inputValue.length === 0 && touched}
                            onChange={onTextFieldChanged}
                            helperText={inputValue.length === 0 && touched && 'Ingresar texto'}
                        />
                        <Box display='flex' justifyContent='space-between'>
                            <Button
                                variant='text'
                                onClick={() => setIsAddingEntry(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant='outlined'
                                color='secondary'
                                startIcon={<SaveOutlined/>}
                                onClick={onSaveChanges}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Button
                        startIcon={<AddRounded/>}
                        variant='outlined'
                        fullWidth
                        onClick={() => setIsAddingEntry(true)}
                    >
                        Agregar tarea
                    </Button>
                )
            }

        </Box>
    )
}