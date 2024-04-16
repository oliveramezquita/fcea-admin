export default [
  {
    title: 'Proyectos',
    to: { name: 'apps-projects-list' },
    icon: { icon: 'tabler-category' },
  },
  {
    title: 'Usuarios',
    to: { name: 'apps-users-list' },
    icon: { icon: 'tabler-users' },
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
      { title: 'Sitio de referencia', to: 'forms-reference-site' },
      { title: 'Sitio de interés', to: 'forms-interest-site'},
    ],
  },
]
