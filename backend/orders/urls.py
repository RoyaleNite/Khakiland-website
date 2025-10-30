from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    CancelOrderView,
    StaffOrderListView,
    StaffOrderDetailView,
    UpdateOrderStatusView,
    StaffCancelOrderView,
    MarkOrderReceivedBackView,
    OrderStatsView,
    OrderInvoiceView,
)

urlpatterns = [
    # User order endpoints
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
    path('<str:order_number>/invoice/', OrderInvoiceView.as_view(), name='order-invoice'),

    # Staff-only order endpoints
    path('staff/all/', StaffOrderListView.as_view(), name='staff-order-list'),
    path('staff/stats/', OrderStatsView.as_view(), name='order-stats'),
    path('staff/<str:order_number>/', StaffOrderDetailView.as_view(), name='staff-order-detail'),
    path('staff/<str:order_number>/update/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('staff/<str:order_number>/cancel/', StaffCancelOrderView.as_view(), name='staff-cancel-order'),
    path('staff/<str:order_number>/received-back/', MarkOrderReceivedBackView.as_view(), name='mark-received-back'),
]
