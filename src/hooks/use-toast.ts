import * as React from 'react';
import { ToastActionElement, ToastProps } from '@/components/ui-kit/toast';

/**
 * A custom Toast management system that handles displaying, updating, and dismissing toasts in the UI.
 *
 * This system allows toasts to be added with a customizable message, updated, and dismissed. It includes a queue
 * system to limit the number of active toasts at any time and ensures that toasts are removed after a set duration.
 *
 * The `useToast` hook provides an interface for components to trigger and manage toasts.
 *
 * @module ToastSystem
 *
 * @example
 * // Usage in a component:
 * const { toast, toasts, dismiss } = useToast();
 *
 * const handleClick = () => {
 *   toast({
 *     title: 'Success',
 *     description: 'Your action was successful!',
 *     action: <button onClick={handleUndo}>Undo</button>,
 *   });
 * };
 */

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 10000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  // Safely handle title if it's an object
  if (props.title && typeof props.title === 'object' && !React.isValidElement(props.title)) {
    const title = props.title as any;
    if (title.message) {
      props.title = title.message;
    } else if (title.error) {
      props.title = title.error;
    } else {
      try {
        props.title = JSON.stringify(title);
      } catch {
        props.title = 'Error';
      }
    }
  }

  // Safely handle description if it's an object (e.g. an error object)
  if (props.description && typeof props.description === 'object' && !React.isValidElement(props.description)) {
    const desc = props.description as any;
    if (desc.message) {
      props.description = desc.message;
    } else if (Array.isArray(desc.errors)) {
      props.description = desc.errors.map((e: any) => e.message).join('\n');
    } else {
      try {
        props.description = JSON.stringify(desc);
      } catch (e) {
        props.description = 'An unknown error occurred';
      }
    }
  }

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

toast.error = (
  error: any,
  custom?: Record<string, string>,
  defaultMessage = 'Something went wrong'
) => {
  const messages: string[] = [];

  if (typeof error === 'string') {
    messages.push(error);
  } else if (error && typeof error === 'object') {
    // 1. Check for GraphQL errors array
    if (Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        if (err.message) messages.push(err.message);
      });
    } 
    // 2. Check for standard Error object or message property
    else if (error.message) {
      messages.push(error.message);
    } 
    // 3. Fallback to iterating keys if it's a generic record
    else {
      for (const key in error) {
        if (custom && key in custom) {
          messages.push(custom[key]);
          continue;
        }
        const val = error[key];
        if (typeof val === 'string') {
          messages.push(val);
        } else if (val && typeof val === 'object' && val.message) {
          messages.push(val.message);
        }
      }
    }
  }

  if (messages.length === 0) {
    messages.push(defaultMessage);
  }

  // Display the toast with error variant
  return toast({
    variant: 'destructive',
    title: 'Error',
    description: messages.filter(Boolean).join('\n'),
  });
};

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}
