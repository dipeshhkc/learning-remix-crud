import { LoaderFunction } from '@remix-run/server-runtime';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async () => {
  return db.task.findMany();
};
