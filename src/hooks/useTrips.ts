// src/hooks/useTrips.ts
// Custom hook: Trip data fetching, filtering, status updates, and creation.

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTripsThunk,
  createTripThunk,
  updateTripStatusThunk,
  selectAllTrips,
  selectTripsLoading,
  selectTripsError,
} from '../store/tripsSlice';
import type { Trip } from '../types';
import type { CreateTripInput, UpdateTripStatusInput } from '../types/forms';

export function useTrips() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectAllTrips);
  const loading = useAppSelector(selectTripsLoading);
  const error = useAppSelector(selectTripsError);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    void dispatch(fetchTripsThunk({}));
  }, [dispatch]);

  const filteredTrips = useMemo(() => {
    let result = trips;

    if (statusFilter) {
      result = result.filter((t: Trip) => t.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t: Trip) =>
          t.id.toLowerCase().includes(q) ||
          (t.driver?.name.toLowerCase().includes(q) ?? false) ||
          (t.vehicle?.plateNumber.toLowerCase().includes(q) ?? false),
      );
    }

    return result;
  }, [trips, search, statusFilter]);

  const create = useCallback(
    async (data: CreateTripInput) => {
      return dispatch(createTripThunk(data)).unwrap();
    },
    [dispatch],
  );

  const updateStatus = useCallback(
    async (input: UpdateTripStatusInput) => {
      return dispatch(
        updateTripStatusThunk({
          id: input.tripId,
          data: { status: input.status, cancellationReason: input.cancellationReason },
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    void dispatch(fetchTripsThunk({}));
  }, [dispatch]);

  return {
    trips: filteredTrips,
    allTrips: trips,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    create,
    updateStatus,
    refresh,
  };
}
