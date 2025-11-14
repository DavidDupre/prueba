export const b64toBlob = (
  base64: string,
  type: string = "application/octet-stream"
): Promise<Blob> =>
  fetch(`data:${type};base64,${base64}`).then((res) => res.blob());
