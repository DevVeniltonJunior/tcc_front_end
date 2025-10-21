import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  // Validação de valores
  const safeCurrentPage = Number(currentPage) || 1;
  const safeTotalItems = Number(totalItems) || 0;
  const safeItemsPerPage = Number(itemsPerPage) || 10;
  
  const totalPages = Math.ceil(safeTotalItems / safeItemsPerPage);

  // Não mostrar paginação se não houver itens ou se houver apenas uma página
  if (!safeTotalItems || totalPages <= 1 || isNaN(totalPages)) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <Button
        variant="secondary"
        onClick={() => onPageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        className="px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === safeCurrentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-2 text-sm rounded-lg transition-all ${
                isActive ? 'font-bold' : ''
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                    }
                  : {
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                    }
              }
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="secondary"
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === totalPages}
        className="px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}

