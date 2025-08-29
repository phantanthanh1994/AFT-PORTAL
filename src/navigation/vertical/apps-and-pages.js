export default [
  { heading: 'Trade' },
  {
    title: 'Sell',
    icon: { icon: 'tabler-shopping-cart' },
    children: [
        {
            title: 'Appropriate purchase order',
            to: 'business-buying-leads',
        },
        {
            title: 'Recommended purchase',
            to: 'business-inquiries',
        },
        {
            title: 'Product',
            to: 'portal-products-my'
        },
        {
            title: 'Contacts',
            to: 'business-contacts'
        },
    ],
  },
]
