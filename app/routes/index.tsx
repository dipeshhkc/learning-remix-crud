import { Task } from '.prisma/client';
import { BriefcaseIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { Form, useActionData, useLoaderData, useTransition } from 'remix';
import { action as NewTaskAction, NewTaskActionData } from './api/task/new';
import { loader as TaskLoader } from './api/task/get';
import { useEffect, useRef } from 'react';

export const loader = TaskLoader;
export const action = NewTaskAction;

function TaskList() {
  const todos = useLoaderData<Task[]>();
  const addAction = useActionData<NewTaskActionData>();
  const ref = useRef<HTMLFormElement>(null);
  const transition = useTransition();

  useEffect(() => {
    if (transition.state == 'submitting') {
      ref.current && ref.current.reset();
    }
  }, [transition]);

  return (
    <div className="bg-white shadow-md sm:mx-auto sm:max-w-lg mt-10">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {addAction?.formError && (
          <p className="text-red-500">{addAction?.formError}</p>
        )}

        <h1 className="text-2xl font-bold">Todo List</h1>
        <hr className="mt-2" />

        <Form
          ref={ref}
          method="post"
          className="mt-5 flex rounded-md shadow-sm"
        >
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
              className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm"
              placeholder="Add New Task"
              required
              autoComplete="off"
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
        </Form>
        {addAction?.fieldErrors?.task && (
          <p className="text-red-500 text-sm mt-1">
            {addAction?.fieldErrors?.task}
          </p>
        )}

        <div className="mt-4">
          {todos.length ? (
            todos.map((item) => (
              <Form
                method="delete"
                action="/api/task/delete"
                key={item.id}
                className="px-4 py-2 rounded-full shadow mb-4 bg-gray-50 focus:outline-none grid grid-cols-[1fr_100px] items-center"
              >
                <input type="hidden" name="taskId" value={item.id} />
                <span className="text-sm">{item.name}</span>

                <button
                  type="submit"
                  className="outline-none text-sm text-green-500"
                >
                  Mark Complete
                </button>
              </Form>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Lucky day. No any Tasks to do. It's Party time 🎊 🎊
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
