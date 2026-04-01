import { useState, useMemo } from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { ServiceType, Difficulty } from '../types/quiz';

const SERVICE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: '児童発達支援', value: '児童発達支援' },
  { label: '放課後等デイサービス', value: '放課後等デイサービス' },
  { label: '居宅訪問', value: '居宅訪問' },
];

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty; color: string; activeColor: string }[] = [
  { label: '初級', value: '初級', color: 'bg-green-100 text-green-700 hover:bg-green-200', activeColor: 'bg-green-600 text-white' },
  { label: '中級', value: '中級', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200', activeColor: 'bg-yellow-500 text-white' },
  { label: '上級', value: '上級', color: 'bg-red-100 text-red-700 hover:bg-red-200', activeColor: 'bg-red-600 text-white' },
];

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

interface Props {
  onStart: (services: ServiceType[], difficulties: Difficulty[]) => void;
}

export default function StartScreen({ onStart }: Props) {
  const allServiceValues = SERVICE_OPTIONS.map((o) => o.value);
  const allDifficultyValues: Difficulty[] = ['初級', '中級', '上級'];

  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(allServiceValues);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(allDifficultyValues);
  const { isInstallable, install } = usePWAInstall();

  const isAllServices = selectedServices.length === allServiceValues.length;
  const isAllDifficulties = selectedDifficulties.length === allDifficultyValues.length;

  const questionCount = useMemo(() => {
    return ALL_QUESTIONS.filter(
      (q) =>
        (q.serviceType === '共通' || selectedServices.includes(q.serviceType)) &&
        selectedDifficulties.includes(q.difficulty),
    ).length;
  }, [selectedServices, selectedDifficulties]);

  const toggleAllServices = () => {
    setSelectedServices(isAllServices ? [] : allServiceValues);
  };

  const toggleService = (value: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value],
    );
  };

  const toggleAllDifficulties = () => {
    setSelectedDifficulties(isAllDifficulties ? [] : allDifficultyValues);
  };

  const toggleDifficulty = (value: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value],
    );
  };

  const handleStart = () => {
    if (selectedServices.length === 0 || selectedDifficulties.length === 0) return;
    onStart(selectedServices, selectedDifficulties);
  };

  const canStart = selectedServices.length > 0 && selectedDifficulties.length > 0 && questionCount > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">
          児童福祉 制度クイズ
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          児童発達支援・放課後等デイサービス・居宅訪問の制度と加算を学ぼう
        </p>

        {/* Service filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            サービス種別
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAllServices}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAllServices
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {SERVICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleService(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedServices.includes(opt.value)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            難易度
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={toggleAllDifficulties}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAllDifficulties
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleDifficulty(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDifficulties.includes(opt.value)
                    ? opt.activeColor
                    : opt.color
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="text-center mb-4">
          <p className="text-emerald-700 font-semibold text-2xl">
            {questionCount}問
          </p>
          <p className="text-gray-400 text-xs mt-1">出題数</p>
        </div>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          クイズを始める
        </button>

        {isInstallable && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800 mb-2">
              ホーム画面に追加してオフラインでも使えます
            </p>
            <button
              onClick={install}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              インストール
            </button>
          </div>
        )}

        {!isInstallable && isIOS() && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Safariの共有ボタン
              <span className="inline-block mx-1">&#x2B06;</span>
              か��「ホーム画面に追加」でインストールできます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
