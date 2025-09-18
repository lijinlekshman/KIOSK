import React, { useMemo, useCallback } from 'react';
import {
  useTable,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  TableInstance
} from 'react-table';
type HospitalData = {
  hospital: string;
  totalCheckins: number;
  completedCheckins: number;
  abandonedCheckins: number;
  totalPARequests: number;
  avgCheckinTime: string;
  lastUpdated?: string;
};

interface KioskUsageGridProps {
  data: HospitalData[];
}

const KioskUsageGrid: React.FC<KioskUsageGridProps> = ({ data }) => {
  const columns: Column<HospitalData>[] = useMemo(
    () => [
      { Header: 'Hospital', accessor: 'hospital' },
      { Header: 'Total Check-ins', accessor: 'totalCheckins' },
      { Header: 'Completed Check-ins', accessor: 'completedCheckins' },
      { Header: 'Abandoned Check-ins', accessor: 'abandonedCheckins' },
      { Header: 'Total PA Requests', accessor: 'totalPARequests' },
      { Header: 'Avg. Check-in Time', accessor: 'avgCheckinTime' }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state
  } = useTable<HospitalData>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 } as Record<string, unknown>
    },
    usePagination
  ) as TableInstance<HospitalData> & {
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageOptions: number[];
    gotoPage: (pageIndex: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    state: { pageIndex: number };
    page: Row<HospitalData>[];
  };

  // Event handlers for pagination
  const handleFirstPage = useCallback(() => {
    gotoPage(0);
  }, [gotoPage]);

  const handlePreviousPage = useCallback(() => {
    previousPage();
  }, [previousPage]);

  const handleNextPage = useCallback(() => {
    nextPage();
  }, [nextPage]);

  const handleLastPage = useCallback(() => {
    gotoPage(pageOptions.length - 1);
  }, [gotoPage, pageOptions.length]);

  return (
    <div className='table-responsive cstm-tableDesign'>
      <table {...getTableProps()} className='table table-hover align-middle'>
        <thead className='table-light'>
          {headerGroups.map(
            (headerGroup: HeaderGroup<HospitalData>, hgIdx: number) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={hgIdx}>
                {headerGroup.headers.map((column, colIdx) => (
                  <th {...column.getHeaderProps()} key={colIdx}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            )
          )}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='text-center text-muted py-4'
              >
                No data available
              </td>
            </tr>
          ) : (
            page.map((row: Row<HospitalData>, rowIdx: number) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={rowIdx}>
                  {row.cells.map((cell, cellIdx) => (
                    <td {...cell.getCellProps()} key={cellIdx}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className='d-flex justify-content-between align-items-center py-2 gridPagination'>
        <span className='pageCount'>
          Page{' '}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <div className='paginationBtns'>
          <button
            className='btn btn-sm btn-outline-secondary me-1'
            onClick={handleFirstPage}
            disabled={!canPreviousPage}
            aria-label='First page'
          >
            <span className='bi bi-chevron-double-left' />
          </button>
          <button
            className='btn btn-sm btn-outline-secondary me-1'
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
            aria-label='Previous page'
          >
            <span className='bi bi-chevron-left' />
          </button>
          <button
            className='btn btn-sm btn-outline-secondary me-1'
            onClick={handleNextPage}
            disabled={!canNextPage}
            aria-label='Next page'
          >
            <span className='bi bi-chevron-right' />
          </button>
          <button
            className='btn btn-sm btn-outline-secondary'
            onClick={handleLastPage}
            disabled={!canNextPage}
            aria-label='Last page'
          >
            <span className='bi bi-chevron-double-right' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KioskUsageGrid;
