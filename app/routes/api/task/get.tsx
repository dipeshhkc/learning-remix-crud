import { LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async () => {
  return db.task.findMany();
};
