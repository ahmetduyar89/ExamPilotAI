import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, Info, Database, ChevronRight, Laptop, Key,
  Shield, FileText, LifeBuoy, MessageSquareHeart, ScrollText,
  Download, Upload, RotateCcw, CheckCircle2, Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { CloudSyncService } from '@/features/cloudkit/services/CloudSyncService';
import type { SyncSettings, SyncStatus } from '@/features/cloudkit/types';
import { PersistenceRegistry } from '@/core/persistence';
import { settingsRepo } from '../repository';
import { SettingsGroup } from './SettingsGroup';
import { Toggle } from './controls';
import { useSettings } from '../hooks';

/** App-level release identifiers surfaced in the About section. */
export const APP_VERSION = '1.0.0';
export const BUILD_NUMBER = '2026.07.11';

const STATUS_LABEL: Record<SyncStatus, string> = {
  synced: 'Güncel', syncing: 'Eşitleniyor…', offline: 'Çevrimdışı', pending: 'Bekliyor', error: 'Hata',
};

/** SYNC — reuses the existing CloudSyncService; never duplicates its state. */
export function SyncSection() {
  const navigate = useNavigate();
  const { settings, setByPath } = useSettings();
  const [cloud, setCloud] = React.useState<SyncSettings>(CloudSyncService.getSettings());
  const [status, setStatus] = React.useState<SyncStatus>(CloudSyncService.getSyncStatus());

  React.useEffect(() => {
    const load = () => {
      setCloud({ ...CloudSyncService.getSettings() });
      setStatus(CloudSyncService.getSyncStatus());
    };
    load();
    return CloudSyncService.subscribe(load);
  }, []);

  return (
    <SettingsGroup icon={RefreshCw} title="Senkronizasyon">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-text-primary">CloudKit Eşitleme</p>
          <p className="text-xs text-text-secondary mt-0.5">Verileri Apple cihazlarınız arasında eşitleyin.</p>
        </div>
        <Toggle checked={cloud.enabled} onChange={(v) => CloudSyncService.toggleSync(v)} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-text-primary">Otomatik Eşitleme</p>
          <p className="text-xs text-text-secondary mt-0.5">Değişiklikleri arka planda eşitle.</p>
        </div>
        <Toggle checked={settings.sync.autoSync} onChange={(v) => setByPath('sync.autoSync', v)} />
      </div>

      <div className="grid gap-2.5 grid-cols-2">
        <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40 flex items-center gap-2.5">
          <Key className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] text-text-secondary uppercase font-bold block">Durum</span>
            <span className="text-xs font-bold text-text-primary truncate block">{STATUS_LABEL[status]}</span>
          </div>
        </div>
        <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40 flex items-center gap-2.5">
          <Laptop className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] text-text-secondary uppercase font-bold block">Cihaz</span>
            <span className="text-xs font-bold text-text-primary truncate block">{cloud.deviceName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[9px] text-text-secondary uppercase font-bold block">Son Eşitleme</span>
          <span className="text-xs font-bold text-text-primary">
            {cloud.lastSyncTimestamp ? new Date(cloud.lastSyncTimestamp).toLocaleString('tr-TR') : '—'}
          </span>
        </div>
        <Button
          variant="outline"
          className="rounded-xl px-4 text-xs font-bold flex items-center gap-1.5"
          onClick={() => CloudSyncService.forceRefresh()}
          disabled={!cloud.enabled || status === 'syncing'}
        >
          <RefreshCw className={cn('h-3.5 w-3.5', status === 'syncing' && 'animate-spin')} />
          Şimdi Eşitle
        </Button>
      </div>

      <button
        onClick={() => navigate('/settings/sync')}
        className="flex w-full items-center gap-3 text-left active:opacity-70 transition-opacity"
      >
        <span className="flex-1 text-[15px] font-medium text-text-primary">Gelişmiş Eşitleme Ayarları</span>
        <ChevronRight className="h-4 w-4 text-text-secondary" />
      </button>
    </SettingsGroup>
  );
}

function LinkRow({ icon: Icon, label, onClick }: { icon: typeof Info; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 text-left active:opacity-70 transition-opacity">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-[16px] w-[16px] text-text-primary" />
      </span>
      <span className="flex-1 text-[15px] font-medium text-text-primary">{label}</span>
      <ChevronRight className="h-4 w-4 text-text-secondary" />
    </button>
  );
}

