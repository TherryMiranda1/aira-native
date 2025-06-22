import { useState, useEffect, useCallback } from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface NativeToast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: NativeToast }
  | { type: "UPDATE_TOAST"; toast: Partial<NativeToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface ToastState {
  toasts: NativeToast[];
}

const toastTimeouts = new Map<string, number>();

let toastCount = 0;

const generateId = (): string => {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
};

const addToRemoveQueue = (
  toastId: string,
  delay: number = TOAST_REMOVE_DELAY
) => {
  if (toastTimeouts.has(toastId)) {
    const existingTimeout = toastTimeouts.get(toastId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
  }
  let interval: ReturnType<typeof setInterval>;
  interval = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, delay);

  toastTimeouts.set(toastId, interval as unknown as number);
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId, 300);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, 300);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? { ...toast, open: false }
            : toast
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

const dispatch = (action: ToastAction) => {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

export type CreateToastProps = Omit<NativeToast, "id" | "open">;

const toast = ({
  title,
  description,
  variant = "default",
  duration = TOAST_REMOVE_DELAY,
}: CreateToastProps) => {
  const id = generateId();

  const update = (props: Partial<NativeToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      title,
      description,
      variant,
      duration,
      open: true,
    },
  });

  if (duration > 0) {
    addToRemoveQueue(id, duration);
  }

  return { id, dismiss, update };
};

const success = (title: string, description?: string) =>
  toast({ title, description, variant: "success" });

const error = (title: string, description?: string) =>
  toast({ title, description, variant: "error" });

const warning = (title: string, description?: string) =>
  toast({ title, description, variant: "warning" });

const info = (title: string, description?: string) =>
  toast({ title, description, variant: "info" });

export const useToast = () => {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  const dismiss = useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({ type: "DISMISS_TOAST" });
  }, []);

  return {
    toasts: state.toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
};

export { toast };
