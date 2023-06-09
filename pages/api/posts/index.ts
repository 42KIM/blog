import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import { withErrorHandler } from '@/lib/server-error-handler';
import Posts from '@/models/Posts';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    const result = await Posts.create(req.body);
    res.status(200).json(result);
  }

  if (method === 'PUT') {
    const { _id, ...rest } = req.body;

    await Posts.updateOne({ _id: new ObjectId(_id) }, rest);

    res.status(200).end();
  }

  // TODO - 유효하지 않은 id를 넣어도 에러가 발생하지 않는다.
  if (method === 'DELETE') {
    await Posts.deleteOne({ _id: new ObjectId(req.body._id) });

    res.status(200).end();
  }
}

export default withErrorHandler(handler);
