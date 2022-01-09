import { ActionFunction, json } from 'remix';
import { db } from '~/utils/db.server';

// return type of this action 
export type NewTaskActionData = {
  formError?: string;
  fieldErrors?: {
    task?: string;
  };
  fields?: {
    task?: string;
  };
  ok?: boolean;
};

const badRequest = (data: NewTaskActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  //setting values to fields from request
  const form = await request.formData();
  type fieldType = 'task';
  const fieldList: fieldType[] = ['task'];
  const fields = {} as Record<fieldType, string>;

  for (const fieldName of fieldList) {
    const fieldValue = form.get(fieldName) || '';
    fields[fieldName] = fieldValue as string;
  }

  //validation
  let fieldErrors = {} as Record<fieldType, string>;

  if (!fields.task) {
    fieldErrors.task = 'Task cannot be empty';
    return badRequest({ fieldErrors, fields });
  }

   //adding task to database
  try {
    await db.task.create({
      data: {
        name: fields.task,
      },
    });
  } catch (err) {
    console.log('Error', err);
    return badRequest({
      formError: err.message,
    });
  }
  return json({ ok: true });
};
