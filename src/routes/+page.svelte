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

	import type { ZipCodeData } from './+page';

	let { data } = $props();

	// 変更される場合は Rune を使用する
	let zipCodeData: ZipCodeData[] = $state.raw([]);

	// await ブロックで使用する
	async function loadZipCodeData() {
		zipCodeData = await data.zipCodeData;
	}

	const columnHelper = createColumnHelper<ZipCodeData>();
	const columns = [
		columnHelper.accessor('zip_code', {
			header: '郵便番号',
			size: 100
		}),
		columnHelper.accessor('prefecture', {
			header: '都道府県',
			size: 100
		}),
		columnHelper.accessor('city', {
			header: '市区町村'
		}),
		columnHelper.accessor('town', {
			header: '町域'
		})
	];

	const [pagination, setPagination] = createTableState<PaginationState>({
		pageSize: 10,
		pageIndex: 0
	});

	const [sorting, setSorting] = createTableState<SortingState>([]);

	const [columnVisibility, setColumnVisibility] = createTableState<VisibilityState>({});

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

	const table = createTable(options);

	let pageIndex = $derived(table.getState().pagination.pageIndex + 1);
</script>

<div class="grid place-items-center">
	<div class="inline-grid w-full max-w-screen-lg gap-2 p-2">
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
					page={pageIndex}
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
										isActive={currentPage == page.value}
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
							const index = e.currentTarget.value ? Number(e.currentTarget.value) - 1 : 0;
							table.setPageIndex(index);
						}}
						onblur={(e) => {
							e.currentTarget.value = '';
						}}
					/>
				</div>
			</div>
		{/await}
	</div>

	<pre>{JSON.stringify(
			{
				sort: table.getState().sorting,
				pagination: table.getState().pagination
			},
			null,
			2
		)}</pre>
</div>
