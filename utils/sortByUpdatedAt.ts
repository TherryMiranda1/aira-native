type ItemWithUpdatedAt = { updatedAt: Date };

export function sortByUpdatedAt<T extends ItemWithUpdatedAt>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
