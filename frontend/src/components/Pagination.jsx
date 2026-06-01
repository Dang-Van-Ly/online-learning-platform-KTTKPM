import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const btnBase = {
        padding: '8px 14px',
        margin: '0 4px',
        border: '1px solid #d1d3e2',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '13px',
        transition: 'all 0.2s'
    };

    const activeStyle = { ...btnBase, backgroundColor: '#4e73df', color: '#fff', borderColor: '#4e73df' };
    const inactiveStyle = { ...btnBase, backgroundColor: '#fff', color: '#4e73df' };
    const disabledStyle = { ...btnBase, backgroundColor: '#f8f9fc', color: '#ccc', cursor: 'not-allowed', borderColor: '#eaecf1' };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', alignItems: 'center' }}>
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                style={currentPage === 0 ? disabledStyle : inactiveStyle}
            >
                ◀ Trước
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    style={currentPage === i ? activeStyle : inactiveStyle}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                style={currentPage === totalPages - 1 ? disabledStyle : inactiveStyle}
            >
                Sau ▶
            </button>
        </div>
    );
}