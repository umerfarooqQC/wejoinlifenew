import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '../form/Controls';
import { SearchInput } from '../form/Input';
import { StatusBadge } from './StatusBadge';
import { LoadingState, EmptyState } from './FeedbackStates';
import './DataTable.css';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  pagination?: {
    pageSize?: number;
  };
  emptyText?: string;
  title?: string;
  headerToolbar?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search table...',
  actions,
  pagination = { pageSize: 5 },
  emptyText = 'No records found',
  title,
  headerToolbar,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data by search
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const pageSize = pagination.pageSize || 5;
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Row selection
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(paginatedData.map(keyExtractor));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedRowKeys, key]);
    } else {
      onSelectionChange(selectedRowKeys.filter((k) => k !== key));
    }
  };

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedRowKeys.includes(keyExtractor(row)));

  return (
    <div className="wjl-table-container">
      {/* Table Toolbar */}
      {(title || searchable || headerToolbar) && (
        <div className="wjl-table-toolbar">
          <div className="wjl-table-toolbar__left">
            {title && <h3 className="wjl-table-toolbar__title">{title}</h3>}
            {searchable && (
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                sizeVariant="sm"
                className="wjl-table-search"
              />
            )}
          </div>
          <div className="wjl-table-toolbar__right">{headerToolbar}</div>
        </div>
      )}

      {/* Table View */}
      <div className="wjl-table-scroll">
        <table className="wjl-table">
          <thead>
            <tr>
              {selectable && (
                <th className="wjl-table__th wjl-table__th--checkbox">
                  <Checkbox checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`wjl-table__th ${col.sortable ? 'wjl-table__th--sortable' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key, col.sortable)}
                >
                  <div className="wjl-table__th-content">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="wjl-table__sort-icon">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} className="wjl-table__sort-idle" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="wjl-table__th wjl-table__th--actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <LoadingState label="Loading data records..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <EmptyState title="No records" description={emptyText} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const key = keyExtractor(row);
                const isSelected = selectedRowKeys.includes(key);

                return (
                  <tr key={key} className={`wjl-table__tr ${isSelected ? 'wjl-table__tr--selected' : ''}`}>
                    {selectable && (
                      <td className="wjl-table__td wjl-table__td--checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      let cellVal: any = '';
                      if (typeof col.accessor === 'function') {
                        cellVal = col.accessor(row);
                      } else if (col.accessor) {
                        cellVal = row[col.accessor];
                      }

                      return (
                        <td key={col.key} className="wjl-table__td">
                          {col.render ? col.render(cellVal, row) : cellVal}
                        </td>
                      );
                    })}
                    {actions && <td className="wjl-table__td wjl-table__td--actions">{actions(row)}</td>}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && sortedData.length > 0 && (
        <div className="wjl-table-pagination">
          <div className="wjl-table-pagination__info">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="wjl-table-pagination__controls">
            <button
              className="wjl-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="wjl-pagination-page">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="wjl-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
