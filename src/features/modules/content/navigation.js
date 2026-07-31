export const MODULE_NAV = [
  {
    id: 'quotation',
    label: 'Cotizar nueva operación',
    path: '/app/cotizacion',
    icon: 'quote',
  },
  {
    id: 'documents',
    label: 'Vinculación documental',
    path: '/app/vinculacion',
    icon: 'folder',
    soon: true,
  },
  {
    id: 'operations',
    label: 'Operaciones',
    path: '/app/operaciones',
    icon: 'truck',
    soon: true,
  },
  {
    id: 'tracking',
    label: 'Tracking',
    path: '/app/tracking',
    icon: 'tracking',
    soon: true,
  },
  {
    id: 'customs',
    label: 'Diligenciamiento aduanero',
    path: '/app/aduanero',
    icon: 'customs',
    soon: true,
  },
  {
    id: 'billing',
    label: 'Facturas y Pagos',
    path: '/app/facturas',
    icon: 'billing',
    soon: true,
  },
  {
    id: 'ai-booking',
    label: 'Reservas con IA',
    path: '/app/reservas',
    icon: 'ai',
    soon: true,
  },
]

export function getActiveModuleId(pathname) {
  const match = MODULE_NAV.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  )
  return match?.id ?? 'quotation'
}
