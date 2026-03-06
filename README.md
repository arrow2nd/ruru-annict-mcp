# ruru-annict-mcp

[Annict](https://annict.com/) の REST API v1 を利用した MCP サーバーです。アニメの作品検索、エピソード・レビュー・記録の閲覧などを AI アシスタントから行えます。

## 提供ツール

| ツール名 | 説明 |
| --- | --- |
| `search_works` | 作品を検索する（タイトル・シーズン等で絞り込み可能） |
| `get_my_works` | 自分がステータスを付けた作品の一覧を取得する |
| `get_episodes` | 作品のエピソード一覧を取得する |
| `get_records` | エピソードへの記録（感想・評価）一覧を取得する |
| `get_reviews` | 作品のレビュー一覧を取得する |
| `get_me` | 認証ユーザーの情報を取得する |
| `get_following_activities` | フォロー中のユーザーのアクティビティを取得する |
| `get_my_programs` | 自分の放送予定を取得する |
| `get_casts` | 作品のキャスト（声優）一覧を取得する |
| `get_staffs` | 作品のスタッフ一覧を取得する |

## セットアップ

### アクセストークンの取得

[Annict の開発者向けページ](https://annict.com/settings/apps) から個人用アクセストークンを発行してください。

### Claude Desktop

`claude_desktop_config.json` に以下を追加します。

```json
{
  "mcpServers": {
    "annict": {
      "command": "npx",
      "args": ["-y", "ruru-annict-mcp"],
      "env": {
        "ANNICT_ACCESS_TOKEN": "<your-access-token>"
      }
    }
  }
}
```

### Streamable HTTP モード

`--http` フラグを付けると Streamable HTTP トランスポートで起動します。

```bash
ANNICT_ACCESS_TOKEN=<your-access-token> npx ruru-annict-mcp --http
```

`PORT` 環境変数でポートを指定できます（未指定時はランダム）。MCP エンドポイントは `http://localhost:<port>/mcp` です。

## 開発

```bash
npm install
npm run dev          # 開発サーバー起動（stdio）
npm run build        # ビルド
npm test             # テスト
npm run check        # Biome lint / format
npm run typecheck    # 型チェック
```

## ライセンス

MIT
