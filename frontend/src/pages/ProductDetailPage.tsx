import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { productsAPI } from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import type { Product, ProductVariant } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Label } from '../components/ui/Label';
import { Typography } from '../components/ui/Typography';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getProduct(slug!);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product) {
      try {
        await addToCart(product.id, selectedVariant?.id, quantity);
        toast({
          variant: 'success',
          title: t.toast.success,
          description: t.toast.addedToCart,
        });
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast({
          variant: 'destructive',
          title: t.toast.error,
          description: t.toast.failedToLoad,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
          <Typography>{t.common.loading}</Typography>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Typography>{t.productDetail.productNotFound}</Typography>
      </Container>
    );
  }

  const price = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.base_price);

  // Group variants by color and size
  const colors = product.variants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : [];
  const sizes = product.variants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8 px-4 md:px-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 !rounded-full hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.productDetail.backToProducts}
        </Button>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className="!border-[#C2B280] dark:!border-[#4B5320] !shadow-lg bg-white/90 dark:bg-[#3A3621]/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div
                  className="w-full aspect-square bg-gradient-to-br from-[#F5F4ED] to-[#D2B48C] dark:from-[#3A3621] dark:to-[#2A2817] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: product.svg_placeholder }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="space-y-6 md:!pl-4">
              <Box>
                <Typography variant="h3" className="font-bold mb-2 !text-[#3B3A2E] dark:!text-[#E8E6D5]">{product.name}</Typography>
                <Typography className="!text-black-600 dark:!text-black-400">{product.category_name}</Typography>
              </Box>

              <Box className="!py-2">
                <Typography variant="h4" className="!font-bold !text-3xl !text-[#6B8E23] dark:!text-[#9C9A73]">{t.common.currency}{price.toFixed(2)}</Typography>
              </Box>

              <Box className="!border-t !border-b !border-[#C2B280] dark:!border-[#4B5320] !py-4">
                <Typography className="!text-black-700 dark:!text-black-300 !leading-relaxed">{product.description}</Typography>
              </Box>

            {colors.length > 0 && (
              <Box>
                <Label className="block text-sm font-medium mb-2 !text-black-700 dark:!text-black-300">{t.productDetail.color}</Label>
                <Box className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedVariant?.color === color ? 'default' : 'outline'}
                      onClick={() => {
                        const variant = product.variants?.find(
                          (v) =>
                            v.color === color &&
                            (sizes.length === 0 || v.size === selectedVariant?.size)
                        );
                        if (variant) setSelectedVariant(variant);
                      }}
                      className={selectedVariant?.color === color ? 'bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]' : '!border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73]'}
                    >
                      {color}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {sizes.length > 0 && (
              <Box>
                <Label className="block text-sm font-medium mb-2 !text-black-700 dark:!text-black-300">{t.productDetail.size}</Label>
                <Box className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedVariant?.size === size ? 'default' : 'outline'}
                      onClick={() => {
                        const variant = product.variants?.find(
                          (v) =>
                            v.size === size &&
                            (colors.length === 0 || v.color === selectedVariant?.color)
                        );
                        if (variant) setSelectedVariant(variant);
                      }}
                      className={selectedVariant?.size === size ? 'bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]' : '!border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73]'}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Stock Availability Section */}
            <Box className="!p-4 !border-2 !rounded-lg !bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30 !border-[#C2B280] dark:!border-[#4B5320]">
              <Typography variant="subtitle1" className="!font-bold !mb-3 !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                Stock Availability
              </Typography>

              {selectedVariant ? (
                <>
                  <Typography variant="h4" className={`!font-bold !mb-2 ${
                    selectedVariant.stock > 0 ? '!text-green-600 dark:!text-green-400' : '!text-red-600 dark:!text-red-400'
                  }`}>
                    {selectedVariant.stock} units available
                  </Typography>

                  {selectedVariant.stock === 0 && (
                    <Typography variant="body2" className="!text-red-600 dark:!text-red-400 !font-medium">
                      ⚠️ Out of stock for this variant
                    </Typography>
                  )}

                  {selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
                    <Typography variant="body2" className="!text-orange-600 dark:!text-orange-400 !font-medium">
                      ⚠️ Only {selectedVariant.stock} left in stock - order soon!
                    </Typography>
                  )}

                  {selectedVariant.stock >= 10 && (
                    <Typography variant="body2" className="!text-green-600 dark:!text-green-400 !font-medium">
                      ✓ In stock and ready to ship
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h4" className={`!font-bold !mb-2 ${
                    product.stock > 0 ? '!text-green-600 dark:!text-green-400' : '!text-red-600 dark:!text-red-400'
                  }`}>
                    {product.stock} units available
                  </Typography>

                  {product.stock === 0 && product.is_one_time && (
                    <Typography variant="body2" className="!text-red-600 dark:!text-red-400 !font-medium">
                      ⚠️ This item is no longer available (one-time item)
                    </Typography>
                  )}

                  {product.stock === 0 && !product.is_one_time && (
                    <Typography variant="body2" className="!text-red-600 dark:!text-red-400 !font-medium">
                      ⚠️ Out of stock - will be restocked soon
                    </Typography>
                  )}

                  {product.stock > 0 && product.stock < 10 && (
                    <Typography variant="body2" className="!text-orange-600 dark:!text-orange-400 !font-medium">
                      ⚠️ Only {product.stock} left in stock - order soon!
                    </Typography>
                  )}

                  {product.stock >= 10 && (
                    <Typography variant="body2" className="!text-green-600 dark:!text-green-400 !font-medium">
                      ✓ In stock and ready to ship
                    </Typography>
                  )}
                </>
              )}
            </Box>

            <Box>
              <Label className="block text-sm font-medium mb-2 !text-black-700 dark:!text-black-300">{t.productDetail.quantity}</Label>
              <Box className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="!border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73] hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
                  disabled={(selectedVariant ? selectedVariant.stock : product.stock) === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Typography variant="h6" className="font-medium w-12 text-center !text-[#3B3A2E] dark:!text-[#E8E6D5]">{quantity}</Typography>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
                    setQuantity(Math.min(maxStock, quantity + 1));
                  }}
                  className="!border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73] hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
                  disabled={(selectedVariant ? selectedVariant.stock : product.stock) === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Box>
            </Box>

            <Button
              size="lg"
              className="w-full !h-12 !text-base !font-semibold bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={(selectedVariant ? selectedVariant.stock : product.stock) === 0}
            >
              {(selectedVariant ? selectedVariant.stock : product.stock) === 0
                ? 'Out of Stock'
                : `${t.productDetail.addToCart} - ${t.common.currency}${(price * quantity).toFixed(2)}`
              }
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
}
