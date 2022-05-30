// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Entry, IEntry} from "../../../../models";
import {db} from '../../../../database';

type Data =
    | { message: string }
    | IEntry

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // const {id} = req.query;
    //
    // if (!mongoose.isValidObjectId(id)) {
    //     return res.status(400).json({message: 'No entry found with current id' + id})
    // }

    switch (req.method) {
        case 'PUT':
            return updateEntry(req, res);
        case 'GET':
            return getEntry(req, res);
        default:
            return res.status(400).json({message: 'Only PUT method is allowed'})
    }

}

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {id} = req.query;

    await db.connect()

    const entryToUpdate = await Entry.findById(id);

    if (!entryToUpdate) {
        await db.disconnect();
        return res.status(400).json({message: 'No entry found by current id'})
    }

    const {
        description = entryToUpdate.description,
        status = entryToUpdate.status
    } = req.body;

    try {

        const updatedEntry = await Entry.findByIdAndUpdate(id, {description, status}, {runValidators: true, new: true});
        await db.disconnect();
        res.status(200).json(updatedEntry!)

    } catch (error: any) {

        await db.disconnect();
        res.status(400).json({message: error.errors.status.message})

    }


};

const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {id} = req.query;

    await db.connect()

    const currentEntry = await Entry.findById(id);
    await db.disconnect();

    if (!currentEntry) {
        return res.status(400).json({message: 'No entry found by current id'})
    }

    return res.status(200).json(currentEntry)

}