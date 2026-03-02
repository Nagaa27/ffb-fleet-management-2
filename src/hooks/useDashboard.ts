// src/hooks/useDashboard.ts
// Custom hook: Dashboard summary data.

import { useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDashboardThunk,
  selectDashboard,
  selectDashboardLoading,
  selectDashboardError,
  selectDashboardDate,
  setSelectedDate,
} from '../store/dashboardSlice';

export function useDashboard() {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectDashboard);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  const selectedDate = useAppSelector(selectDashboardDate);

  useEffect(() => {
    void dispatch(fetchDashboardThunk(selectedDate));
  }, [dispatch, selectedDate]);

  const changeDate = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    void dispatch(fetchDashboardThunk(selectedDate));
  }, [dispatch, selectedDate]);

  const today = format(new Date(), 'yyyy-MM-dd');

  return {
    summary,
    loading,
    error,
    selectedDate,
    today,
    changeDate,
    refresh,
  };
}
