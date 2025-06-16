import {Routes} from '@angular/router';

export default [
    {
        path: 'product-overview',
        data: { breadcrumb: 'Product Overview' },
        loadComponent: () => import('./productoverview').then((c) => c.ProductOverview)
    },
    {
        path: 'product-list',
        data: { breadcrumb: 'Product List' },
        loadComponent: () => import('./productlist').then((c) => c.ProductList)
    },
    {
        path: 'new-product',
        data: { breadcrumb: 'New Product' },
        loadComponent: () => import('./newproduct').then((c) => c.NewProduct)
    },
    {
        path: 'shopping-cart',
        data: { breadcrumb: 'Shopping Cart' },
        loadComponent: () => import('./shoppingcart').then((c) => c.ShoppingCart)
    },
    {
        path: 'checkout-form',
        data: { breadcrumb: 'Checkout Form' },
        loadComponent: () => import('./checkoutform').then((c) => c.CheckoutForm)
    },
    {
        path: 'order-history',
        data: { breadcrumb: 'Order History' },
        loadComponent: () => import('./orderhistory').then((c) => c.OrderHistory)
    },
    {
        path: 'order-summary',
        data: { breadcrumb: 'Order Summary' },
        loadComponent: () => import('./ordersummary').then((c) => c.OrderSummary)
    }
] as Routes;
