from django.utils import timezone
from products.models import Product, ProductVariant


def deduct_stock(order):
    """
    Deduct stock for all items in an order
    """
    for order_item in order.items.all():
        if order_item.variant:
            # Deduct from variant stock
            variant = order_item.variant
            variant.stock -= order_item.quantity
            variant.save()
        else:
            # Deduct from product stock
            product = order_item.product
            product.stock -= order_item.quantity
            product.save()


def restore_stock(order):
    """
    Restore stock for all items in a cancelled order
    """
    for order_item in order.items.all():
        if order_item.variant:
            # Restore variant stock
            variant = order_item.variant
            variant.stock += order_item.quantity
            variant.save()
        else:
            # Restore product stock
            product = order_item.product
            product.stock += order_item.quantity
            product.save()


def mark_order_as_paid(order):
    """
    Mark an order as paid and deduct stock
    """
    order.payment_status = 'paid'
    order.paid_at = timezone.now()
    order.save()
    deduct_stock(order)


def cancel_order(order, cancelled_by, reason=''):
    """
    Cancel an order and restore stock if not yet shipped
    """
    order.status = 'cancelled'
    order.cancelled_at = timezone.now()
    order.cancelled_by = cancelled_by
    order.cancellation_reason = reason
    order.save()

    # Restore stock only if not shipped yet
    if not order.shipped_at:
        restore_stock(order)


def mark_order_received_back(order):
    """
    Mark items as received back after return (for shipped orders)
    """
    order.is_received_back = True
    order.received_back_at = timezone.now()
    order.save()
    restore_stock(order)
