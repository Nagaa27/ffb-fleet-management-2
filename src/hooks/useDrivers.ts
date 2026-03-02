// src/hooks/useDrivers.ts
// Custom hook: Driver data fetching, filtering, and CRUD operations.

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDriversThunk,
  createDriverThunk,
  updateDriverThunk,
  deleteDriverThunk,
  selectAllDrivers,
  selectDriversLoading,
  selectDriversError,
} from '../store/driversSlice';
import type { Driver } from '../types';
import type { CreateDriverInput, UpdateDriverInput } from '../types/forms';

export function useDrivers() {
  const dispatch = useAppDispatch();
  const drivers = useAppSelector(selectAllDrivers);
  const loading = useAppSelector(selectDriversLoading);
  const error = useAppSelector(selectDriversError);

  const [search, setSearch] = useState('');

  useEffect(() => {
    void dispatch(fetchDriversThunk());
  }, [dispatch]);

  const filteredDrivers = useMemo(() => {
    if (!search) return drivers;
    const q = search.toLowerCase();
    return drivers.filter(
      (d: Driver) =>
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.phoneNumber.includes(q),
    );
  }, [drivers, search]);

  const create = useCallback(
    async (data: CreateDriverInput) => {
      return dispatch(createDriverThunk(data)).unwrap();
    },
    [dispatch],
  );

  const update = useCallback(
    async (id: string, data: UpdateDriverInput) => {
      return dispatch(updateDriverThunk({ id, data })).unwrap();
    },
    [dispatch],
  );

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteDriverThunk(id)).unwrap();
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    void dispatch(fetchDriversThunk());
  }, [dispatch]);

  return {
    drivers: filteredDrivers,
    allDrivers: drivers,
    loading,
    error,
    search,
    setSearch,
    create,
    update,
    remove,
    refresh,
  };
}
