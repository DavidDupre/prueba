export default () => {
  if (process.env.NODE_ENV_TYPE !== "development") {
    const originalWarn = console.warn;
    const originalError = console.error;

    const filteredWarnings = [
      "Extraneous non-props attributes",
      "Invalid prop",
      "Expected Number with value NaN",
      "Missing required prop",
      "Set operation on key",
      "Failed to resolve component",
      "Unhandled error during execution of mounted hook",
      "Component emitted event",
      "Invalid watch source",
      "toolbarview-item-unavailable",
      "resolveDirective can only be used in render() or setup()",
    ];

    const filteredErrors = [
      "AxiosError",
      "Request failed with status code",
      "Network Error",
      "ERR_BAD_REQUEST",
      "ERR_NETWORK",
    ];

    console.warn = (...args) => {
      const shouldSkipWarn = args.some(
        (arg) =>
          typeof arg === "string" &&
          filteredWarnings.some((filter) => arg.includes(filter)),
      );

      if (!shouldSkipWarn) {
        originalWarn(...args);
      }
    };

    console.error = (...args) => {
      const shouldSkip = args.some((arg) => {
        if (typeof arg === "object" && arg !== null) {
          if (arg.isAxiosError === true) return true;
          if (arg.name === "AxiosError") return true;
          // Errores HTTP (400, 404, 500)
          if (arg.response && [400, 404, 500].includes(arg.response.status))
            return true;
        }
        // Si es texto y coincide con la lista de errores filtrados
        if (typeof arg === "string") {
          return filteredErrors.some((errText) => arg.includes(errText));
        }
        return false;
      });

      if (!shouldSkip) {
        originalError(...args);
      }
    };
  }
};
