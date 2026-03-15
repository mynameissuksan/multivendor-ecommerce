import StoreCard from "@/components/store/cards/store-card";
import CaegoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import ProductPageContainer from "@/components/store/product-page/container";
import ProductDescription from "@/components/store/product-page/product-info/product-description";
import ProductQuestions from "@/components/store/product-page/product-info/product-questions";
import ProductSpecs from "@/components/store/product-page/product-info/product-specs";
import RelatesProducts from "@/components/store/product-page/product-info/related-product";
import StoreProducts from "@/components/store/product-page/product-info/store-product";
import AddReview from "@/components/store/product-page/reviews/add-review";
import ProductReviews from "@/components/store/product-page/reviews/product-reviews";
import { Separator } from "@/components/ui/separator";
import { getProductPageData, getProducts } from "@/queries/product";
import { notFound, redirect } from "next/navigation";
import { Toaster } from "sonner";

interface PageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
  searchParams: Promise<{
    size?: string;
  }>;
}

export default async function ProductVariantPage({
  params,
  searchParams,
}: PageProps) {
  const { productSlug, variantSlug } = await params;
  const sizeId = (await searchParams).size;
  // fetch product data based
  const productData = await getProductPageData(productSlug);

  // if no product data is found, show the 404 not found page
  if (!productData) {
    return notFound();
  }

  // Extract the available sizes for the selected product variant
  const product = productData?.products[0];
  const variants = product?.product_varian ?? [];

  const selectedVariant =
    variants.find((v) => v.slug === variantSlug) ?? variants[0];
  const sizes = selectedVariant?.sizes;

  //   if size is provided in the url
  if (sizeId) {
    //  check if size is provided sizeId is valid by comparing with available sizes
    const isValidSize = sizes?.some((size) => size.id === sizeId);

    // if the sizeId is not valid, redirect to the same product page without the size page
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes?.length === 1) {
    //  if no sizeId is provided and there's only one size available, automatically select
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`, // redirect to the url with the size parameter prefilled
    );
  }

  const {
    questions,
    variantSpecs,
    productSpecs,
    store,
    followersCount,
    isUserFollowingStore,

    reviews,
  } = productData;

  const relatedProducts = await getProducts(
    {
      subCategory: product.sub_categories?.url,
    },
    "",
    1,
    12,
  );

  // console.log(reviewsStatistics)

  return (
    <div>
      <Header />
      <CaegoriesHeader />
      <div className="max-w-412.5 mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer
          productData={productData}
          sizeId={sizeId}
          variantSlug={variantSlug}
        >
          {relatedProducts && (
            <>
              <Separator />
              {/* Related products */}
              <RelatesProducts products={relatedProducts.products} />
            </>
          )}
          <Separator className="mt-6" />
          {/* Product reviews */}
          <ProductReviews
            productId={product.id!}
            rating={productData.rating}
            statistics={productData}
            reviews={productData.reviews}
            variantsInfo={product.product_varian}
          />

          <>
            <Separator className="mt-6" />
            {/* Product description */}
            <ProductDescription
              text={[product.description!, selectedVariant.description!]}
            />
          </>
          <>
            <Separator className="mt-6" />
            {/* Specs table */}
            <ProductSpecs variant={variantSpecs} product={productSpecs} />
          </>
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              <ProductQuestions questions={questions} />
            </>
          )}
          <Separator className="mt-6" />
          {/* Store card */}
          {store && (
            <StoreCard
              store={{
                id: store.id!,
                name: store.name!,
                url: store.url!,
                logo: store.logo!,
                followerCount: followersCount,
                isUserFollowingStore: isUserFollowingStore,
              }}
            />
          )}
          {/* store products */}
          <StoreProducts
            storeUrl={store!.url!}
            storeName={store!.name!}
            count={6}
          />
        </ProductPageContainer>
      </div>
      {/* Footer */}
      <div className="bg-red-200">
        <Footer />
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
