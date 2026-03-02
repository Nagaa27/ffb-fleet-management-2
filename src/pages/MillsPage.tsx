// src/pages/MillsPage.tsx
// Page: Mill management — list with search.

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMillsThunk, selectAllMills, selectMillsLoading } from '../store/millsSlice';
import { PageLayout } from '../templates';
import { SearchInput } from '../molecules';
import { MillList } from '../organisms';
import type { Mill } from '../types';

export function MillsPage() {
  const dispatch = useAppDispatch();
  const mills = useAppSelector(selectAllMills);
  const loading = useAppSelector(selectMillsLoading);

  const [search, setSearch] = useState('');

  useEffect(() => {
    void dispatch(fetchMillsThunk());
  }, [dispatch]);

  const filteredMills = mills.filter((m: Mill) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.contactPerson.toLowerCase().includes(q) ||
      (m.location.address?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <PageLayout
      title="Manajemen Pabrik"
      subtitle="Data pabrik kelapa sawit (PKS)"
    >
      <SearchInput value={search} onChange={setSearch} placeholder="Cari pabrik..." />
      <MillList mills={filteredMills} loading={loading} />
    </PageLayout>
  );
}
