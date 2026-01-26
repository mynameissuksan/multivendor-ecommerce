import ProductPageContainer from "@/components/store/product-page/container";
import { Separator } from "@/components/ui/separator";
import { getProductPageData } from "@/queries/product";
import { notFound, redirect } from "next/navigation";

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
  const productData = await getProductPageData(productSlug, variantSlug);

  // if no product data is found, show the 404 not found page
  if (!productData) {
    return notFound();
  }

  // Extract the available sizes for the product variant
  const { sizes } = productData?.product[0]?.product_varian[0];

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

  const relatedProducts = {
    products: [],
  };

  const { specs, product, questions } = productData;

  return (
    <div>
      <div className="max-w-412.5 mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related products */}
              Related products
            </>
          )}
          <Separator className="mt-6" />
          {/* Product reviews */}
          Product reviews
          <>
            <Separator className="mt-6" />
            {/* Product description */}
            Product description
          </>
          {specs.length > 0 ||
            (product[0].product_varian.length > 0 && (
              <>
                <Separator className="mt-6" />
                {/* Specs table */}
                Specs table
              </>
            ))}
          {questions && questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              Product Questions
            </>
          )}
          <Separator className="mt-6" />
          {/* Store card */}
          Store card
          {/* store products */}
          store products
        </ProductPageContainer>
      </div>
    </div>
  );
}
