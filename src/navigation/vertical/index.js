export default [
  {
    title: 'Inicio',
    to: { name: 'home' },
    icon: { icon: 'tabler-ripple' },
    action: 'read',
    subject: ['admin', 'brigadier']
  },
  {
    title: 'Cuencas',
    to: { name: 'apps-projects-list' },
    icon: { icon: 'tabler-map-star' },
    action: 'manage',
    subject: 'admin'
  },
  {
    title: 'Usuarios',
    to: { name: 'apps-users-list' },
    icon: { icon: 'tabler-users' },
    action: 'manage',
    subject: 'admin'
  },
  {
    title: 'Catálogos',
    to: { name: 'apps-catalogs-list' },
    icon: { icon: 'tabler-list-details' },
  },
  {
    title: 'Formato de campo',
    icon: { icon: 'tabler-notes' },
    children: [
      { 
        title: 'Sitio de referencia', 
        to: 'forms-reference-site',
        action: 'read',
        subject: ['admin', 'brigadier']
      },
      { 
        title: 'Sitio de interés', 
        to: 'forms-interest-site',
        action: 'read',
        subject: ['admin', 'brigadier']
      },
    ],
  },
]
