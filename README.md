# Archery Journal

A small app for tracking archery statistics.

## Commands

### `list`

Lists sessions

```sh
deno run --allow-read  mod.ts list
```

### `record`

Records a new session.

```sh
deno run --allow-write mod.ts record --distance 20 --date yyyy-mm-dd tm9br m10 br8rl
```

### `update`

Updates the details of a specific session

```sh
deno run --allow-all mod.ts update --id 8 --date 2023-11-31 --distance 30 2:5tr
```

The `--id` flag is required. It represents the 0-based index of the session in
the array.

`--date`, `--distance` are optional and update the respective properties

The other args passed in are consisdered encoded arrows. They should follow the
format of `[arrowIndex]:[encodedArrow]`. For example `0:tr10br` updates the
first arrow to `tr10br`.

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
