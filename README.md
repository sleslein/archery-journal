# Archery Journal

A small app for tracking archery statistics.

## Commands

### `record`

Records a new session.

```sh
deno run --allow-write mod.ts record --distance 20 --date yyyy-mm-dd tm9br m10 br8rl
```

### `get`

The `get` command returns the details for the last session

```sh
deno run --allow-read mod.ts get
```

### `decode`

Decodes a single arrow value.

```sh
deno run mod.ts decode tr6bl
```