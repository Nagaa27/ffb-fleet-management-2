// src/hooks/useVehicles.ts
// Custom hook: Vehicle data fetching, filtering, and CRUD operations.

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchVehiclesThunk,
  createVehicleThunk,
  updateVehicleThunk,
  assignDriverThunk,
  deleteVehicleThunk,
  selectAllVehicles,
  selectVehiclesLoading,
  selectVehiclesError,
} from '../store/vehiclesSlice';
import type { Vehicle } from '../types';
import type { CreateVehicleInput, UpdateVehicleInput, AssignDriverInput } from '../types/forms';

export function useVehicles() {
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(selectAllVehicles);
  const loading = useAppSelector(selectVehiclesLoading);
  const error = useAppSelector(selectVehiclesError);

  const [search, setSearch] = useState('');

  useEffect(() => {
    void dispatch(fetchVehiclesThunk());
  }, [dispatch]);

  const filteredVehicles = useMemo(() => {
    if (!search) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v: Vehicle) =>
        v.plateNumber.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.driver?.name.toLowerCase().includes(q) ?? false),
    );
  }, [vehicles, search]);

  const create = useCallback(
    async (data: CreateVehicleInput) => {
      return dispatch(createVehicleThunk(data)).unwrap();
    },
    [dispatch],
  );

  const update = useCallback(
    async (id: string, data: UpdateVehicleInput) => {
      return dispatch(updateVehicleThunk({ id, data })).unwrap();
    },
    [dispatch],
  );

  const assignDriver = useCallback(
    async (vehicleId: string, input: AssignDriverInput) => {
      return dispatch(assignDriverThunk({ vehicleId, driverId: input.driverId })).unwrap();
    },
    [dispatch],
  );

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteVehicleThunk(id)).unwrap();
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    void dispatch(fetchVehiclesThunk());
  }, [dispatch]);

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    loading,
    error,
    search,
    setSearch,
    create,
    update,
    assignDriver,
    remove,
    refresh,
  };
}
