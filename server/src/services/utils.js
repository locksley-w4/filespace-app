export function handleError(err, req, res, next) {
  const { message, status } = err;
  console.error(err);
  return res.status(status ?? 500).json({ message, error: err });
}
