'use client';

import { useMemo, useState, useTransition } from 'react';
import { checkoutAction } from '@/lib/modalAction/action'; // あなたのパスに合わせて

type Plan = 'free' | 'plus' | 'unlimited';

function estimatePrice(plan: Plan, days: number) {
  // 例：好きに変更してOK（表示用）
  if (plan === 'free') return 0;
  if (plan === 'plus') return days * 100;
  return days * 300; // unlimited
}

export default function CheckoutModal({ tenant }: { tenant: string }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>('plus');
  const [days, setDays] = useState<number>(7);
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const price = useMemo(() => estimatePrice(plan, days), [plan, days]);

  const submit = () => {
    setErr(null);

    // formData を自前で作る（モーダルUIの state をそのまま送る）
    const fd = new FormData();
    fd.set('plan', plan);
    fd.set('days', String(days));

    startTransition(async () => {
      const res = await checkoutAction(tenant, fd);

      // free以外での処理
      // {url}
      if (res && typeof res === 'object' && 'url' in res && typeof (res as any).url === 'string') {
        const url = (res as any).url as string;
        setOpen(false);
        window.location.href = url; 
        return;
      }

      // free の場合は決済なしで反映させるならここで処理
      if (plan === 'free') {
        setOpen(false);
        return;
      }

      setErr((res as any)?.error ?? '支払いURLの取得に失敗しました');
    });
  };

  const PlanCard = ({ p, title, desc }: { p: Plan; title: string; desc: string }) => (
    <button
      type="button"
      onClick={() => setPlan(p)}
      className={`rounded-lg border p-3 text-left ${
        plan === p ? 'border-black bg-gray-50' : 'border-gray-300'
      }`}
      aria-pressed={plan === p}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-gray-600">{desc}</div>
    </button>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        変更
      </button>

      {open && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">プラン変更</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">プラン</div>
              <div className="grid grid-cols-3 gap-2">
                <PlanCard p="free" title="Free" desc="少なめ" />
                <PlanCard p="plus" title="Plus" desc="たくさん" />
                <PlanCard p="unlimited" title="Unlimited" desc="ほぼ無制限" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">日数</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded border px-3 py-2"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  disabled={isPending}
                >
                  −
                </button>
                <div className="min-w-12 text-center text-lg font-semibold">{days}</div>
                <button
                  type="button"
                  className="rounded border px-3 py-2"
                  onClick={() => setDays((d) => Math.min(30, d + 1))}
                  disabled={isPending}
                >
                  ＋
                </button>
                <div className="text-sm text-gray-600">（1〜30日）</div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">見積もり</div>
                <div className="text-lg font-semibold">¥{price.toLocaleString()}</div>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                ※表示は目安。請求金額はサーバー計算で確定
              </div>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            {/* actions */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border px-4 py-2"
                disabled={isPending}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submit}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
                disabled={isPending || (plan !== 'free' && price <= 0)}
              >
                {plan === 'free' ? '適用' : '支払いへ進む'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
