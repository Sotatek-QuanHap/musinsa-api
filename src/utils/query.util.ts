import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class QueryUtil {
  static convertQueryFilterRange<T extends ObjectLiteral>(
    entity: string,
    fields: (keyof T)[],
    queryBuilder: SelectQueryBuilder<T>,
    query: any,
  ) {
    fields.forEach((field) => {
      const fromKey = `${String(field)}From`;
      const toKey = `${String(field)}To`;

      if (query[fromKey] !== undefined) {
        queryBuilder.andWhere(`${entity}.${String(field)} >= :${fromKey}`, {
          [fromKey]: query[fromKey],
        });
      }
      if (query[toKey] !== undefined) {
        queryBuilder.andWhere(`${entity}.${String(field)} <= :${toKey}`, {
          [toKey]: query[toKey],
        });
      }
    });
  }
}
