# 詳細仕様書: ブラウザベース Markdown エディタ

## 1. 概要
本仕様書は、ブラウザベースのMarkdownエディタの技術的詳細を定義する。
フレームワークには **React** を使用し、エディタコアには **Tiptap** (または類似のProseMirrorベースライブラリ) を採用することでNotionライクな体験を実現する。

## 2. 技術スタック
- **Frontend Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Editor Core**: Tiptap (Headless WYSIWYG editor)
- **Syntax Highlighting**: lowlight / highlight.js (via Tiptap extension)
- **Diagramming**: Mermaid.js
- **Storage**: `localStorage` / IndexedDB (via localforage recommended for larger text)
- **PWA**: Vite PWA Plugin

## 3. UI/UX 仕様

### 3.1. 画面レイアウト
- **ヘッダー**:
    - タイトル入力エリア
    - テーマ切り替えボタン（☀/☾）
    - インポート/エクスポートボタン
- **メインエリア**:
    - エディタキャンバス（中央配置、レスポンシブ幅）
    - ブロック単位の操作（「/」コマンドでメニュー呼び出しなど）
- **図形挿入モーダル**:
    - Mermaid図を作成するためのGUIツール（簡易的なノード・エッジ追加UI）

### 3.2. テーマ (Dark/Light Mode)
- CSS Variables (`--bg-color`, `--text-color`, etc.) を使用して定義。
- `prefers-color-scheme` メディアクエリを初期値とし、ユーザー設定をローカルストレージに保存して優先する。

## 4. データモデル

### 4.1. エディタ状態
TiptapのJSON形式を内部状態として保持し、保存・エクスポート時にMarkdownへ変換する。

```typescript
interface EditorState {
  content: JSON; // Tiptap document structure
  lastUpdated: number;
}
```

### 4.2. ローカル保存
- Key: `tempwriter_content`
- Value: Markdown文字列 または Editor JSON
- タイミング: `onChange` イベントでデバウンス（例: 1秒ごと）して保存。

## 5. ロジック / フロー

### 5.1. ファイルインポート
1. `<input type="file" accept=".md">` でファイル選択。
2. `FileReader` APIでテキスト読み込み。
3. Markdownパーサーを通してエディタ状態に変換し、セットする。

### 5.2. ファイルエクスポート
1. エディタ状態をMarkdown文字列にシリアライズ。
2. `Blob` オブジェクトを作成。
3. `URL.createObjectURL` でダウンロードリンクを生成し、クリック発火。

### 5.3. 図形挿入モード (Mermaid Builder)
1. ユーザーが「図形挿入」を選択。
2. モーダルが開く。
3. GUI（ボタンで「四角形追加」「矢印追加」など）を操作。
4. 操作に基づいてバックグラウンドでMermaid記法テキストを生成（例: `graph TD; A-->B;`）。
5. 「挿入」ボタンで、エディタのカーソル位置にMermaidコードブロックとして挿入。

## 6. エラーハンドリング
- **ストレージ容量オーバー**: `localStorage` の制限（約5MB）を超えた場合、アラートを表示し、エクスポートを促す。
- **不正なMarkdown**: インポート時にパース不可能な箇所があれば、プレーンテキストとして扱うか、エラー箇所を明示する。

## 7. 受け入れ条件 (Acceptance Criteria)
- [ ] ブラウザをリロードしても、直前の入力内容が復元されること。
- [ ] `.md` ファイルをドラッグ＆ドロップ（または選択）して読み込めること。
- [ ] 編集内容を `.md` ファイルとしてダウンロードできること。
- [ ] オフライン状態でアプリを開き、編集・保存ができること（PWA）。
- [ ] コードブロックが言語ごとに色分けされていること。
- [ ] ダークモードに切り替えた際、エディタ背景・文字色が適切に反転すること。
- [ ] Mermaid記法を書くと、図としてレンダリングされること。
- [ ] GUI操作で簡単なフローチャートを作成し、エディタに挿入できること。
