# 数学カルタ (math-karuta) - プロジェクト解説

数学カルタは、伝統的なかるたゲームと数学の公式を組み合わせた教育的なウェブゲームです。  
このプロジェクトは、数学の公式を楽しく学習するためのゲームとして設計され、プレイヤーはCPUと対戦しながら公式を覚えます。

---

## 目次

- [ゲームの基本機能とUIの流れ](#ゲームの基本機能とuiの流れ)
  - [ゲーム起動と初期設定](#ゲーム起動と初期設定)
  - [メインUIとレイアウトの構成](#メインuiとレイアウトの構成)
  - [ユーザーインタラクションの流れ](#ユーザーインタラクションの流れ)
  - [ゲーム進行中の動的処理](#ゲーム進行中の動的処理)
  - [ゲーム終了と結果表示](#ゲーム終了と結果表示)
- [コードセクションの詳細解説](#コードセクションの詳細解説)
  - [初期化処理とグローバル変数の定義](#初期化処理とグローバル変数の定義)
  - [UIの描画とDOM要素の取得](#uiの描画とdom要素の取得)
  - [イベントリスナーの設定と処理](#イベントリスナーの設定と処理)
  - [ゲームロジックの中核部分](#ゲームロジックの中核部分)
  - [タイマー処理と非同期処理](#タイマー処理と非同期処理)
  - [スコア管理と結果処理](#スコア管理と結果処理)
  - [エラー処理とデバッグの工夫](#エラー処理とデバッグの工夫)
  - [コード全体のまとめとモジュール化のポイント](#コード全体のまとめとモジュール化のポイント)
- [セットアップと実行方法](#セットアップと実行方法)
- [ライセンス](#ライセンス)

---

## ゲームの基本機能とUIの流れ

### ゲーム起動と初期設定

**対応ファイル**:  
- `index.html`  
  → ゲーム画面の基本レイアウト（タイトル画面、ルート要素）  
- `src/App.tsx`  
  → ゲームの初期化処理やステート変数の定義

**イントロダクション**:
ゲーム開始前は、タイトル「数学かるた」と難易度選択画面が表示されます。難易度は「初級」「中級」「上級」の3段階から選べ、各難易度によって制限時間やCPUのエラー率が変わります。

**初期化処理の概要**:
```tsx
// src/App.tsx
const [gameStarted, setGameStarted] = useState(false);
const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
const [score, setScore] = useState({ player: 0, cpu: 0 });
const [currentProblem, setCurrentProblem] = useState<typeof formulas[0] | null>(null);
const [displayedFormulas, setDisplayedFormulas] = useState<typeof formulas>([]);
const [timeLeft, setTimeLeft] = useState(0);

// ゲーム開始処理
const startGame = useCallback(() => {
  const shuffled = shuffleFormulas();
  setDisplayedFormulas(shuffled);
  setCurrentProblem(shuffled[0]);
  setScore({ player: 0, cpu: 0 });
  setProblemCount(0);
  setGameStarted(true);
  setShowSelectScreen(false);
  setGameEnded(false);
  setTimeLeft(difficultySettings[difficulty].timeLimit);
}, [difficulty, shuffleFormulas]);
```

ゲーム開始時には以下の初期化が行われます：
- スコアのリセット
- 表示する数学公式のシャッフル
- タイマーの設定
- 現在の問題の設定
- ゲーム状態のフラグ設定

### メインUIとレイアウトの構成

**画面レイアウトの説明**:  
HTMLの基本構造は以下のようになっています：

```html
<!-- index.html (基本構造) -->
<!doctype html>
<html lang="ja">
  <head>
    <!-- メタタグ、フォント読み込みなど -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Reactを使用して実際のUI要素は動的に構築されます。

**UIコンポーネントの解説**:

1. **ヘッダー部分**:
   - ゲームタイトル「数学かるた」
   - サブタイトル「Mathematical Karuta」
   - 音声オン/オフ切り替えボタン

2. **難易度選択画面**:
   - 初級、中級、上級の3つの難易度選択ボタン
   - 各難易度の制限時間表示

3. **ゲームプレイ画面**:
   - 問題表示エリア（数学の問題文）
   - 残り時間・問題番号表示
   - プレイヤーとCPUのスコア表示
   - 数学公式カード（5×2のグリッドレイアウト）

4. **結果画面**:
   - 勝敗表示（トロフィーアイコンまたはメダルアイコン）
   - 最終スコア表示
   - 再プレイボタン

CSSスタイリングはTailwind CSSを使用し、カードのデザインや配置、アニメーション効果などが実装されています。特に「Mamelon」というフォントを使用して、日本語の表示を美しく整えています。

### ユーザーインタラクションの流れ

**ユーザー操作のパターン**:

1. **難易度選択**:
   - ユーザーが難易度ボタン（初級/中級/上級）をクリックするとゲーム開始準備が行われます
   - クリック後5秒のカウントダウンが発生します：
   ```tsx
   onClick={() => {
     setDifficulty('beginner');
     setTimeout(startGame, 5000);
   }}
   ```

2. **カードの選択**:
   - ユーザーは表示されている数学公式カードをクリックして回答します
   - 正解・不正解に応じてスコアが更新され、効果音がなります

3. **音声コントロール**:
   - 右上のボタンをクリックして音声のオン/オフを切り替えられます

4. **ゲーム終了後の再プレイ**:
   - 結果画面で「もう一度プレイ」ボタンをクリックすると難易度選択画面に戻ります

**イベントハンドラーの連携**:

カード選択時の処理例：
```tsx
// src/App.tsx
const handleFormulaClick = useCallback((formula: typeof formulas[0]) => {
  if (!currentProblem || penaltyTimer > 0 || !gameStarted) return;

  if (formula.id === currentProblem.id) {
    playSound('correct');
    setScore(prev => ({ ...prev, player: prev.player + 1 }));
    nextProblem();
  } else {
    playSound('wrong');
    setPenaltyTimer(5);
  }
}, [currentProblem, penaltyTimer, gameStarted]);
```

この処理によりカードクリック時に：
- 現在の問題と選択したカードが一致するか確認
- 正解の場合：正解音を再生し、プレイヤーのスコアを増加して次の問題へ
- 不正解の場合：不正解音を再生し、5秒間のペナルティタイマーを設定

### ゲーム進行中の動的処理

**問題生成と表示**:

数学問題は `formulas.ts` ファイルで定義されており、ゲーム開始時にシャッフルされて表示されます：

```tsx
// src/data/formulas.ts (一部抜粋)
export const formulas: Formula[] = [
  {
    id: '1',
    problem: '2次方程式の解の公式は？',
    formula: 'x = -b ± √(b² - 4ac) / 2a',
    imageUrl: '...'
  },
  // 他の公式...
];

// src/App.tsx
const shuffleFormulas = useCallback(() => {
  return [...formulas].sort(() => Math.random() - 0.5).slice(0, 10);
}, []);
```

**タイマーと進行管理**:

ゲーム中は、選択した難易度に応じたタイマーがカウントダウンし、時間切れになるとCPUが回答を試みます：

```tsx
// src/App.tsx
useEffect(() => {
  if (!gameStarted || !currentProblem) return;

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 0) {
        const cpuWillMiss = Math.random() < difficultySettings[difficulty].cpuErrorRate;
        if (!cpuWillMiss) {
          setScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
          playSound('wrong');
          nextProblem();
        }
        return difficultySettings[difficulty].timeLimit;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [gameStarted, currentProblem, difficulty, nextProblem]);
```

このタイマー処理では：
- 1秒ごとに残り時間を減少
- 時間切れの場合、CPU側の回答チャンスとなる
- CPUのエラー率（難易度によって変化）に基づいて正答/誤答を決定
- CPUが正解した場合はCPUのスコアを増加させ、次の問題へ進む

**スコア計算とフィードバック**:

正誤判定後のフィードバックとして以下が実装されています：
- 効果音の再生（正解/不正解/勝利/敗北）
- スコア表示の更新
- 不正解時のペナルティタイマー（5秒間）

### ゲーム終了と結果表示

**終了条件の確認**:

ゲームは以下の条件で終了します：
- 全10問の問題を回答し終えたとき

```tsx
// src/App.tsx
const nextProblem = useCallback(() => {
  setProblemCount(prev => {
    const next = prev + 1;
    if (next >= 10) {
      endGame();
      return prev;
    }
    setCurrentProblem(displayedFormulas[next]);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    return next;
  });
}, [displayedFormulas, difficulty]);
```

**結果画面のUI更新**:

ゲーム終了時には結果画面が表示され、勝敗とスコアが表示されます：

```tsx
// src/App.tsx (結果画面部分)
{gameEnded && (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
    <div className="bg-gray-50 p-8 rounded-lg shadow-lg text-center">
      <div className="text-6xl mb-4">
        {score.player > score.cpu ? (
          <Trophy className="mx-auto text-yellow-400" size={80} />
        ) : (
          <Award className="mx-auto text-gray-400" size={80} />
        )}
      </div>
      <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>
        {score.player > score.cpu ? '勝利！' : '敗北...'}
      </h2>
      <p className="text-xl mb-6" style={{ fontFamily: 'Mamelon' }}>
        最終スコア: {score.player} - {score.cpu}
      </p>
      <button
        onClick={() => {
          setShowSelectScreen(true);
          setGameEnded(false);
        }}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        style={{ fontFamily: 'Mamelon' }}
      >
        もう一度プレイ
      </button>
    </div>
  </div>
)}
```

勝敗に応じて：
- 勝利時：黄金色のトロフィーアイコンと「勝利！」メッセージ
- 敗北時：灰色のメダルアイコンと「敗北...」メッセージ
- 最終スコア（プレイヤー対CPU）の表示
- 「もう一度プレイ」ボタンで難易度選択画面に戻る

## コードセクションの詳細解説

### 初期化処理とグローバル変数の定義

**グローバル変数の役割**:

React Hooksの`useState`を使用して、ゲームの状態管理に必要な変数が定義されています：

```tsx
// src/App.tsx
const [gameStarted, setGameStarted] = useState(false);          // ゲーム進行中かどうか
const [difficulty, setDifficulty] = useState<Difficulty>('beginner'); // 難易度設定
const [score, setScore] = useState({ player: 0, cpu: 0 });     // プレイヤーとCPUのスコア
const [currentProblem, setCurrentProblem] = useState<typeof formulas[0] | null>(null); // 現在の問題
const [displayedFormulas, setDisplayedFormulas] = useState<typeof formulas>([]); // 表示中の公式カード
const [muted, setMuted] = useState(false);                     // 音声のオン/オフ
const [penaltyTimer, setPenaltyTimer] = useState(0);           // 不正解時のペナルティタイマー
const [showSelectScreen, setShowSelectScreen] = useState(true); // 難易度選択画面表示フラグ
const [gameEnded, setGameEnded] = useState(false);             // ゲーム終了フラグ
const [problemCount, setProblemCount] = useState(0);           // 現在の問題番号
const [timeLeft, setTimeLeft] = useState(0);                   // 残り時間
```

これらの状態変数により、ゲームの各局面や進行状態を管理しています。

**初期化関数の実装**:

`startGame`関数がゲーム開始時の初期化を担当しています：

```tsx
// src/App.tsx
const startGame = useCallback(() => {
  const shuffled = shuffleFormulas();            // 公式をシャッフル
  setDisplayedFormulas(shuffled);                // 表示する公式を設定
  setCurrentProblem(shuffled[0]);                // 最初の問題を設定
  setScore({ player: 0, cpu: 0 });              // スコアをリセット
  setProblemCount(0);                           // 問題カウントをリセット
  setGameStarted(true);                         // ゲーム開始フラグをオン
  setShowSelectScreen(false);                   // 選択画面を非表示に
  setGameEnded(false);                          // ゲーム終了フラグをオフ
  setTimeLeft(difficultySettings[difficulty].timeLimit); // タイマーを設定
}, [difficulty, shuffleFormulas]);
```

この関数は難易度選択後に呼び出され、ゲームに必要な全ての状態を初期化します。

### UIの描画とDOM要素の取得

**React コンポーネントとレンダリング**:

このプロジェクトではReactを使用しており、JSXを通じてUIが構築されています：

```tsx
// src/App.tsx (UIのレンダリング部分)
return (
  <div className="min-h-screen bg-white">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>数学かるた</h1>
        <p className="text-xl mb-4" style={{ fontFamily: 'Mamelon' }}>Mathematical Karuta</p>
        
        {/* 音声切替ボタン */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        {/* 難易度選択画面 */}
        {showSelectScreen && (
          <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-lg">
            {/* 難易度ボタン */}
          </div>
        )}

        {/* ゲームプレイ画面 */}
        {gameStarted && (
          <>
            <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-lg">
              {/* 問題表示と情報 */}
            </div>
            
            <div className="flex justify-center space-x-8 mb-4">
              {/* スコア表示 */}
            </div>
          </>
        )}

        {/* 結果画面 */}
        {gameEnded && (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            {/* 結果表示 */}
          </div>
        )}
      </div>

      {/* 数学公式カード表示エリア */}
      <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
        {/* カード表示のマッピング */}
      </div>
    </div>
  </div>
);
```

Reactの条件付きレンダリング（`{条件 && <コンポーネント/>}`）を使用して、ゲームの状態に応じて異なる画面を表示しています。

**動的UI更新の基本**:

数学公式カードの表示例：
```tsx
// src/App.tsx
<div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
  {displayedFormulas.map((formula) => (
    <div
      key={formula.id}
      onClick={() => gameStarted && handleFormulaClick(formula)}
      className={`
        relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg 
        transform transition-all duration-200
        ${gameStarted ? 'cursor-pointer hover:scale-105' : ''}
        ${penaltyTimer > 0 ? 'pointer-events-none opacity-50' : ''}
        bg-gray-50
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <p className="text-lg font-bold text-center" style={{ fontFamily: 'Mamelon' }}>
          {formula.formula}
        </p>
      </div>
    </div>
  ))}
</div>
```

ここでは：
- `map`関数で公式配列をカードに変換
- 各カードにクリックイベントハンドラを設定
- 条件に応じたクラス名の動的設定（ペナルティ時の半透明化など）
- スタイリングにTailwind CSSを活用

### イベントリスナーの設定と処理

**イベントリスナーの種類と設定方法**:

Reactではイベントリスナーは要素の属性として直接設定されます：

```tsx
// src/App.tsx (イベントリスナー例)
<button
  onClick={() => setMuted(!muted)}
  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
>
  {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
</button>

// 難易度選択ボタン
<button
  onClick={() => {
    setDifficulty('beginner');
    setTimeout(startGame, 5000);
  }}
  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
  style={{ fontFamily: 'Mamelon' }}
>
  初級 (2分)
</button>

// 数学公式カードのクリックイベント
<div
  key={formula.id}
  onClick={() => gameStarted && handleFormulaClick(formula)}
  className={/* ... */}
>
  {/* ... */}
</div>
```

**イベント発生時の処理フロー**:

カード選択時の処理フローを詳細に見ると：

```tsx
// src/App.tsx
const handleFormulaClick = useCallback((formula: typeof formulas[0]) => {
  // 1. 前提条件のチェック
  if (!currentProblem || penaltyTimer > 0 || !gameStarted) return;

  // 2. 選択したカードが正解かどうかチェック
  if (formula.id === currentProblem.id) {
    // 3a. 正解の場合
    playSound('correct');                          // 正解音を再生
    setScore(prev => ({ ...prev, player: prev.player + 1 })); // スコア加算
    nextProblem();                                 // 次の問題へ
  } else {
    // 3b. 不正解の場合
    playSound('wrong');                           // 不正解音を再生
    setPenaltyTimer(5);                          // ペナルティタイマーを設定
  }
}, [currentProblem, penaltyTimer, gameStarted]);
```

この処理では：
1. まず現在のゲーム状態をチェック（問題が存在するか、ペナルティ中でないか、ゲームが進行中か）
2. 選択したカードと現在の問題が一致するかを確認
3. 正解/不正解に応じて異なる処理を実行

### ゲームロジックの中核部分

**数学問題の定義と管理**:

数学問題は `formulas.ts` ファイルで定義されています：

```tsx
// src/data/formulas.ts
interface Formula {
  id: string;
  problem: string;
  formula: string;
  imageUrl: string;
}

export const formulas: Formula[] = [
  {
    id: '1',
    problem: '2次方程式の解の公式は？',
    formula: 'x = -b ± √(b² - 4ac) / 2a',
    imageUrl: '...'
  },
  // 他の公式...
];
```

**正誤判定とスコア更新**:

正誤判定はカードIDと現在の問題IDを比較することで行われます：
```tsx
// 正解の場合
if (formula.id === currentProblem.id) {
  playSound('correct');
  setScore(prev => ({ ...prev, player: prev.player + 1 })); // スコア加算
  nextProblem();
}
```

**次の問題への遷移処理**:

```tsx
// src/App.tsx
const nextProblem = useCallback(() => {
  setProblemCount(prev => {
    const next = prev + 1;
    // ゲーム終了条件の確認（全10問回答）
    if (next >= 10) {
      endGame();
      return prev;
    }
    // 次の問題を設定
    setCurrentProblem(displayedFormulas[next]);
    // タイマーをリセット
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    return next;
  });
}, [displayedFormulas, difficulty]);
```

### タイマー処理と非同期処理

**タイマーの実装**:

ゲーム中のタイマー処理はuseEffectフックとsetIntervalを使って実装されています：

```tsx
// src/App.tsx
useEffect(() => {
  if (!gameStarted || !currentProblem) return;

  // 1秒ごとに実行されるタイマー
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 0) {
        // 時間切れの場合のCPU側の処理
        const cpuWillMiss = Math.random() < difficultySettings[difficulty].cpuErrorRate;
        if (!cpuWillMiss) {
          setScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
          playSound('wrong');
          nextProblem();
        }
        return difficultySettings[difficulty].timeLimit;
      }
      return prev - 1;
    });
  }, 1000);

  // コンポーネントのアンマウント時やdependenciesの変更時にタイマーをクリア
  return () => clearInterval(timer);
}, [gameStarted, currentProblem, difficulty, nextProblem]);
```

**ペナルティタイマーの処理**:

不正解時のペナルティタイマーも同様にuseEffectとsetIntervalで実装されています：

```tsx
// src/App.tsx
useEffect(() => {
  if (penaltyTimer <= 0) return;
  
  const timer = setInterval(() => {
    setPenaltyTimer(prev => Math.max(0, prev - 1));
  }, 1000);
  
  return () => clearInterval(timer);
}, [penaltyTimer]);
```

### スコア管理と結果処理

**スコア計算の詳細**:

スコアは正解ごとに1ポイント加算される単純な仕組みです：

```tsx
// プレイヤーのスコア加算（正解時）
setScore(prev => ({ ...prev, player: prev.player + 1 }));

// CPUのスコア加算（時間切れでCPUが正解した場合）
setScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
```

**結果表示のためのUI更新**:

ゲーム終了時の処理：

```tsx
// src/App.tsx
const endGame = useCallback(() => {
  setGameStarted(false);
  setGameEnded(true);
  const playerWon = score.player > score.cpu;
  playSound(playerWon ? 'win' : 'lose');
}, [score]);
```

結果画面のレンダリング：

```tsx
// src/App.tsx
{gameEnded && (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
    <div className="bg-gray-50 p-8 rounded-lg shadow-lg text-center">
      <div className="text-6xl mb-4">
        {score.player > score.cpu ? (
          <Trophy className="mx-auto text-yellow-400" size={80} />
        ) : (
          <Award className="mx-auto text-gray-400" size={80} />
        )}
      </div>
      <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>
        {score.player > score.cpu ? '勝利！' : '敗北...'}
      </h2>
      <p className="text-xl mb-6" style={{ fontFamily: 'Mamelon' }}>
        最終スコア: {score.player} - {score.cpu}
      </p>
      <button
        onClick={() => {
          setShowSelectScreen(true);
          setGameEnded(false);
        }}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        style={{ fontFamily: 'Mamelon' }}
      >
        もう一度プレイ
      </button>
    </div>
  </div>
)}
```

### エラー処理とデバッグの工夫

**効果音再生時のエラー処理**:

効果音再生時のエラーを無視するための対策：

```tsx
// src/App.tsx
const playSound = (type: 'correct' | 'wrong' | 'win' | 'lose') => {
  if (muted) return;
  const sounds = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    lose: 'https://assets.mixkit.co/active_storage/sfx/1430/1430-preview.mp3'
  };
  new Audio(sounds[type]).play().catch(() => {});
};
```

**条件チェックによる無効な操作の防止**:

無効な操作を防止するための条件チェック：

```tsx
// カードクリック時のチェック
if (!currentProblem || penaltyTimer > 0 || !gameStarted) return;

// タイマー処理時のチェック
if (!gameStarted || !currentProblem) return;
```

### コード全体のまとめとモジュール化のポイント

**コードの整理とモジュール分離**:

このプロジェクトでは、以下のようにコードが整理されています：

1. **データの分離**: 数学公式データは `src/data/formulas.ts` に分離
2. **UIコンポーネント**: App.tsxでReactコンポーネントとしてUIを構築
3. **状態管理**: React Hooksを使用した状態管理（useState, useEffect, useCallback）
4. **設定の集約**: 難易度設定などはオブジェクトに集約して管理

```tsx
// 難易度設定の集約例
const difficultySettings: Record<Difficulty, DifficultyConfig> = {
  beginner: { timeLimit: 120, cpuErrorRate: 0.3 },
  intermediate: { timeLimit: 60, cpuErrorRate: 0.15 },
  advanced: { timeLimit: 30, cpuErrorRate: 0.02 }
};
```

**将来的な拡張性のポイント**:

1. **問題データの外部化**: 現在は静的に定義されている問題データを、APIや外部ファイルから読み込むことで拡張可能
2. **難易度の追加**: difficultySettings オブジェクトに新しい難易度を追加するだけで拡張できる
3. **モバイル対応**: Tailwind CSSのレスポンシブクラスを活用して、さらにモバイルフレンドリーに改善可能

## セットアップと実行方法

依存パッケージのインストール:

```bash
npm install
```

開発サーバーの起動:

```bash
npm run dev
```

→ ブラウザで http://localhost:3000 にアクセスして動作確認。

本番用ビルド:

```bash
npm run build
```

→ 出力されたファイルは dist ディレクトリに配置されます。

## ライセンス

本プロジェクトのライセンスに関しては、LICENSE ファイルをご確認ください。