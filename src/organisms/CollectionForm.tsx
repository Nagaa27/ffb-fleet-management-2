// src/organisms/CollectionForm.tsx
// Organism: Record actual collection weights per mill for an in-progress trip.

import { useState } from 'react';
import { Package } from 'lucide-react';
import { Button, Input } from '../atoms';
import { FormField } from '../molecules';
import type { Collection } from '../types';
import styles from './CollectionForm.module.css';

interface CollectionFormProps {
  tripId: string;
  collections: Collection[];
  onRecord: (tripId: string, millId: string, actualWeight: number, notes?: string) => void;
  loading?: boolean;
}

export function CollectionForm({ tripId, collections, onRecord, loading = false }: CollectionFormProps) {
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleRecord = (millId: string) => {
    const weight = parseFloat(weights[millId] ?? '0');
    if (weight <= 0) return;
    onRecord(tripId, millId, weight, notes[millId] || undefined);
  };

  if (collections.length === 0) {
    return <p className={styles['no-collections']}>Tidak ada koleksi untuk trip ini.</p>;
  }

  return (
    <div className={styles['collection-form']} data-testid="collection-form">
      <h4 className={styles['form-title']}>
        <Package size={18} />
        Pencatatan Koleksi TBS
      </h4>
      <div className={styles['collection-list']}>
        {collections.map((c) => {
          const isRecorded = c.actualWeight !== null;
          return (
            <div
              key={c.id}
              className={`${styles['collection-item']} ${isRecorded ? styles['recorded'] : ''}`}
              data-testid={`collection-${c.millId}`}
            >
              <div className={styles['mill-info']}>
                <span className={styles['mill-name']}>{c.mill?.name ?? c.millId}</span>
                <span className={styles['planned-weight']}>
                  Rencana: {c.plannedWeight} ton
                </span>
                {isRecorded && (
                  <span className={styles['actual-weight']}>
                    Aktual: {c.actualWeight} ton
                  </span>
                )}
              </div>
              {!isRecorded && (
                <div className={styles['record-controls']}>
                  <FormField label="Berat Aktual (ton)" htmlFor={`weight-${c.millId}`} required>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={weights[c.millId] ?? ''}
                      onChange={(e) =>
                        setWeights((prev) => ({ ...prev, [c.millId]: e.target.value }))
                      }
                      placeholder="0.0"
                    />
                  </FormField>
                  <FormField label="Catatan" htmlFor={`notes-${c.millId}`}>
                    <Input
                      value={notes[c.millId] ?? ''}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [c.millId]: e.target.value }))
                      }
                      placeholder="Catatan opsional..."
                    />
                  </FormField>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={loading || !weights[c.millId] || parseFloat(weights[c.millId] ?? '0') <= 0}
                    onClick={() => handleRecord(c.millId)}
                  >
                    Catat
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
