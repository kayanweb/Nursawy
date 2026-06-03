import { useState, useEffect } from 'react';

export function useFirestoreSync<T>(
  syncFn: (onData: (data: T[]) => void) => () => void,
  initialData: T[],
  deps: React.DependencyList = []
): [T[], (newData: T[]) => void] {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    const unsubscribe = syncFn((newData) => {
      setData(newData);
    });
    return () => unsubscribe();
  }, [syncFn, ...deps]);

  return [data, setData];
}
