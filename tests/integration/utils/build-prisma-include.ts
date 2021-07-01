export function buildPrismaInclude(attrs: Record<string, any>) {
  const include = Object.keys(attrs).reduce((prev, current) => {
    const previousValue = prev;
    const value = attrs[current];
    const isObject = typeof value === 'object';

    const isRelation =
      isObject &&
      Object.keys(value).find((property) => property.match(/create|connect/));

    if (isRelation) {
      previousValue[current] = true;
    }

    return previousValue;
  }, {});

  const hasInclude = Object.keys(include).length;

  return hasInclude ? include : undefined;
}
