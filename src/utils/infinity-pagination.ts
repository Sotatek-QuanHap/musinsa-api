import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};

export async function buildMetaData({
  size,
  page,
  query,
  databaseService,
  entity,
}): Promise<any> {
  const count = await databaseService[entity].countDocuments(query);
  return {
    count,
    size,
    page,
    totalPages: size > 0 ? Math.ceil(count / size) : 1,
  };
}
