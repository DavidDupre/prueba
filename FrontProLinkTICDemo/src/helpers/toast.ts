import { Notify } from "quasar";

const error = (text: string) =>
  Notify.create({
    message: text,
    multiLine: true,
    position: "top",
    color: "red-2",
    icon: "error_outline",
    iconColor: "red-8",
    textColor: "black",
    progress: true,
    progressClass: "progress-error",
  });

const success = (text: string) =>
  Notify.create({
    message: text,
    multiLine: true,
    position: "top",
    color: "grey-1",
    icon: "check_circle",
    iconColor: "positive",
    textColor: "secondary",
    progress: true,
    progressClass: "progress-success",
  });

const warning = (text: string) =>
  Notify.create({
    message: text,
    multiLine: true,
    position: "top",
    color: "orange-1",
    icon: "error",
    iconColor: "orange",
    textColor: "secondary",
    progress: true,
    progressClass: "progress-warning",
  });

export const toast = {
  error: (text: string) => error(text),
  success: (text: string) => success(text),
  warning: (text: string) => warning(text)
};
