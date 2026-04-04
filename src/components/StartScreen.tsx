import { useState, useMemo } from 'react';
import { ALL_QUESTIONS } from '@/data/questions';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ServiceType, Difficulty } from '@/types/quiz';

const SERVICE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: '児童発達支援', value: '児童発達支援' },
  { label: '放課後等デイサービス', value: '放課後等デイサービス' },
  { label: '居宅訪問', value: '居宅訪問' },
];

const ALL_SERVICE_VALUES: ServiceType[] = SERVICE_OPTIONS.map((o) => o.value);
const ALL_DIFFICULTY_VALUES: Difficulty[] = ['初級', '中級', '上級'];

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

interface Props {
  onStart: (services: ServiceType[], difficulties: Difficulty[]) => void;
  onStudy: () => void;
}

export default function StartScreen({ onStart, onStudy }: Props) {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(ALL_SERVICE_VALUES);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(ALL_DIFFICULTY_VALUES);
  const { isInstallable, install } = usePWAInstall();

  const questionCount = useMemo(() => {
    return ALL_QUESTIONS.filter(
      (q) =>
        (q.serviceType === '共通' || selectedServices.includes(q.serviceType)) &&
        selectedDifficulties.includes(q.difficulty),
    ).length;
  }, [selectedServices, selectedDifficulties]);

  const handleStart = () => {
    if (selectedServices.length === 0 || selectedDifficulties.length === 0) return;
    onStart(selectedServices, selectedDifficulties);
  };

  const canStart = selectedServices.length > 0 && selectedDifficulties.length > 0 && questionCount > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-emerald-50 to-background">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            児童福祉 制度クイズ
          </h1>
          <p className="text-muted-foreground text-sm">
            児童発達支援・放課後等デイサービス・居宅訪問の制度と加算を学ぼう
          </p>
        </div>

        {/* Service filter */}
        <Card>
          <CardHeader>
            <CardTitle>サービス種別</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              multiple
              value={selectedServices}
              onValueChange={(val) => setSelectedServices(val as ServiceType[])}
              className="flex flex-wrap gap-2"
              spacing={2}
            >
              {SERVICE_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer rounded-full px-4 py-2 text-sm data-[pressed]:bg-emerald-600 data-[pressed]:text-white"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* Difficulty filter */}
        <Card>
          <CardHeader>
            <CardTitle>難易度</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              multiple
              value={selectedDifficulties}
              onValueChange={(val) => setSelectedDifficulties(val as Difficulty[])}
              className="flex flex-wrap gap-2"
              spacing={2}
            >
              <ToggleGroupItem
                value="初級"
                className="cursor-pointer rounded-full px-4 py-2 text-sm data-[pressed]:bg-green-600 data-[pressed]:text-white"
              >
                初級
              </ToggleGroupItem>
              <ToggleGroupItem
                value="中級"
                className="cursor-pointer rounded-full px-4 py-2 text-sm data-[pressed]:bg-yellow-500 data-[pressed]:text-white"
              >
                中級
              </ToggleGroupItem>
              <ToggleGroupItem
                value="上級"
                className="cursor-pointer rounded-full px-4 py-2 text-sm data-[pressed]:bg-red-600 data-[pressed]:text-white"
              >
                上級
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* Question count */}
        <div className="text-center py-2">
          <p className="text-emerald-700 font-semibold text-2xl">
            {questionCount}問
          </p>
          <p className="text-muted-foreground text-xs mt-1">出題数</p>
        </div>

        <Button
          onClick={handleStart}
          disabled={!canStart}
          size="lg"
          className="w-full py-6 rounded-2xl text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          クイズを始める
        </Button>

        <Button
          onClick={onStudy}
          variant="outline"
          size="lg"
          className="w-full py-5 rounded-2xl text-base font-semibold border-2"
        >
          📖 学習テキストを読む
        </Button>

        {isInstallable && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center">
              <p className="text-sm text-blue-800 mb-2">
                ホーム画面に追加してオフラインでも使えます
              </p>
              <Button
                onClick={install}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
              >
                インストール
              </Button>
            </CardContent>
          </Card>
        )}

        {!isInstallable && isIOS() && (
          <Card className="bg-muted">
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Safariの共有ボタン
                <span className="inline-block mx-1">&#x2B06;</span>
                から「ホーム画面に追加」でインストールできます
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
