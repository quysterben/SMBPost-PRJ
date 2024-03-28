export default function convertRoleToText(role) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'shippingCenter':
      return 'Shipping Center';
    case 'storehouse':
      return 'Storehouse';
    default:
      return 'Customer';
  }
}