/** ABOUT — version + informational links. */
export function AboutSection() {
  return (
    <SettingsGroup icon={Info} title="Hakkında">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-medium text-text-primary">Sürüm</span>
        <span className="text-sm text-text-secondary tabular-nums">{APP_VERSION}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-medium text-text-primary">Yapı Numarası</span>
        <span className="text-sm text-text-secondary tabular-nums">{BUILD_NUMBER}</span>
      </div>
      <LinkRow icon={Shield} label="Gizlilik Politikası" />
      <LinkRow icon={FileText} label="Kullanım Şartları" />
      <LinkRow icon={LifeBuoy} label="Destek" />
      <LinkRow icon={MessageSquareHeart} label="Geri Bildirim" />
      <LinkRow icon={ScrollText} label="Lisanslar" />
    </SettingsGroup>
  );
}

/** IMPORT / EXPORT / RESET. */
export function DataSection() {
  const { settings, exportSettings, importSettings, reset } = useSettings();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmingReset, setConfirmingReset] = React.useState(false);
  const [confirmingClear, setConfirmingClear] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const handleExport = () => {
    const blob = new Blob([exportSettings()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exampilot-ayarlar-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('Ayarlar dışa aktarıldı.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      await importSettings(text);
      flash('Ayarlar içe aktarıldı.');
    } catch (err) {
      flash(err instanceof Error ? err.message : 'İçe aktarma başarısız.');
    }
  };

  const handleReset = async () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      window.setTimeout(() => setConfirmingReset(false), 4000);
      return;
    }
    await reset();
    setConfirmingReset(false);
    flash('Ayarlar sıfırlandı.');
  };

  const handleClearData = async () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      window.setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    setClearing(true);
    try {
      // Wipe every persisted record and stored file (students, exams,
      // analyses, plans, reports, twins, CRM, notes, lessons…).
      await PersistenceRegistry.getProvider().clearAllData();
      // Preserve the teacher's app preferences — "Ayarları Sıfırla" is the
      // separate control for those. Re-persist them after the wipe.
      await settingsRepo.save(settings);
    } catch (err) {
      console.error('[Settings] Clear all data failed:', err);
    }
    // Reload so every in-memory service singleton, subscription and query
    // cache re-initialises against the now-empty store.
    window.location.reload();
  };

  return (
    <SettingsGroup icon={Database} title="İçe / Dışa Aktarım">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-text-primary">Ayarları Dışa Aktar</p>
          <p className="text-xs text-text-secondary mt-0.5">JSON yedeği indirin.</p>
        </div>
        <Button variant="outline" className="rounded-xl px-4 text-xs font-bold flex items-center gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Dışa Aktar
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-text-primary">Ayarları İçe Aktar</p>
          <p className="text-xs text-text-secondary mt-0.5">Bir yedek dosyasından geri yükleyin.</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
        <Button variant="outline" className="rounded-xl px-4 text-xs font-bold flex items-center gap-1.5" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> İçe Aktar
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-text-primary">Ayarları Sıfırla</p>
          <p className="text-xs text-text-secondary mt-0.5">Tüm tercihleri varsayılana döndürün.</p>
        </div>
        <Button variant={confirmingReset ? 'danger' : 'outline'} className="rounded-xl px-4 text-xs font-bold flex items-center gap-1.5" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" /> {confirmingReset ? 'Emin misiniz?' : 'Sıfırla'}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-4">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-danger">Tüm Verileri Temizle</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Öğrenciler, sınavlar, analizler, planlar ve raporlar dahil tüm veriler kalıcı olarak silinir. Ayarlar korunur. Bu işlem geri alınamaz.
          </p>
        </div>
        <Button
          variant="danger"
          className="rounded-xl px-4 text-xs font-bold flex items-center gap-1.5 shrink-0"
          onClick={handleClearData}
          isLoading={clearing}
        >
          <Trash2 className="h-3.5 w-3.5" /> {confirmingClear ? 'Emin misiniz?' : 'Temizle'}
        </Button>
      </div>

      {notice && (
        <div className="flex items-center gap-2 text-xs font-medium text-success">
          <CheckCircle2 className="h-4 w-4" /> {notice}
        </div>
      )}
    </SettingsGroup>
  );
}
