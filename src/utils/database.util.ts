export function isSameProduct(
  oldProduct: any,
  newProduct: any,
  comparedFields: string[],
) {
  if (!oldProduct) return false;

  let oldValues = '',
    newValues = '';
  for (const field of comparedFields) {
    oldValues += oldProduct[field] + ' ';
    newValues += newProduct[field] + ' ';
  }
  return oldValues === newValues;
}
