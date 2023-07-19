
export const UserColumn = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'Phone', align: 'center', label: 'Phone', field: 'Phone', sortable: true },
  { name: 'Role', label: 'Role', field: 'Role', sortable: true },
  { name: 'Shop', label: 'Shop', field: 'Shop' },
]

export const UserRows = [

  {
    name: 'Frozen Yogurt',
    Phone: 159,
    Role: 6.0,
    Shop: 24,
    action: "edit"
  },
  {
    name: 'Ice cream sandwich',
    Phone: 237,
    Role: 9.0,
    Shop: 37,
    
    action: "edit"
  },
  {
    name: 'Eclair',
    Phone: 262,
    Role: 16.0,
    Shop: 23,
   
    action: "edit"
  },
  {
    name: 'Cupcake',
    Phone: 305,
    Role: 3.7,
    Shop: 67,
    action: "edit"
  },
  {
    name: 'Gingerbread',
    Phone: 356,
    Role: 16.0,
    Shop: 49,
    action: "edit"
  },
  {
    name: 'Jelly bean',
    Phone: 375,
    Role: 0.0,
    Shop: 94,
    action: "edit"
  },
  {
    name: 'Lollipop',
    Phone: 392,
    Role: 0.2,
    Shop: 98,
    action: "edit"
  },
  {
    name: 'Honeycomb',
    Phone: 408,
    Role: 3.2,
    Shop: 87,
    action: "edit"
  },
  {
    name: 'Donut',
    Phone: 452,
    Role: 25.0,
    Shop: 51,
    action: "edit"
  },
  {
    name: 'KitKat',
    Phone: 518,
    Role: 26.0,
    Shop: 65,
    action: "edit"
  }
  
]
