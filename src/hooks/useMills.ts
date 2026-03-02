// src/hooks/useMills.ts
// Custom hook: Mill data fetching, filtering, and CRUD operations.

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchMillsThunk,
  createMillThunk,
  updateMillThunk,
  selectAllMills,
  selectMillsLoading,
  selectMillsError,
} from '../store/millsSlice';
import type { Mill } from '../types';
import type { CreateMillInput, UpdateMillInput } from '../types/forms';

export function useMills() {
  const dispatch = useAppDispatch();
  const mills = useAppSelector(selectAllMills);
  const loading = useAppSelector(selectMillsLoading);
  const error = useAppSelector(selectMillsError);

  const [search, setSearch] = useState('');

  useEffect(() => {
    void dispatch(fetchMillsThunk());
  }, [dispatch]);

  const filteredMills = useMemo(() => {
    if (!search) return mills;
    const q = search.toLowerCase();
    return mills.filter(
      (m: Mill) =>
        m.name.toLowerCase().includes(q) ||
        m.contactPerson.toLowerCase().includes(q) ||
        (m.location.address?.toLowerCase().includes(q) ?? false),
    );
  }, [mills, search]);

  const create = useCallback(
    async (data: CreateMillInput) => {
      return dispatch(createMillThunk(data)).unwrap();
    },
    [dispatch],
  );

  const update = useCallback(
    async (id: string, data: UpdateMillInput) => {
      return dispatch(updateMillThunk({ id, data })).unwrap();
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    void dispatch(fetchMillsThunk());
  }, [dispatch]);

  return {
    mills: filteredMills,
    allMills: mills,
    loading,
    error,
    search,
    setSearch,
    create,
    update,
    refresh,
  };
}
