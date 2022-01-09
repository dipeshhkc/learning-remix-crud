import { ActionFunction, json, redirect } from 'remix';
import { db } from '~/utils/db.server';

// return type of this action 
export type DeleteTaskActionData = {
  formError?: string;
  fieldErrors?: {
    taskId?: string;
  };
  fields?: {
    taskId?: string;
  };
  ok?: boolean;
};

const badRequest = (data: DeleteTaskActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  //setting values to fields from request
  const form = await request.formData();
  type fieldType = 'taskId';
  const fieldList: fieldType[] = ['taskId'];
  const fields = {} as Record<fieldType, string>;

  for (const fieldName of fieldList) {
    const fieldValue = form.get(fieldName) || '';
    fields[fieldName] = fieldValue as string;
  }

  //validation
  let fieldErrors = {} as Record<fieldType, string>;

  if (!fields.taskId) {
    fieldErrors.taskId = 'No Task Id provided';
    return badRequest({ fieldErrors, fields });
  }

  //deleting task to database
  try {
    await db.task.delete({
      where: {
        id: fields.taskId,
      },
    });
  } catch (err) {
    return badRequest({
      formError: err.message,
    });
  }
  return redirect('/');
};
