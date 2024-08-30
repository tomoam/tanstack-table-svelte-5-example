<script lang="ts">
	import type {
		ColumnFiltersState,
		PaginationState,
		SortingState,
		TableOptions,
		VisibilityState
	} from '@tanstack/svelte-table';
	import {
		createColumnHelper,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		createTable,
		FlexRender
	} from '@tanstack/svelte-table';

	import { createTableState } from './state.svelte';

	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import type { ZipCodeData } from '$lib/zip_code';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { prefectures } from '$lib/zip_code/prefectures';

	let { data } = $props();

	// 変更される場合は Rune を使用する。
	// 例えば特定の行の特定のフィールドだけ変更される場合は $state を使用し、
	// loadの再実行などで配列が再代入で丸ごと入れ替わるだけなら $state.raw を使用すると良い。
	let zipCodeData: ZipCodeData[] = $state.raw([]);

	// await ブロックで使用する
	async function loadZipCodeData() {
		zipCodeData = await data.zipCodeData;
	}

	// 各カラムの定義
	const columnHelper = createColumnHelper<ZipCodeData>();
	const columns = [
		columnHelper.accessor('zip_code', {
			header: '郵便番号'
		}),
		columnHelper.accessor('prefecture', {
			header: '都道府県'
		}),
		columnHelper.accessor('prefecture_kana', {
			header: '都道府県(カナ)'
		}),
		columnHelper.accessor('city', {
			header: '市区町村'
		}),
		columnHelper.accessor('city_kana', {
			header: '市区町村(カナ)'
		}),
		columnHelper.accessor('town', {
			header: '町域'
		}),
		columnHelper.accessor('town_kana', {
			header: '町域(カナ)'
		})
	];

	// ページネーションの初期値
	const [pagination, setPagination] = createTableState<PaginationState>({
		pageSize: 10,
		pageIndex: 0
	});
	// ソートの初期値
	const [sorting, setSorting] = createTableState<SortingState>([]);
	// カラム表示の初期値
	const [columnVisibility, setColumnVisibility] = createTableState<VisibilityState>({
		prefecture_kana: false,
		city_kana: false,
		town_kana: false
	});
	// カラムフィルタの初期値
	const [columnFiltersState, setColumnFiltersState] = createTableState<ColumnFiltersState>([]);

	const options: TableOptions<ZipCodeData> = {
		get data() {
			return zipCodeData;
		},
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFiltersState,
		state: {
			get pagination() {
				return pagination();
			},
			get sorting() {
				return sorting();
			},
			get columnVisibility() {
				return columnVisibility();
			},
			get columnFilters() {
				return columnFiltersState();
			}
		},
		debugTable: true
	};

	// テーブル作成
	const table = createTable(options);

	let currentPage = $state(1);

	let selected = $state($page.params.pref);

	type SelectChangeEvent = Event & {
		currentTarget: EventTarget & HTMLSelectElement;
	};
	const navigate = (e: SelectChangeEvent) => {
		goto(`/${e.currentTarget.value}`);
	};
</script>

<div class="grid place-items-center">
	<div class="inline-grid w-full max-w-screen-lg gap-2 p-2">
		<div class="grid gap-2">
			<label
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				for="prefectures">都道府県</label
			>
			<select
				class="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
				name="prefectures"
				onchange={navigate}
				bind:value={selected}
			>
				{#each prefectures as pref}
					<option value={pref.key}>{pref.kanji}</option>
				{/each}
			</select>
		</div>
		{#await loadZipCodeData()}
			<p>Loading...</p>
		{:then}
			<div class="flex items-center justify-between">
				<p class="text-md font-bold">{table.getRowCount()} rows</p>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" size="sm" class="ml-auto flex h-8" builders={[builder]}>
							View
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
						<DropdownMenu.CheckboxItem
							checked={table.getIsAllColumnsVisible()}
							onclick={table.getToggleAllColumnsVisibilityHandler()}
						>
							All
						</DropdownMenu.CheckboxItem>
						<DropdownMenu.Separator />
						{#each table.getAllFlatColumns() as column}
							<DropdownMenu.CheckboxItem
								checked={column.getIsVisible()}
								onclick={column.getToggleVisibilityHandler()}
							>
								{column.columnDef.header}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<div class="rounded-md border">
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup}
							<Table.Row>
								{#each headerGroup.headers as header}
									<Table.Head class="p-1">
										{#if !header.isPlaceholder}
											<Button
												variant="ghost"
												class="p-1"
												onclick={header.column.getToggleSortingHandler()}
											>
												<FlexRender
													content={header.column.columnDef.header}
													context={header.getContext()}
												/>
											</Button>
											{#if header.column.getCanFilter()}
												<div>
													<Input
														type="text"
														class="h-7 p-1"
														placeholder="Search..."
														onchange={(e) => {
															header.column.setFilterValue(e.currentTarget.value);
														}}
													/>
												</div>
											{/if}
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row}
							<Table.Row>
								{#each row.getVisibleCells() as cell}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="inline-grid gap-1">
				<Pagination.Root
					bind:page={currentPage}
					count={table.getRowCount()}
					perPage={table.getState().pagination.pageSize}
					let:pages
					let:currentPage
				>
					<Pagination.Content class="gap-0.5 sm:gap-1">
						<Pagination.Item>
							<Pagination.PrevButton
								class="px-2 [&>span]:sr-only"
								disabled={!table.getCanPreviousPage()}
								on:click={() => table.previousPage()}
							/>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis class="w-4 sm:w-9" />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link
										size="default"
										class="min-w-3 max-w-14 px-3 sm:px-4"
										{page}
										isActive={currentPage === page.value}
										onclick={() => table.setPageIndex(page.value - 1)}
									>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton
								class="px-2 [&>span]:sr-only"
								disabled={!table.getCanNextPage()}
								on:click={() => table.nextPage()}
							/>
						</Pagination.Item>
						<Pagination.Item></Pagination.Item>
					</Pagination.Content>
				</Pagination.Root>

				<div class="flex items-center justify-center gap-2 text-sm">
					<span class="font-medium">Go to page:</span>
					<Input
						type="number"
						min="1"
						max={table.getPageCount()}
						class="h-8 w-20 p-2"
						onchange={(e) => {
							const num = e.currentTarget.value ? Number(e.currentTarget.value) - 1 : 0;
							const index = num < 0 ? 0 : num >= table.getPageCount() ? table.getPageCount() - 1 : num;
							table.setPageIndex(index);
							currentPage = index + 1;
						}}
						onblur={(e) => {
							e.currentTarget.value = '';
						}}
					/>
				</div>
			</div>

			<pre>{JSON.stringify(
					{
						sort: table.getState().sorting,
						pagination: table.getState().pagination
					},
					null,
					2
				)}</pre>
		{/await}
	</div>
</div>
