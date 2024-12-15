import {
  ArcherySessionFilterParams,
  ArcherySessionSortParams,
  SortDirection,
  SortDirections,
  SortType,
  SortTypes,
} from "../../app/SessionList.ts";

export function convertQueryToSortParams(
  queryParams: Record<string, string>,
): ArcherySessionSortParams {
  const { sortBy, sortDirection } = queryParams;

  const type: SortType = SortTypes.includes(sortBy as SortType)
    ? sortBy as SortType
    : "date";
  const direction: SortDirection =
    SortDirections.includes(sortDirection as SortDirection)
      ? sortDirection as SortDirection
      : "asc";
  return {
    type,
    direction,
  };
}

export function convertQueryToFilterParams(
  queryParams: Record<string, string>,
): ArcherySessionFilterParams {
  const { distance: queryDistance } = queryParams;
  let distance: string | undefined = queryDistance;
  if (queryDistance !== undefined && queryDistance.trim() === "") {
    distance = undefined;
  }

  return { distance };
}
