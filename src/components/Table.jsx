import React from 'react';

export default function Table({ columns, data, renderActions, footer }) {
  console.log(data);
  return (
    <div className="overflow-auto h-full">
      <table className="min-w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                {c.label}
              </th>
            ))}
            {renderActions && <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span className="font-medium">No data available</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((c) => (
                  <td key={c.key} className="px-6 py-4 text-sm">
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
                {renderActions && <td className="px-6 py-4">{renderActions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
        {footer}
      </table>
    </div>
  );
}


