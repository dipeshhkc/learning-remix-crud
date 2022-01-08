import {
  BriefcaseIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/solid';
import {
  ActionFunction,
  json,
  LoaderFunction,
} from '@remix-run/server-runtime';
import { Form, useActionData, useLoaderData } from 'remix';

interface ITodo {
  id: string;
  title: string;
}

type NewTaskActionData = {
  formError?: string;
  fieldErrors?: {
    task?: string;
  };
  fields?: {
    task?: string;
  };
  ok?: boolean;
};

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos: ITodo[] = await response.json();
  return todos;
};

const badRequest = (data: NewTaskActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
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

  try {
    await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: fields.task,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
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

function TodoList() {
  const todos = useLoaderData<ITodo[]>();
  const action = useActionData<NewTaskActionData>();

  return (
    <Form
      method="post"
      className="bg-white shadow-md sm:mx-auto sm:max-w-lg mt-10"
    >
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {action?.formError && (
          <p className="text-red-500">{action?.formError}</p>
        )}

        <h1 className="text-2xl font-bold">Todo List</h1>
        <hr className="mt-2" />

        <div className="mt-5 flex rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BriefcaseIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              name="task"
              id="task"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
              placeholder="Add New Task"
            />
          </div>

          <button
            type="submit"
            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <PlusCircleIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span>Add</span>
          </button>
        </div>
        {action?.fieldErrors?.title && (
          <p className="text-red-500 text-sm">{action?.fieldErrors?.title}</p>
        )}

        <div className="mt-4">
          {todos.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 rounded-full shadow mb-4 bg-gray-50 focus:outline-none grid grid-cols-[1fr_30px] items-center"
            >
              <span>{item.title}</span>
              <TrashIcon className="h-5 w-5 text-red-400" />
            </div>
          ))}
        </div>
      </div>
    </Form>
  );
}

export default TodoList;
