import {Layout} from "../../components/layouts";
import {
    Button,
    Card,
    CardActions,
    FormControl,
    CardContent,
    CardHeader,
    FormLabel,
    Grid,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio, capitalize, IconButton
} from "@mui/material";
import {DeleteOutlined, SaveOutlined} from "@mui/icons-material";
import {Entry, EntryStatus} from "../../interfaces";
import {ChangeEvent, FC, useContext, useMemo, useState} from "react";
import {GetServerSideProps} from "next";
import {dbEntries} from '../../database';
import {EntriesContext} from "../../context/entries";
import {dateFunctions} from '../../utils';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished']

interface Props {
    entry: Entry
}

const EntryPage: FC<Props> = ({entry}) => {

    const {
        updateEntry
    } = useContext(EntriesContext)

    const [inputValue, setInputValue] = useState(entry.description);
    const [status, setStatus] = useState<EntryStatus>(entry.status);
    const [touched, setTouched] = useState(false);

    const isNotValid = useMemo(() => inputValue.length === 0 && touched, [touched, inputValue])

    const onTextFieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as EntryStatus);
    }

    const onSave = () => {

        if (inputValue.trim().length === 0) return;

        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue,
        }

        updateEntry(updatedEntry, true);

    }

    return (
        <Layout title={inputValue.substring(0, 20) + '...'}>
            <Grid
                container
                justifyContent='center'
                sx={{marginTop: 2}}
            >
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader
                            title={`Entrada:`}
                            subheader={`Creada ${dateFunctions.getFormatTimeToNow(entry.createdAt)}`}
                        />
                        <CardContent>
                            <TextField
                                sx={{marginTop: 2, marginBottom: 1}}
                                fullWidth
                                placeholder={'Nueva entrada'}
                                autoFocus
                                multiline
                                label={'Nueva entrada'}
                                value={inputValue}
                                onChange={onTextFieldChanged}
                                onBlur={() => setTouched(true)}
                                error={isNotValid}
                                helperText={isNotValid && 'Ingrese un valor'}
                            />

                            <FormControl>
                                <FormLabel>Estado</FormLabel>
                                <RadioGroup
                                    row
                                    value={status}
                                    onChange={onStatusChanged}
                                >
                                    {
                                        validStatus.map(status => (
                                            <FormControlLabel
                                                key={status}
                                                value={status}
                                                control={<Radio/>}
                                                label={capitalize(status)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>

                        </CardContent>
                        <CardActions>
                            <Button
                                disabled={inputValue.length === 0}
                                startIcon={<SaveOutlined/>}
                                variant='contained'
                                fullWidth
                                onClick={onSave}
                            >
                                Guardar
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    backgroundColor: 'error.dark'
                }}
            >
                <DeleteOutlined/>
            </IconButton>
        </Layout>
    )
}

export default EntryPage

export const getServerSideProps: GetServerSideProps = async ({params}) => {

    const {id} = params as { id: string };

    const entry = await dbEntries.getEntriesById(id);

    if (!entry) {

        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    }

    return {
        props: {
            entry
        }
    }

}

