const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

export const downloadCsv = (filename, columns, rows) => {
  const csv = [columns.map((column) => escapeCsv(column.label)).join(',')]
  rows.forEach((row) => csv.push(columns.map((column) => escapeCsv(row[column.key])).join(',')))
  const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export const printReport = (title, columns, rows) => {
  const popup = window.open('', '_blank', 'noopener,noreferrer')
  if (!popup) return false
  const table = `<table><thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${String(row[column.key] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`
  popup.document.write(`<!doctype html><title>${title}</title><style>body{font:14px system-ui;margin:32px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#e5edeb}</style><h1>${title}</h1><p>Generated ${new Date().toLocaleString()}</p>${table}`)
  popup.document.close()
  popup.print()
  return true
}
