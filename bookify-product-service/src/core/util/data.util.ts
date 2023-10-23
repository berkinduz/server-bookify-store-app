export const convertServiceResponseToRecord = (source: any) => ({
  data: source.data,
  success: source.success,
  message: source.message,
  error: source.error,
});
